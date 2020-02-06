<template>
      <v-container class="justify-center" fluid>
        <v-row class="justify-center" align="center">
          <v-card class="elevation-12, card">
            <v-toolbar color="primary" dark flat>
              <v-spacer />
              <v-toolbar-title>Venter på spillstart...</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text align="center">
              <v-spacer />
              <h1>{{ Tname }}</h1>
              <h5 class="gameDetail body-2">Spille tid: {{Tstart}} -> {{Tend}} </h5>
              <h2 class="gameDetail">{{Usernamne}}</h2>
              <p class="gameDetail body-1">{{TournDet}}</p>
              <v-spacer />
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
</template>

<script>
import TileHeaderSpace from '../components/TileHeaderSpace'

export default {
  name: 'PlayerLobby',
  components: TileHeaderSpace,
  data () {
    return {
      Tname: 'NTNU Open',
      Tstart: '13:00',
      Tend: '15:30',
      Tpin: '13376',
      Usernamne: 'Ola Nordmann',
      TournDet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ' +
        'et dolore magna aliqua. fgdfgkposdfkgpdfgodskpfgoksdf gosfdk gposd fgkos dfgk psodfgk psdofgkdopfkg sdofpg kdsf okg' +
        'sdfpåg sdfg sdpåfgk dsfåg ksdf gp sdkfågpsdfk gås dfg kpdfg sdfpågkpdskfgæølksd fgå sdpfg kp sdf.'
    }
  }
}
</script>

<style scoped>
  .card{
    display: inline;
    width: auto;
    min-width: 8em;
    max-width: 65em;
    height: auto;
  }

  .gameDetail{
    margin-top: 1.2em;
  }
</style>
