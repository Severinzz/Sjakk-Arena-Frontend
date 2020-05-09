import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import EnterTourney from '../views/EnterTourney'
import EnterAdminID from '../views/EnterAdminID'
import TournamentCreation from '../views/TournamentCreation.vue'
import PlayerLobby from '../views/PlayerLobby'
import jwtService from '../common/jwt.storage'

Vue.use(VueRouter)

const DEFAULT_TITLE = 'Sjakk Arena'

function routeGuard(from, to, next) {
  let auth = jwtService.getToken()
  if (auth === null) {
    switch (from.name) {
      case 'lobby':
        next({ name: 'tournamentCreation' })
        break
      case 'playerLobby':
        next({ name: 'Enter Tournament' })
        break
      case 'tournament':
        next({ name: 'Enter AdminID' })
        break
      case 'playerDetails':
        next({ name: 'Enter AdminID' })
        break
      default:
        next()
    }
  } else {
    next()
  }
}

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
      title: 'Om Sjakk Arena'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/lobby/:id',
    name: 'lobby',
    // Lazy-load for better performance.
    meta: {
      title: 'Lobby - '
    },
    component: () => import('../views/Lobby'),
    beforeEnter: routeGuard
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
    path: '/enter-AID',
    name: 'Enter AdminID',
    meta: {
      title: 'Skriv inn adminID'
    },
    component: EnterAdminID
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
    component: PlayerLobby,
    beforeEnter: routeGuard
  },
  {
    path: '/tournament/:id',
    name: 'tournament',
    meta: {
      title: 'Turnering - '
    },
    component: () => import('../views/Tournament'),
    beforeEnter: routeGuard
  },
  {
    path: '/tournament/player/:index',
    name: 'playerDetails',
    // TODO: Finne en måte å bruke spiller sitt navn som dynamisk route?
    meta: {
      title: 'Spiller - '
    },
    component: () => import('../views/PlayerDetails'),
    beforeEnter: routeGuard
  },
  {
    path: '/chess-clock',
    name: 'chessClock',
    meta: {
      title: 'sjakkur'
    },
    component: () => import('../views/ChessClock')
  },
  {
    path: '/help',
    name: 'help',
    meta: {
      title: 'Hjelp'
    },
    component: () => import('../views/Help')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

/**
 * Adapted from https://stackoverflow.com/a/45462996
 *
 * Add title to all pages with meta: { title: } defined.
 */
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
