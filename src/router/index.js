import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import EnterTourney from '../views/EnterTourney'
import EnterTID from '../views/EnterTID'

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
    // Add enter player-details for tournament from views for the router to use.
    path: '/enterTourney',
    name: 'Enter Tournament',
    component: EnterTourney
  },
  {
    // Add host enter tournament ID from views for the router to use
    path: '/enterTID',
    name: 'Enter TID',
    component: EnterTID
  }
]

const router = new VueRouter({
  routes
})

export default router
