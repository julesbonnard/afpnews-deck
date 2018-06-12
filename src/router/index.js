import Vue from 'vue'
import VueRouter from 'vue-router'
import Deck from '@/components/Deck'
import MultiViewer from '@/components/MultiViewer'
import Login from '@/components/Login'
import About from '@/components/About'

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
        component: MultiViewer,
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
