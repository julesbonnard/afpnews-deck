import Vue from 'vue'
import VueRouter from 'vue-router'
import Deck from '@/views/Deck'
import Viewer from '@/views/Viewer'

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
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    name: 'about',
    path: '/about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  }
]

export default new VueRouter({
  routes
})
