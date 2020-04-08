import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import EnterTourney from '../views/EnterTourney'
import EnterTID from '../views/EnterTID'
import TournamentCreation from '../views/TournamentCreation.vue'
import PlayerLobby from '../views/PlayerLobby'

Vue.use(VueRouter)

const DEFAULT_TITLE = 'Sjakk Arena'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '*',
    name: 'NotFound',
    meta: {
      title: '404 - Side ikke funnet'
    },
    component: () => import('../views/NotFound')
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: 'Om sjakk arena'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/lobby/:id',
    name: 'Lobby',
    // Lazy-load for better performance.
    meta: {
      title: 'Lobby - '
    },
    component: () => import('../views/Lobby')
  },
  {
    // Add enter player-details for tournament from views for the router to use.
    path: '/enter-tourney',
    name: 'Enter Tournament',
    meta: {
      title: 'Bli med i turnering'
    },
    component: EnterTourney
  },
  {
    // Add host enter tournament ID from views for the router to use
    path: '/enter-TID',
    name: 'Enter TID',
    meta: {
      title: 'Skriv inn admin kode'
    },
    component: EnterTID
  },
  {
    path: '/tournament-creation',
    name: 'tournamentCreation',
    meta: {
      title: 'Opprett turnering'
    },
    component: TournamentCreation

  },
  {
    // TODO: ADD DYNAMIC ROUTE LINK
    // Add a lobby for players
    path: '/player-lobby',
    name: 'playerLobby',
    meta: {
      title: 'Spiller turnering'
    },
    component: PlayerLobby
  },
  {
    path: '/tournament/:id',
    name: 'tournament',
    meta: {
      title: 'Turnering - '
    },
    component: () => import('../views/Tournament')
  },
  {
    path: '/tournament/player/:index',
    name: 'playerdetails',
    // Finne en måte å bruke spiller sitt navn?
    meta: {
      title: 'Spiller - '
    },
    component: () => import('../views/PlayerDetails')
  }
]

const router = new VueRouter({
  routes
})

// Adapted from https://stackoverflow.com/a/45462996
router.beforeEach((to, from, next) => {
  if (to.meta.title !== undefined) {
    let dynamicTitle = to.params.id !== undefined ? to.params.id : ''
    document.title = to.meta.title + dynamicTitle
  } else {
    document.title = DEFAULT_TITLE
  }
  next()
})

export default router
