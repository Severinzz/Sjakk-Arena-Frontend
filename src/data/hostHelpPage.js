const hostHelpPageData = [{
  title: 'Opprett Turnering',
  texts: [
    'For å opprette en turnering, velger du "opprett turnering" på hjemme siden, så fyller du ut skjemaet. ' +
    'Alle intastings felter er obligatoriske. Nederst i skjemaet er to brytere som er valgfrie.' +
    ' Den ene angir om turneringen skal starte når to spillere er påmeldt, den' +
    ' andre gir tilgang til ett inntastingsfelt der du kan anngi når turneringen automatisk skal avslutte'
  ],
  images: [
    require('@/assets/help-page/host/create_tournament.jpg')
  ],
  altTags: [
    'Skjema for å opprette turnering'
  ]
},
{
  title: 'Kast ut spiller',
  texts: [
    'For å kaste ut en spiller før turneringen starter. Så er det bare å trykke på spilleren inne i lobby.',
    'For å kaste ut etter turneringsstart må du velge spilleren i ragneringstabellen, for så å kaste ut spilleren' +
       ' på siden som åpnes i ny fane.',
    'Nederst på siden som åpnes vil det være en rød knapp for å kaste ut spilleren. Ved å trykke på den vil en dialog' +
      ' boks åpnes. Her kan du gi begrunnelse til spilleren for utkastingen.'
  ],
  images: [
    require('@/assets/help-page/host/lobby.jpg'),
    require('@/assets/help-page/host/player_details.jpg'),
    require('@/assets/help-page/host/kick_player.jpg')
  ],
  altTags: [
    'Vert lobby med spillere',
    'Spiller detaljer side',
    'Dialog boks med input for å gi begrunnelse for utkastelse.'
  ]
},
{
  title: 'Oversikt over pågående partier',
  texts: [
    'For å få en oversikt over pågående partier bruker du knappen som heter "Vis parti oversikt".' +
    ' Denne ligger under turneringsinformasjonen. (tittlel, pin, antall spillere etc..). Når den er trykkt vil tabellen' +
      ' som ligger midt på siden bli byttet ut med en tabell som inneholder de på gående partiene.',
    'Du kan enkelt bytte tilbake til å vise rangeringstabellen ved å benytte den samme knappen. '
  ],
  images: [
    require('@/assets/help-page/host/tournament(leaderboard).jpg'),
    require('@/assets/help-page/host/tournament(active_games).jpg')
  ],
  altTags: [
    'Turneringsside med pil som viser knappen for å vise parti oversikt',
    'Turneringsside med pil som viser knappen for å vise rangeringstabell'
  ]
},
{
  title: 'Ugyldige resultat/Uenige spillere',
  texts: [
    'Når to spillere er ikke er enig om resultatet, vil spillet bli lagt i en tabell på vertsiden. Der kan verten sette' +
      ' resultatet til det som verten mener er riktig. Om en av spillerne har lastet opp bildet av sluttstillingen' +
    ' kan dette hentes ut og brukes til vurdering av hva som er riktig resultat',
    ' Når "endre resultat" knappen blir benyttet, kommer det en dialog boks der verten kan sette det resultatet som er' +
      ' rettferdig'
  ],
  images: [
    require('@/assets/help-page/host/invalid_results.jpg'),
    require('@/assets/help-page/host/change_result.jpg')
  ],
  altTags: [
    'Turneringsside som viser hvor vert kan sette resultat på partier med ugyldig resultat',
    'Dialog boks for å sette resultat'
  ]
},
{
  title: 'Sett turnering på pause',
  texts: [
    'I sidebaren der turneringsinformasjonen ligger, er det også en knapp for å sette turneringen på pause. Dette gjør at' +
      ' ingen nye partier vil bli tildelt før turneringen starter igjen. Alle pågående parti vil kunne fortsette som normalt.',
    'For å starte turneringen igjen er det bare å benytte den samme knappen.'
  ],
  images: [
    require('@/assets/help-page/host/pause_tournament.jpg'),
    require('@/assets/help-page/host/continue_tournament.jpg')
  ],
  altTags: [
    'Turneringsside med pil som viser knappen for å sette turnering på pasue',
    'Turneringsside med pil som viser knappen for fortsette turneringen'
  ]
},
{
  title: 'AdminID',
  texts: [
    'Når en turnering blir opprettet vil verten få en unik kode på epost. Denne kan en sende videre til andre slik at' +
      ' de kan hjelpe til med å administrere turneringen.'
  ],
  images: [
    require('@/assets/help-page/host/adminId.jpg')
  ],
  altTags: [
    'Skjema for å skrive inn admin id'
  ]
}
]

export default hostHelpPageData
