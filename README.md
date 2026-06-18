# TANIT 4.0 Registration Website

A cinematic, mobile-first React registration experience with a seven-step form, magical-house sorting quiz, downloadable delegate badge, and a Google Sheets backend.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
copy .env.example .env
npm run dev
```

Open `.env` and replace the placeholder with the deployed Apps Script URL:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Build for production with `npm run build`. Deploy the generated `dist` folder to Netlify, Vercel, Firebase Hosting, or any static host. Add the same environment variable in the hosting provider before building.

## Connect Google Sheets

1. Create a new Google Sheet. You may leave it empty.
2. In the Sheet, open **Extensions → Apps Script**.
3. Replace the editor contents with [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. Save the project.
5. Select **Deploy → New deployment → Web app**.
6. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
7. Authorize the script, deploy it, and copy the URL ending in `/exec`.
8. Place that URL in `.env` as `VITE_GOOGLE_SCRIPT_URL`, then restart the development server.

The first submission creates a `Registrations` tab and formats its header row. The backend uses a script lock to prevent simultaneous submissions from colliding and protects the sheet from formula injection.

When you update the Apps Script later, create a **new version** under **Manage deployments → Edit** so the live endpoint receives the changes.

## Customize

- Team members: edit `leadership` and `keyAreas` in `src/data.js`. A member may also have a `hoverPhoto` for the animated alternate portrait shown on hover or tap.
- Houses and quiz: edit `houses` and `quiz` in `src/data.js`.
- Text, fees, and links: edit `src/App.jsx`.
- Colors, type, parchment, animations, and responsive behavior: edit `src/index.css` and `tailwind.config.js`.
- Tote bag: replace the `.tote-preview` placeholder in `src/App.jsx` with an `<img>` once artwork is available.

## Photo upload

The participant photo is validated as JPG, PNG, or GIF with a 50 MB frontend limit. It is converted to Base64 immediately before submission, decoded by Apps Script, uploaded to the configured Drive folder, and saved in the sheet as a shareable `Photo Link`.

The Drive folder ID is configured in `google-apps-script/Code.gs` as `DRIVE_FOLDER_ID`. Uploaded files are granted anyone-with-link view access as requested.

After pasting the latest backend code into Apps Script:

1. Run `setupSheet()` manually once. It clears and rebuilds the `Registrations` sheet, so export existing data first if needed.
2. Authorize Google Sheets and Google Drive permissions.
3. Update the existing web-app deployment with a new version.
4. Keep access set to **Anyone** and execute the web app as **Me**.

## Add the soundtrack

Place your audio file at `public/audio/tanit-theme.mp3`. The floating player will detect it automatically. Audio never autoplays; visitors start and pause it themselves.

Use an MP3 you have permission to publish, ideally 128–192 kbps, under 8 MB, and edited as a seamless loop. The instructions are also available in `public/audio/README.txt`.

## Notes

- No audio autoplays. The visuals are sound-ready if you later add a user-controlled ambience button.
- The experience respects `prefers-reduced-motion`.
- The registration cannot proceed until required fields, all six sorting answers, and the final terms checkbox are complete.
- Never commit the real `.env` file. Only `.env.example` belongs in source control.
