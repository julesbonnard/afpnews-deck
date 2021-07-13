import VueWait from 'vue-wait'
import Vue from 'vue'

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    wait?: VueWait
  }
}

Vue.use(VueWait)

export default new VueWait({
  useVuex: true
})
