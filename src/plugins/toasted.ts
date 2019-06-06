import Vue from 'vue'
import Toasted from 'vue-toasted'
import store from '../store'

Vue.use(Toasted)

Vue.toasted.register('error', (error: ErrorEvent): string => {
  // eslint-disable-next-line no-console
  console.error(error)
  if (!error.message) {
    return 'Oops.. Something went wrong..'
  }
  return `Oops.. ${error.message}`
}, {
  type: 'error',
  position: 'bottom-center',
  duration: 1500,
  singleton: true
})

Vue.toasted.register('warn', (message: string): string => {
  // eslint-disable-next-line no-console
  console.warn(message)
  return `Oops.. ${message}`
}, {
  type: 'error',
  position: 'bottom-center',
  duration: 1500,
  singleton: true
})

Vue.toasted.register('apiError', (error: any): string => {
  // eslint-disable-next-line no-console
  console.error(error)
  if (error.code === 401) {
    store.dispatch('logout')
  }
  if (!error.message) {
    return 'Oops.. Something went wrong with the API..'
  }
  return `Oops.. ${error.message}`
}, {
  type: 'error',
  position: 'bottom-center',
  duration: 1000,
  singleton: true
})
