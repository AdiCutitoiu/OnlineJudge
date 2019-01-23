import Vue from 'vue'
import VueAxios from 'vue-axios'
import './plugins/vuetify'
import App from './App.vue'
import requests from './requests/api'
import router from './router.js'

Vue.config.productionTip = false;
Vue.use(VueAxios, requests());

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
