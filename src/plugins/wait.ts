import VueWait from 'vue-wait'
import Vue from 'vue'

Vue.use(VueWait)

export default new VueWait({
  useVuex: true
})
