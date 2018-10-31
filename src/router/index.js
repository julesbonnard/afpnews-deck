import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
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
        props: true,
        meta: {
          analytics: {
            pageviewTemplate (route) {
              const doc = store.getters.getDocumentById(route.params.docId)
              return {
                title: doc.headline,
                page: route.path,
                location: window.location.href,
                dimension1: doc.product,
                dimension2: navigator.onLine.toString()
              }
            }
          }
        }
      },
      {
        name: 'slug',
        path: 'slug/:slugs',
        beforeEnter: async (to, from, next) => {
          await store.dispatch('addColumn', {
            params: {
              query: to.params.slugs.split(',').map(d => `slug:"${d}"`).join(' AND ')
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'login',
        path: 'login',
        component: () => import(/* webpackChunkName: "login" */ /* webpackPrefetch: true */ '@/views/Login.vue')
      },
      {
        name: 'browser-warning',
        path: 'browser-warning',
        component: () => import(/* webpackChunkName: "browser-warning" */ '@/views/BrowserWarning.vue')
      },
      {
        name: 'about',
        path: 'about',
        component: () => import(/* webpackChunkName: "about" */ /* webpackPrefetch: true */ '@/views/About.vue')
      },
      {
        name: 'tour',
        path: 'tour',
        component: () => import(/* webpackChunkName: "tour" */ '@/views/Tour.vue')
      }
    ]
  }
]

export default new VueRouter({
  routes
})
