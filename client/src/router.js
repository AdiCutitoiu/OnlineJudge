import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import Agenda from './components/Agenda'
import Patients from './components/Patients'
import Authentication from './components/Authentication'

Vue.use(Router)



export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/agenda',
        name: 'Home',
        component: Agenda
    },
    {
        path: '/patients',
        name: 'Patients',
        component: Patients
    },
    {
        path: '/authentication',
        name: 'Authentication',
        component: Authentication
    }
]
})