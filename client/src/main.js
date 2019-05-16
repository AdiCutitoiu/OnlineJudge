import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueCodemirror from 'vue-codemirror'
import './plugins/vuetify'
import App from './App.vue'
import requests from './requests/api'
import router from './router.js'
import Vuetify from 'vuetify'

Vue.config.productionTip = false;
Vue.use(VueAxios, requests());

Vue.use(VueCodemirror, {
  options: {
    theme: 'base16-dark'
  }
});

Vue.use(Vuetify, {
  theme: {
    primary: '#e13b1a'
  }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
