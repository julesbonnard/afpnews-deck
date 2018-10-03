import Vue from 'vue'
import VueRouter from 'vue-router'
import Deck from '@/views/Deck'

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
        component: () => import(/* webpackChunkName: "viewer" */ /* webpackPrefetch: true */ '@/views/Viewer'),
        props: true
      },
      {
        name: 'login',
        path: 'login',
        component: () => import(/* webpackChunkName: "login" */ /* webpackPrefetch: true */ '@/views/Login.vue')
      },
      {
        name: 'about',
        path: 'about',
        component: () => import(/* webpackChunkName: "about" */ /* webpackPrefetch: true */ '@/views/About.vue')
      }
    ]
  }
]

export default new VueRouter({
  routes
})
