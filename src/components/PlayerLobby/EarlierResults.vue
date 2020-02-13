<template>
  <!-- https://codepen.io/anon/pen/mBwMrm?editors=1000 -->
      <v-card height="auto" class="pa-0">
        <v-layout column fill-height>
          <v-toolbar dense class="primary">
            <v-toolbar-title>Dine resultater</v-toolbar-title>
          </v-toolbar>
          <v-container fluid fill-height>
            <v-layout>
              <!-- https://stackoverflow.com/a/54836170/12885810 -->
              <ul>
                <li v-for="(spill, index) in computedObj" :key="index">
                  <h6 class="body-1">Parti: {{index + 1}} Mot: {{spill.name}}</h6>
                  <p class="body-2 dumdum">Farge: {{spill.color}}</p>
                  <p class="body-2 dumdum">Resultat: {{spill.result}}</p>
                </li>
              </ul>
            </v-layout>
          </v-container>
        </v-layout>
      </v-card>
</template>

<script>
export default {
  name: 'EarlierResults',
  data () {
    return {
      limit: 10,
      resultater: [
        {
          id: 1,
          name: 'Ronald Weasly',
          color: 'Sort',
          result: 0 // enkel 1 for seier, 0.5 for remis og 0 for tap
        },
        {
          id: 2,
          name: 'Dungeon Troll',
          color: 'Hvit',
          result: 1
        },
        {
          id: 3,
          name: 'Legolas',
          color: 'Hvit',
          result: 0.5
        },
        {
          id: 4,
          name: 'Hikaru Nakamura',
          color: 'Sort',
          result: 1
        },
        {
          id: 5,
          name: 'Donald Duck',
          color: 'Hvit',
          result: 1
        },
        {
          id: 6,
          name: 'Jean Luc Picard',
          color: 'Sort',
          result: 1
        },
        {
          id: 7,
          name: 'Qui-Gon Jinn',
          color: 'Hvit',
          result: 0.5
        },
        {
          id: 8,
          name: 'Ekkel jævel med langt navn som ingen liker hvorfor finnes disse ærligtalt',
          color: 'Hvit',
          result: 1
        }
      ]
    }
  },
  computed: {
    computedObj () {
      return this.limit ? this.resultater.slice(0, this.limit) : this.result
    }
  }
}
</script>

<style scoped>
  ul {
    text-align: left;
  }

  .dumdum {
    display: inline-flex;
    margin-right: 1.5em;
  }
</style>
