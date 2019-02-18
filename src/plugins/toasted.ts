import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted)

Vue.toasted.register('error', (payload: ErrorEvent): string => {
  if (!payload.message) {
    return 'Oops.. Something Went Wrong..'
  }
  return `Oops.. ${payload.message}`
}, {
  type: 'error',
  position: 'bottom-center',
  duration: 1500
})
