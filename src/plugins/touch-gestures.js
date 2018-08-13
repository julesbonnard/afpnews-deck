import Vue from 'vue'
import { VueHammer } from 'vue2-hammer'
import Hammer from 'hammerjs'

delete Hammer.defaults.cssProps.userSelect // allow user to select text on desktop
Vue.use(VueHammer)
