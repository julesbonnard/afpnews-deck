import Vue from 'vue'
import Modernizr from 'modernizr'

const modernizr = {
  supportAllFeatures: Object.values(Modernizr).every(d => d === true),
  unsupportedFeatures: Object.entries(Modernizr).filter(([key, value]) => !value),
  ...Modernizr
}

const Plugin = {
  install (vm: typeof Vue) {
    vm.prototype.$modernizr = modernizr
  }
}

Vue.use(Plugin)

export default modernizr
