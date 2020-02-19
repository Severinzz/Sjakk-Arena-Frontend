import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import EnterTourney from '../views/EnterTourney'
import EnterTID from '../views/EnterTID'
import TournamentCreation from '../views/TournamentCreation.vue'
import PlayerLobby from '../views/PlayerLobby'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/lobby/:id',
    name: 'Lobby',
    // Lazy-load for better performance.
    component: () => import('../views/Lobby')
  },
  {
    // Add enter player-details for tournament from views for the router to use.
    path: '/enter-tourney',
    name: 'Enter Tournament',
    component: EnterTourney
  },
  {
    // Add host enter tournament ID from views for the router to use
    path: '/enter-TID',
    name: 'Enter TID',
    component: EnterTID
  },
  {
    path: '/tournament-creation',
    name: 'tournamentCreation',
    component: TournamentCreation

  },
  {
    // TODO: ADD DYNAMIC ROUTE LINK
    // Add a lobby for players
    path: '/player-lobby',
    name: 'playerLobby',
    component: PlayerLobby
  }
]

const router = new VueRouter({
  routes
})

export default router
