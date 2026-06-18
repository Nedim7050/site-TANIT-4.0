/**
 * TANIT 4.0 — Google Sheets registration backend.
 * Bind this Apps Script project to the registration spreadsheet.
 */

const SHEET_NAME = 'Registrations';

// Google Drive folder used for participant photos.
// Replace this value if the destination folder changes.
const DRIVE_FOLDER_ID = '106vT0z_6KWZyT5E4jYPx8ifyCcXvrv4l';

const HEADERS = [
  'Submitted At',
  'Full Name',
  'Country',
  'Entity Name',
  'LC Name',
  'AIESEC Position',
  'CIN Number',
  'Email',
  'Phone',
  'Emergency Phone',
  'Gender',
  'Date of Birth',
  'Allergies',
  'Allergy Details',
  'Chronic Conditions',
  'Chronic Details',
  'Dietary Restrictions',
  'Goals',
  'Sessions',
  'Support',
  'Communication Method',
  'Photo Name',
  'Photo Type',
  'Photo Link',
  'Final Comments',
  'Single Room',
  'Bus Option',
  'Tote Bag',
  'House',
  'Total Price',
  'Terms Accepted'
];

/**
 * Run setupSheet() manually once from the Apps Script editor.
 * WARNING: this intentionally clears the Registrations sheet.
 */
function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground('#0a1428')
    .setFontColor('#d8af55')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.autoResizeColumns(1, HEADERS.length);
}

/**
 * Run this function manually once from the Apps Script editor.
 * It requests the Drive permission and verifies that the deployment owner
 * can access the configured participant-photo folder.
 */
function authorizeDrive() {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  console.log('Drive authorization successful. Photo folder: ' + folder.getName());
  return folder.getName();
}

function doGet() {
  return jsonResponse_({ success: true, service: 'TANIT 4.0 Registration API' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Missing JSON request body.');
    }

    const data = JSON.parse(e.postData.contents);
    validateRegistration_(data);

    let photoLink = '';
    if (data.photoBase64) {
      photoLink = uploadPhoto_(data);
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      const sheet = getRegistrationSheet_();
      sheet.appendRow([
        new Date(),
        safe_(data.fullName),
        safe_(data.country),
        safe_(data.entityName),
        safe_(data.lcName),
        safe_(data.aiesecPosition),
        safe_(data.cinNumber),
        safe_(data.email),
        safe_(data.phone),
        safe_(data.emergencyPhone),
        safe_(data.gender),
        safe_(data.dateOfBirth),
        safe_(data.allergies),
        safe_(data.allergyDetails),
        safe_(data.chronicConditions),
        safe_(data.chronicDetails),
        safe_(data.dietaryRestrictions),
        safe_(data.goals),
        safe_(data.sessions),
        safe_(data.support),
        safe_(data.communicationMethod),
        safe_(data.photoName),
        safe_(data.photoType),
        photoLink,
        safe_(data.finalComments),
        safe_(data.singleRoom),
        safe_(data.busOption),
        safe_(data.toteBag),
        safe_(data.house),
        Number(data.totalPrice) || 105,
        data.termsAccepted === true ? 'Yes' : 'No'
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ success: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ success: false, error: error.message });
  }
}

function uploadPhoto_(data) {
  if (!DRIVE_FOLDER_ID || DRIVE_FOLDER_ID === 'PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE') {
    throw new Error('Google Drive folder ID is not configured.');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(data.photoType)) {
    throw new Error('Unsupported participant photo format.');
  }

  const bytes = Utilities.base64Decode(data.photoBase64);
  if (bytes.length > 50 * 1024 * 1024) {
    throw new Error('Participant photo exceeds the 50MB limit.');
  }

  let folder;
  try {
    folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  } catch (error) {
    throw new Error(
      'Google Drive photo access is not authorized. Run authorizeDrive() ' +
      'from the Apps Script editor and make sure the deployment owner has ' +
      'Editor access to the configured Drive folder.'
    );
  }
  const cleanName = String(data.photoName || 'participant-photo')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueName = Date.now() + '_' + cleanName;
  const blob = Utilities.newBlob(bytes, data.photoType, uniqueName);
  const file = folder.createFile(blob);

  // Some Workspace organizations block public link sharing. The file upload
  // should still succeed in that case, so sharing failure is logged only.
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (sharingError) {
    console.warn('Photo uploaded, but anyone-with-link sharing was blocked: ' + sharingError.message);
  }
  return file.getUrl();
}

function getRegistrationSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('This script must be bound to a Google Sheet.');

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground('#0a1428')
      .setFontColor('#d8af55')
      .setFontWeight('bold');
  }
  return sheet;
}

function validateRegistration_(data) {
  const required = [
    'fullName', 'country', 'entityName', 'lcName', 'aiesecPosition',
    'email', 'phone', 'emergencyPhone', 'gender', 'dateOfBirth',
    'allergies', 'chronicConditions', 'dietaryRestrictions', 'goals',
    'sessions', 'communicationMethod', 'singleRoom', 'busOption',
    'toteBag', 'house'
  ];

  required.forEach(function(key) {
    if (data[key] === undefined || data[key] === null || String(data[key]).trim() === '') {
      throw new Error('Missing required field: ' + key);
    }
  });

  if (data.termsAccepted !== true) throw new Error('Terms and conditions were not accepted.');
  if (!/^\S+@\S+\.\S+$/.test(data.email)) throw new Error('Invalid email address.');
}

function safe_(value) {
  const text = value == null ? '' : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
