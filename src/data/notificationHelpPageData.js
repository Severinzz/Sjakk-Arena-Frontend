const MOBILEDESCRIPTION = 'Her kan du ser hvordan man kan endre varslings instillingene til nettstedet. ' +
  'På mobil så vil du alltid kunne trykke på "nettstedinstillinger" ' +
  'når du får varsel, og bli navigert til instillingene.'

const DESKTOPDESCRIPTION = 'Her kan du se hvordan man endrer varslings instillingene til nettstedet. ' +
  'Du kan også trykke på tannhjulet i varselen for å enkelt endre instillinger.'

const notificationHelpPageData = [{
  title: 'Mozilla Firefox',
  icon: 'fab fa-firefox-browser',
  description: DESKTOPDESCRIPTION,
  texts: [
    'For å se hvilke tillatelser du har gitt dette nettstede så går du til adressefeltet og ser etter en hengelås. ' +
      'Når du har funnet hengelåsen trykker du på den, og en informasjons boks vil vises. ' +
      'Ved å trykke på "X" vedsiden av "Sende varsler" vil du ikke bli sendt varsler lenger, men du vil bli spørt på nytt ' +
      'når du går inn i en ny turnering. For å da ikke mota varsler er det bare å velge "tillat aldri". Om du angrer ' +
      'og alikevel vil mota varsler, så endres dette på samme måte.'
  ],
  images: [
    require('@/assets/help-page/firefox/firefox2.png')
  ],
  altTags: [
    'Dialog box for å endre varslings instillinger'
  ]
},
{
  title: 'Google Chrome',
  icon: 'fab fa-chrome',
  texts: [
    '1. For å endre nettsted tillatelser i Google Chrome, så trykker du først på hengelåsen i adressefeltet.',
    '2. Så i boksen som dukker opp, velger du "site settings" eller "nettstedinstillinger".',
    '3. I siden du da kommer inn i, så kan du velge å bruke søkefeltet øverst for å finne notifikasjoner, eller bla ' +
      'nedover til du finner dene instillingen.'
  ],
  description: DESKTOPDESCRIPTION,
  images: [
    require('@/assets/help-page/chrome/chrome1.png'),
    require('@/assets/help-page/chrome/chrome2.png'),
    require('@/assets/help-page/chrome/chrome3.png')
  ],
  altTags: [
    'Pil til hengelås i adressefelt',
    'Pil til side instillinger i dialog box fra hengelås',
    'Pil til notifikasjons instillinger i instilling siden'
  ]
},
{
  title: 'Google Chrome (Mobil)',
  icon: 'fab fa-chrome fab fa-android',
  icon2: 'fab fa-android',
  description: MOBILEDESCRIPTION,
  texts: [
    '1. For å navigere til instillingene via nettleseren, se i adressefeltet og finn hengelåsen. Trykk på denne.',
    '2. Når du trykker på hengelåsen vil en slik informasjon boks vises. Velg der etter nettstedinstillinger.',
    '3. Finn varsler og trykk på denne, en ny meny vil åpnes.',
    '4. Her kan du endre diverse instillinger, blant annet nekte nettstedet tilgang til å sende varsler.'
  ],
  images: [
    require('@/assets/help-page/mobile/chrome/chrome_mobile1.png'),
    require('@/assets/help-page/mobile/chrome/chrome_mobile2.png'),
    require('@/assets/help-page/mobile/chrome/chrome_mobile3.png'),
    require('@/assets/help-page/mobile/chrome/android.png')
  ],
  altTags: [
    'Pil til hengelås i adressefelt',
    'Pil til side instillinger i dialog box fra hengelås',
    'Pil til notifikasjons instillinger i instilling siden',
    'Notifikasjon instillinger for android telefoner'
  ]
},
{
  title: 'Samsung Internett (Mobil)',
  icon2: 'fab fa-android',
  label: 'Samsung Internett',
  description: MOBILEDESCRIPTION,
  texts: [
    '1. Velg hamburger menyen nede i venstre hjørnet av nettleseren.',
    '2. Finn tannhjulet/instillinger i menyen som dukker opp.',
    '3. Let etter "nettsteder og nedlastinger" som ligger under "Avansert".',
    '4. Deretter finner du varsler.',
    '5. I hjørnet oppe til høgre finner du en meny bestående av tre dotter. Åpn denne menyen og velg tillat eller blokker.',
    '5. Så i den siste menyen kan den øverste knappen slå av varslinger for alle nettsteder, eller du kan bla gjennom &' +
    ' finne sjakk-arena for å slå av for dette nettstedet.'
  ],
  images: [
    require('@/assets/help-page/mobile/samsung-int/Samsung_int1.png'),
    require('@/assets/help-page/mobile/samsung-int/Samsung_int2.png'),
    require('@/assets/help-page/mobile/samsung-int/Samsung_int3.png'),
    require('@/assets/help-page/mobile/samsung-int/Samsung_int4.png'),
    require('@/assets/help-page/mobile/samsung-int/Samsung_int5.png'),
    require('@/assets/help-page/mobile/samsung-int/Samsung_int6.png')
  ],
  altTags: [
    'Pil til menyen i nettleseren',
    'Pil til instillinger i nettleser menyen',
    'Internett-instillinger side, med pil til nettsteder og nedlastinger.',
    'Nettsteder og nedlastinger side, med pil til varsler',
    'Pil til meny i varsler siden',
    'Side for å skru av og på varsler for nettlesern eller enkelt sider.'
  ]
}
]

export default notificationHelpPageData
