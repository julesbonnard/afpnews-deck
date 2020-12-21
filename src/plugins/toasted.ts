import Vue from 'vue'
import Toasted from 'vue-toasted'
import store from '@/store'

Vue.use(Toasted)

Vue.toasted.register('error', (error: ErrorEvent): string => {
  // tslint:disable-next-line no-console
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
  // tslint:disable-next-line no-console
  console.warn(message)
  return `Oops.. ${message}`
}, {
  type: 'error',
  position: 'bottom-center',
  duration: 1500,
  singleton: true
})

Vue.toasted.register('apiError', (error: { code: number, message: string }): string => {
  if (error.code === 401) {
    store.dispatch('logout')
  } else {
    // tslint:disable-next-line no-console
    console.error(error)
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
