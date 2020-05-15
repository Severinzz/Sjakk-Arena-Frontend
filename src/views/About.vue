<template>
  <div class="about">
    <h1 align="center">Om Sjakk Arena</h1>
    <v-container>
      <v-row
        class="justify-xl-start"
        align="stretch"
        justify="end"
      >
        <v-col
          cols="12"
          sm="6"
          md="6">
          <p>Denne webapplikasjonen ble laget av studenter fra NTNU Ålesund i bacheloroppgave fra Aalesunds Schaklag.</p>
          <v-card
            locale="no-NO"
            loading-text="Henter terminologier, vennligst vent..."
            color="grey lighten-2">
            <!-- Adapted from: https://vuetifyjs.com/en/components/data-tables/ -->
            <v-card-title>
              Termologier
              <v-spacer/>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Søk"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table class="justify-center"
                          :headers="headers"
                          :items="terminologi"
                          :search="search"
                          items-per-page="5"
            ></v-data-table>
          </v-card>
        </v-col>
        <v-col>
          <p>Skulle det være mangel på sjakklokke for turneringen finnes dette også i applikasjonen, denne fungerer
            slik at en spiller setter opp ønsket starttid og inkrement. Denne spilleren deler da telefonen med sin motspiller.
            Klokken virker da som vanlig sjakkur hvor en spiller gjør sitt trekk og trykker på sin knapp på uret for å
            la motspiller gjøre sitt trekk.
            <router-link to="/chess-clock" target="_blank">Klikk her for å åpne i ny fane.</router-link>
          </p>
          <p>
            Applikasjonen lar deg som turneringsvert sette opp turnering hvor du bestemmer start-og slutt-tidspunkt.
            Applikasjonen sørger deretter for å matche riktige spillere basert på opptjente poeng mot hverandre, farge
            og hvilket bord de skal spille på, samt vise poengoversikt og spillerne i turneringen. Som vert kan du også
            sette resultat for partier skulle spillerne ikke være enige med hverandre.
          </p>
          <p>
            Som spiller vil applikasjonen la deg registreres til en turnering med et ønsket navn.
            Du vil etterhvert som turneringen starter bli tildelt en motspiller, bord og farge. Når dere har fullført
            partiet skal dere registrere resultatet, den som først registrer vil sende denne som forslag til sin motspiller.
            Denne motspilleren vil da få valget om å godkjenne eller underkjenne forslaget. Blir forslaget underkjent
            vil begge spillerne bli bedt om å gå til turneringsvert som da vil bestemme resultatet. Dette vil koste begge
            spillerne tid, så dette bør ungås om turneringen har høy spilltempo.
            <strong> Husk at verten kan velge å kaste ut spillere!</strong>
          </p>
          <p>
            For mer informasjon om hvordan du bruker applikasjonen,
            <strong>
              <router-link to="/help">
            se her.
              </router-link>
            </strong>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Terminologi (sjakk)',
          align: 'center',
          value: 'term'
        },
        { text: 'Betydning', value: 'meaning' }
      ],
      terminologi: [
        {
          term: 'Remis',
          meaning: 'Uavgjort'
        },
        {
          term: '1 - 0',
          meaning: 'Poeng utdeling, hvit er foran bindestrek og sort bak. "0.5 - 0.5" betyr uavgjort.'
        },
        {
          term: 'Sjakkmatt',
          meaning: 'Konge er satt i en posisjon der den er direkte truet, men kan ikke gå noen steder uten å bli tatt i neste trekk.'
        },
        {
          term: 'Sjakk',
          meaning: 'Kongen er direkte truet.'
        },
        {
          term: 'Patt',
          meaning: 'En spiller står ikke i sjakk, men har ingen lovlige trekk i sin tur. Dette fører til uavgjort! Stalemate på engelsk.'
        },
        {
          term: 'Trekk gjentagelse',
          meaning: 'En posisjon har blitt gjentatt flere ganger, ofte når en posisjon er oppstått tre ganger kan spillerne kreve remis!'
        },
        {
          term: 'En passant',
          meaning: 'Spesiell bonde trekk hvor en bonde tar motsatt på bonde som har akkurat flyttet seg to felt frem, som om den gikk ett.'
        },
        {
          term: 'Sjakknotasjon',
          meaning: 'Hvordan sjakktrekk blir skrevet på. + = sjakk, # = sjakkmatt F.EKS. Nxf4 betyr springer flytter og tar en mot brikke på felt f3.'
        },
        {
          term: 'Felt',
          meaning: 'Felt menes med spesifikk rute på brettet. Vertikale linjene blir betegnet med bokstaver fra A til H, horisontale blir med tall fra 1 til 8. F.EKS. A1 er på hvit venstre hjørne og H8 er på sorts venstre hjørne.'
        },
        {
          term: 'Promotering',
          meaning: 'Når en bonde kommer seg helt til motsatt side kan bonden blir byttet til en annen brikke, du bestemmer selv hvilken brikke.'
        },
        {
          term: 'Rokade',
          meaning: 'Kongen flyttes to felt mot ett av tårnene og dette tårnet flyttes på andre siden av kongen. Dette kan kun gjøres om kongen og tårnet ikke har blitt flyttet på eller kongen flyttes gjennom sjakk. Kongen må flyttes først!'
        },
        {
          term: 'Konge',
          meaning: 'Kongen er spillets viktigste brikke, målet med spillet er å ta motspillers konge. Denne brikken kan bare bevege seg ett felt i alle retninger om gangen (utenom rokade). Hvit konge starter på E1 og sort på E8'
        },
        {
          term: 'Dronning',
          meaning: 'Spillets mektigste brikke. Dronningen kan gå så langt hun vil på skrå, fram, bak og til sidene. Hun er en kombinasjon mellom tårn og løper. Hvit dronning starter på D1 og sort på D8.'
        },
        {
          term: 'Tårn',
          meaning: 'Tårnene er brikkene som står nede helt i hjørnet når du spiller. Disse kan gå så langt fram, bak og sidelengs du ønsker så lenge de ikke blir blokkert av en annen brikke. Hvite tårn starter på A1 og H1, sort på A8 og H8.'
        },
        {
          term: 'Løper',
          meaning: 'Løperne har kongen og dronningen mellom seg, disse brikkene kan bare bevege seg på skrått. Men de kan gå langt de vil så lenge de ikke blir blokkert. Hvite starter på C1 og F1 sort på C8 og F8'
        },
        {
          term: 'Springer',
          meaning: 'Brikken som ligner på hest, denne brikken beveger seg helt unikt fra de andre. To felt opp/ned og ett felt høyre eller venstre fra der. Eller to felt høyre/venstre så ett felt opp eller ned. Eneste brikken som hopper over andre brikker. Hvite springere starter på B1 og F1, sorte på B8 og F8.'
        },
        {
          term: 'Bonde',
          meaning: 'Spillets infanteri. Begge spillere starter med 8 bønder på linje foran offiserer. Disse bøndene kan bare gå ett felt rett frem med unntak av første trekk hvor de kan gå to, eller når de skal slå andre brikker, hvor de slår på skrå.'
        },
        {
          term: 'Offiser',
          meaning: 'Betegnelse på brikker som ikke er bonde eller konge, men konge kan telles som offiser i noen situasjoner.'
        },
        {
          term: 'Brikkeverdi',
          meaning: 'En numerisk fremføring av hvor viktige brikkene er. Disse er ikka fastsatt og varierer fra situasjon til situasjon. Kan brukes som generell pekepinne på hvem som ligger best ann. Dronning: 9, Tårn: 5, Springer: 3, Løper: 3, bonde: 1.'
        },
        {
          term: 'Lynsjakk',
          meaning: 'Når hver spiller starter med 5 minutter eller mindre i betenkningstid. Her finnes varianter hvor spillere også får noen sekunder ekstra mellom hvert trekk i form av inkrement eller forsinkelse.'
        },
        {
          term: 'Hurtigsjakk',
          meaning: 'Når hver spiller starter med mellom 5 til 25 minutter i betenkningstid. Her finnes varianter hvor spillere også får noen sekunder ekstra mellom hvert trekk i form av inkrement eller forsinkelse.'
        },
        {
          term: 'Langsjakk',
          meaning: 'Spillere starter med mer enn 25 minutter, men ofte 1 time 40 minutter i eliteklassen. Her finnes varianter hvor spillere får ekstra tid etter bestemte antall trekk.'
        },
        {
          term: 'Betenkningstid',
          meaning: 'Tiden spillere har for å fullføre partiet sitt. Her er det ofte også ekstra tid etter hvert trekk eller etter bestemt antall trekk. Inkrement er tid blir lagt til etter hvert trekk, forsinkelse er at klokken ikke teller ned før forsinkelse tiden har gått ut.'
        },
        {
          term: 'Armageddon',
          meaning: 'Armageddon er et parti type hvor sort starter med lenger tid enn hvit. Hvit spiller vinner hvis sort blir satt i sjakkmatt, gir seg eller går tom for tid. I tilfeller hvor det blir remis, blir sort utnevnt som vinner av partiet. Her er det garantert en som vinner!'
        }
      ]
    }
  }
}
</script>
