import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// TODO CHECK IF POSSIBLE TO ADD VUEAXIOS AND AXIOS HERE, REDUCE NEEDS OF IMPORTS ELSE WHERE

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
