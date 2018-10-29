import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Deck from '@/views/Deck'

Vue.use(VueRouter)

let shouldLoadPreferences = true

const routes = [
  {
    name: 'deck',
    path: '/',
    component: Deck,
    beforeEnter: async (to, from, next) => {
      if (shouldLoadPreferences) {
        shouldLoadPreferences = false
        await store.dispatch('initCredentials')
        await store.dispatch('initToken')
        await store.dispatch('resurrectDocuments')
        await store.dispatch('resurrectColumns')
        await store.dispatch('initPreferences')
      }
      next()
    },
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
        beforeEnter: async (to, from, next) => {
          if (!store.getters.getDocumentById(to.params.docId)) {
            try {
              await store.dispatch('getDocument', to.params.docId)
            } catch (error) {
              return next({ name: 'login', query: { redirect: `doc/${to.params.docId}` } })
            }
          }
          next()
        },
        meta: {
          analytics: {
            pageviewTemplate (route) {
              const doc = store.getters.getDocumentById(route.params.docId)
              if (doc) {
                return {
                  title: doc.headline,
                  page: route.path,
                  location: window.location.href,
                  dimension1: doc.product
                }
              }
              return {
                title: document.title,
                page: route.path,
                location: window.location.href
              }
            }
          }
        }
      },
      {
        name: 'slug',
        path: 'slug/:tags',
        beforeEnter: async (to, from, next) => {
          await store.dispatch('addColumn', {
            params: {
              query: to.params.tags.split(',').map(d => `slug:"${d}"`).join(' AND ')
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'event',
        path: 'event/:events',
        beforeEnter: async (to, from, next) => {
          await store.dispatch('addColumn', {
            params: {
              query: to.params.events.split(',').map(d => `event:${d}`).join(' AND ')
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'keyword',
        path: 'keyword/:keywords',
        beforeEnter: async (to, from, next) => {
          await store.dispatch('addColumn', {
            params: {
              query: to.params.keywords.split(',').map(d => `keyword:"${d}"`).join(' AND ')
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'iptc',
        path: 'iptc/:iptc',
        beforeEnter: async (to, from, next) => {
          await store.dispatch('addColumn', {
            params: {
              query: to.params.iptc.split(',').map(d => `iptc:${d}`).join(' AND ')
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
