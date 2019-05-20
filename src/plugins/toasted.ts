import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted)

Vue.toasted.register('error', (error: ErrorEvent): string => {
  // eslint-disable-next-line no-console
  console.error(error)
  if (!error.message) {
    return 'Oops.. Something Went Wrong..'
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
