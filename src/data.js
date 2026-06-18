export const logoUrl = 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781786661/logo_tanit_4.0_uo1x1r.png'

export const leadership = [
  {
    name: 'Amine Ben Attaya',
    role: 'Conference Manager',
    area: 'Conference Leadership',
    quote: 'Great stories begin when brave people gather.',
    photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781793186/image_2026-06-18_153252613_y6duon.png'
  },
  {
    name: 'Siwar Melki',
    role: 'OCP',
    area: 'Organizing Committee President',
    quote: 'Every unforgettable chapter begins with a team that believes.',
    photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781788731/image_2026-06-18_141843007_xw3t5g.png'
  }
]

export const keyAreas = [
  {
    key: 'comm',
    name: 'COMM',
    subtitle: 'The ANBU Black Ops',
    description: 'The hidden creative force shaping the identity, story, and visual magic of TANIT 4.0.',
    members: [
      { name: 'Nedim Mejri', role: 'OCVP COMM', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781787140/nadou_mask_on_xncs1o.png', hoverPhoto: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781786976/naddou_anbu_rxhahb.png' },
      { name: 'Nour Dardouri', role: 'OC COMM', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781787142/dardouri_mask_on_b9zd1x.png', hoverPhoto: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781786976/dardouri_anbu_shs1li.png' },
      { name: 'Chahd Errokh', role: 'OC COMM', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781787139/chahd_masque_on_euw8gs.png', hoverPhoto: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781786976/chahd_anbu_lug9to.png' },
      { name: 'Ines Boujemaa', role: 'OC COMM', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781787155/ines_mask_onpng_a1qqhe.png', hoverPhoto: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781786976/ines_boujemaa_anbu_pbtonf.png' }
    ]
  },
  {
    key: 'dxp',
    name: 'DXP & Finance',
    subtitle: 'The House of Experience',
    description: 'Guardians of the delegate journey, the conference atmosphere, and every carefully balanced detail.',
    members: [
      { name: 'Iyed Menzli', role: 'OCVP DXP & Finance', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781789142/image_2026-06-18_142538787_sjt7vl.png' },
      { name: 'Rania Haj Kassem', role: 'OC DXP & Finance', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781789257/image_2026-06-18_142734550_fi0oil.png' },
      { name: 'Aya Souli', role: 'OC DXP & Finance', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781791772/Screenshot_2026-06-09_025224_qoauyx.png' }
    ]
  },
  {
    key: 'log',
    name: 'LOG',
    subtitle: 'The Keepers of the Grounds',
    description: 'The operational spellcasters making sure every place, movement, and moment works flawlessly.',
    members: [
      { name: 'Rahma Meskini', role: 'OCVP LOG', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781789187/image_2026-06-18_142620430_rpupaw.png' },
      { name: 'Omar Boudaya', role: 'OC LOG', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781789168/image_2026-06-18_142606761_y9vwkp.png' },
      { name: 'Ghofrane Klai', role: 'OC LOG', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781789244/image_2026-06-18_142719551_m6mvdc.png' },
      { name: 'Ines Chorfi', role: 'OC LOG', photo: 'https://res.cloudinary.com/dygmnj3xw/image/upload/q_auto/f_auto/v1781791772/Screenshot_2026-06-09_025559_c8rhqx.png' }
    ]
  }
]

export const houses = {
  phoenix: { name: 'Phoenix House', color: '#d8653b', trait: 'Brave · Bold · Leader', icon: '✦' },
  serpent: { name: 'Serpent House', color: '#4a9a72', trait: 'Strategic · Ambitious · Sharp', icon: '◈' },
  raven: { name: 'Raven House', color: '#5685c4', trait: 'Wise · Creative · Analytical', icon: '◆' },
  badger: { name: 'Badger House', color: '#d4aa46', trait: 'Loyal · Warm · Team player', icon: '✺' }
}

export const quiz = [
  { q: 'A sealed door blocks your path. What do you do?', a: [['Push forward without fear','phoenix'],['Study the lock and find its weakness','serpent'],['Search the library for an old spell','raven'],['Gather the group and solve it together','badger']] },
  { q: 'Which quality do you value most?', a: [['Courage','phoenix'],['Determination','serpent'],['Imagination','raven'],['Kindness','badger']] },
  { q: 'Your team faces an impossible deadline. You…', a: [['Rally everyone with a bold plan','phoenix'],['Prioritize what creates the biggest win','serpent'],['Design a smarter way to work','raven'],['Make sure nobody gets left behind','badger']] },
  { q: 'Choose a magical companion.', a: [['A fiery falcon','phoenix'],['A silver viper','serpent'],['A midnight raven','raven'],['A golden badger','badger']] },
  { q: 'Where would we find you after midnight?', a: [['Exploring a forbidden corridor','phoenix'],['Planning tomorrow by the fireplace','serpent'],['Reading under a floating candle','raven'],['Sharing stories in the common room','badger']] },
  { q: 'What legacy would you like to leave?', a: [['I inspired people to act','phoenix'],['I turned ambition into impact','serpent'],['I created an idea that changed things','raven'],['I made people feel they belonged','badger']] }
]
