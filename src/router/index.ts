import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Deck from '@/views/Deck.vue'
import Login from '@/views/Login.vue'
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
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      analytics: {
        pageviewTemplate (route: Route) {
          return {
            title: 'Login | AFP Deck',
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
        path: '/doc/:docId',
        alias: 'doc/:docId',
        component: () =>
          import(/* webpackChunkName: "viewer" */ /* webpackPrefetch: true */ '@/views/Viewer/index.vue'),
        props: true,
        meta: {
          analytics: {
            pageviewTemplate (route: Route) {
              const doc = store.getters.getDocumentById(route.params.docId)
              if (!doc) return
              return {
                title: `${doc.headline} | AFP Deck`,
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
        path: '/slug/:lang/:slugs',
        alias: 'slug/:lang/:slugs',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            type: 'search',
            params: {
              langs: [store.state.defaultLang || store.state.locale],
              query: to.params.slugs.split(',').map(d => `slug:${wrapDoubleQuotes(d)}`).join(' AND ')
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'topic',
        path: '/topic/:lang/:topic',
        alias: 'topic/:lang/:topic',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            type: 'topic',
            params: {
              products: ['multimedia'],
              langs: [store.state.defaultLang || store.state.locale],
              topics: to.params.topic.split('|')
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'place',
        path: '/place/:country/:city?',
        alias: 'place/:country/:city?',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            type: 'search',
            params: {
              langs: [store.state.defaultLang || store.state.locale],
              query: to.params.city ? `country:${wrapDoubleQuotes(to.params.country)} AND city:${wrapDoubleQuotes(to.params.city)}` : `country:${wrapDoubleQuotes(to.params.country)}`
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'genre',
        path: '/genre/:genre',
        alias: 'genre/:genre',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            type: 'search',
            params: {
              langs: [store.state.defaultLang || store.state.locale],
              query: `genre:${wrapDoubleQuotes(to.params.genre)}`
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'event',
        path: '/event/:event',
        alias: 'event/:event',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            type: 'search',
            params: {
              langs: [store.state.defaultLang || store.state.locale],
              query: `event:"afpevent:${to.params.event}"`
            }
          })
          next({ name: 'deck' })
        }
      },
      {
        name: 'creator',
        path: '/creator/:creator',
        alias: 'creator/:creator',
        beforeEnter: (to, _, next) => {
          store.commit('addColumn', {
            type: 'search',
            params: {
              langs: [store.state.defaultLang || store.state.locale],
              query: `creator:${wrapDoubleQuotes(to.params.creator)}`
            }
          })
          next({ name: 'deck' })
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
                title: 'About | AFP Deck',
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
  routes,
  scrollBehavior (to) {
    if (to.hash) {
      document.querySelector(to.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
})
