import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Lobby from '../views/Lobby'
import EnterTourney from '../views/EnterTourney'
import EnterTID from '../views/EnterTID'
import TournamentCreation from '../views/TournamentCreation.vue'

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

    path: '/lobby',
    name: 'Lobby',
    component: Lobby
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

  }
]

const router = new VueRouter({
  routes
})

export default router
