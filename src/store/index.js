import Vue from 'vue'
import Vuex from 'vuex'
import getDefaultState from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: getDefaultState(),
  getters,
  mutations,
  actions,
  modules: {},
  strict: process.env.NODE_ENV !== 'production'
})
