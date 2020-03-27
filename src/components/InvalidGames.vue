<template>
<v-card height="auto" class="pa-0">
  <v-layout column fill-height>
    <v-toolbar dense class="primary">
      <v-toolbar-title>Spill med ugyldige resultater</v-toolbar-title>
    </v-toolbar>
    <v-container fluid fill-height>
      <v-layout>
        <ul>
          <li v-for="(games, index) in computedObj" :key="index"></li>
          <h6 class="body-1">Parti: {{game_id}}, Bord: {{table}}</h6>
          <p class="body-2">Spillere: {{white_player_name}} og {{black_player_name}}</p>
          <p class="body-2">Hvit spiller poeng: {{white_player_points}}</p>
        </ul>
      </v-layout>
    </v-container>
  </v-layout>
</v-card>
</template>

<script>
export default {
  name: 'InvalidGames',
  data () {
    return {
      limit: 10,
      disapprovedGames: [
        {
          game_id: 1,
          white_player_name: 'Magnus',
          black_player_name: 'Dumbledore',
          table: 4,
          white_player_points: 1
        },
        {
          game_id: 3,
          white_player_name: 'Cevita',
          black_player_name: 'Coop',
          table: 2,
          white_player_points: 0.5
        },
        {
          game_id: 5,
          white_player_name: 'Kåre',
          black_player_name: 'Hikaru',
          table: 1,
          white_player_points: 0
        },
        {
          game_id: 4,
          white_player_name: 'Svein',
          black_player_name: 'Magnus',
          table: 5,
          white_player_points: 1
        },
        {
          game_id: 10,
          white_player_name: 'Hikaru',
          black_player_name: 'Capablanca',
          table: 4,
          white_player_points: 0.5
        }
      ]
    }
  },
  computed () {
    return this.limit ? this.disapprovedGames.slice(0, this.limit) : this.disapprovedGames
  }
}
</script>

<style scoped>

</style>
