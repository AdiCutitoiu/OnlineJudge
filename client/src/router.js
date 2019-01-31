import Vue from 'vue'
import Router from 'vue-router'
import Agenda from './components/Agenda'
import Patients from './components/Patients'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
    {
        path: '/',
        name: 'Home',
        component: Agenda
    },
    {
        path: '/patients',
        name: 'Patients',
        component: Patients
    }
]
})