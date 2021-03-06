import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Deck from '@/views/Deck.vue'
import { Route, RouteConfig } from 'vue-router/types/index'

Vue.use(VueRouter)

function wrapDoubleQuotes (str: string): string {
  if (str.includes(' ')) {
    return `"${str}"`
  }
  return str
}

const routes: RouteConfig[] = [
  {
    name: 'deck',
    path: '/',
    component: Deck,
    meta: {
      analytics: {
        pageviewTemplate (route: Route) {
          return {
            title: 'AFP Deck',
            page: route.path,
            location: window.location.href,
            dimension2: navigator.onLine.toString(),
            dimension3: store.getters.isAuthenticated.toString()
          }
        }
      }
    },
    children: [
      {
        path: 'doc',
        redirect: '/'
      },
      {
        name: 'document',
        path: 'doc/:docId',
        component: () =>
          import(/* webpackChunkName: "viewer" */ /* webpackPrefetch: true */ '@/views/Viewer/index.vue'),
        props: true,
        meta: {
          analytics: {
            pageviewTemplate (route: Route) {
              const doc = store.getters.getDocumentById(route.params.docId)
              if (!doc) return
              return {
                title: doc.headline,
                page: route.path,
                location: window.location.href,
                dimension1: doc.product,
                dimension2: navigator.onLine.toString(),
                dimension3: store.getters.isAuthenticated.toString()
              }
            }
          }
        }
      },
      {
        name: 'slug',
        path: 'slug/:slugs',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            params: {
              query: to.params.slugs.split(',').map(d => `slug:${wrapDoubleQuotes(d)}`).join(' AND ')
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'place',
        path: 'place/:country/:city?',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            params: {
              query: to.params.city ? `country:${wrapDoubleQuotes(to.params.country)} AND city:${wrapDoubleQuotes(to.params.city)}` : `country:${wrapDoubleQuotes(to.params.country)}`
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'genre',
        path: 'genre/:genre',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            params: {
              query: `genre:${wrapDoubleQuotes(to.params.genre)}`
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'event',
        path: 'event/:event',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            params: {
              query: `event:"afpevent:${to.params.event}"`
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'creator',
        path: 'creator/:creator',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            params: {
              query: `creator:${wrapDoubleQuotes(to.params.creator)}`
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'login',
        path: 'login',
        component: () => import(/* webpackChunkName: "login" */ /* webpackPrefetch: true */ '@/views/Login.vue'),
        meta: {
          analytics: {
            pageviewTemplate (route: Route) {
              return {
                title: 'AFP Deck - Login',
                page: route.path,
                location: window.location.href,
                dimension2: navigator.onLine.toString(),
                dimension3: store.getters.isAuthenticated.toString()
              }
            }
          }
        }
      },
      {
        name: 'about',
        path: 'about',
        component: () => import(/* webpackChunkName: "about" */ /* webpackPrefetch: true */ '@/views/About.vue'),
        meta: {
          analytics: {
            pageviewTemplate (route: Route) {
              return {
                title: 'AFP Deck - About',
                page: route.path,
                location: window.location.href,
                dimension2: navigator.onLine.toString(),
                dimension3: store.getters.isAuthenticated.toString()
              }
            }
          }
        }
      }
    ]
  }
]

export default new VueRouter({
  routes
})
