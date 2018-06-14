import Vue from 'vue'
import VueRouter from 'vue-router'
import Deck from '@/pages/Deck'
import Viewer from '@/pages/Viewer'
import Login from '@/pages/Login'
import About from '@/pages/About'

Vue.use(VueRouter)

const routes = [
  {
    name: 'deck',
    path: '/',
    component: Deck,
    children: [
      {
        path: 'doc',
        redirect: '/'
      },
      {
        name: 'document',
        path: 'doc/:docId',
        component: Viewer,
        props: true
      }
    ]
  },
  { name: 'login', path: '/login', component: Login },
  { name: 'about', path: '/about', component: About }
]

export default new VueRouter({
  routes
})
