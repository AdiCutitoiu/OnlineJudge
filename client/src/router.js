import Vue from 'vue'
import Router from 'vue-router'
import Challenges from './components/Challenges'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Challenges
        }, {
            path: '/users',
            name: 'Users',
            component: Challenges
        }
    ]
})