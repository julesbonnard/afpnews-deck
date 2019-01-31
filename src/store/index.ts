import Vue from 'vue'
import Vuex from 'vuex'
import getDefaultState from '@/store/state'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import { initCredentials, persistCredentials } from '@/store/plugins/saveCredentials'
import { initState, persistState } from '@/store/plugins/saveState'
import { ui } from '@/store/plugins/ui'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: getDefaultState(),
  getters,
  mutations,
  actions,
  modules: {},
  plugins: [
    persistCredentials,
    persistState,
    ui
  ],
  strict: process.env.NODE_ENV !== 'production'
})

export default store

export const initStore = async () => {
  await Promise.all([initCredentials(store), initState(store)])
}
