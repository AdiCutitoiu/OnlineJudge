import Vue from 'vue'
import Router from 'vue-router'
import Challenges from './components/Challenges'
import Challenge from './components/Challenge'


Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/challenges',
            name: 'Challenges',
            component: Challenges
        }, {
            path: '/challenges/:id',
            name: 'Challenge',
            component: Challenge,
        }, {
            path: '/users',
            name: 'Users',
            component: Challenges
        }
    ]
})