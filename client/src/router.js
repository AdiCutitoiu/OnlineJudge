import Vue from 'vue'
import Router from 'vue-router'
import Challenges from './components/Challenges'
import Challenge from './components/Challenge'
import NewChallenge from './components/NewChallenge'
import Users from './components/Users'
import Articles from './components/Articles'
import NewArticle from './components/NewArticle'
import Article from './components/Article'
import Submissions from './components/Submissions'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/challenges'
    }, {
      path: '/challenges',
      name: 'Challenges',
      component: Challenges
    }, {
      path: '/challenges/new',
      name: 'NewChallenge',
      component: NewChallenge
    }, {
      path: '/challenges/:id',
      name: 'Challenge',
      component: Challenge,
    }, {
      path: '/users',
      name: 'Users',
      component: Users
    }, {
      path: '/articles',
      name: 'Articles',
      component: Articles
    }, {
      path: '/articles/new',
      name: 'NewArticle',
      component: NewArticle
    }, {
      path: '/articles/:id',
      name: 'Article',
      component: Article,
    }, {
      path: '/submissions',
      name: 'Submissions',
      component: Submissions
    }
  ]
})