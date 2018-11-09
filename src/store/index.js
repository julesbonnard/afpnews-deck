import Vue from 'vue'
import Vuex from 'vuex'
import getDefaultState from '@/store/state'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import { persistCredentials } from '@/store/plugins/manageCredentials'
import persistState from '@/store/plugins/persistState'

Vue.use(Vuex)

export default new Vuex.Store({
  state: getDefaultState(),
  getters,
  mutations,
  actions,
  modules: {},
  plugins: [
    persistCredentials,
    persistState
  ],
  strict: process.env.NODE_ENV !== 'production'
})
