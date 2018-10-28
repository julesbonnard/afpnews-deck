import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import router from '@/router'

Vue.use(VueAnalytics, {
  id: 'UA-127064867-1',
  disabled: false,
  router,
  autoTracking: {
    pageviewOnLoad: true,
    exception: true
  },
  debug: {
    // enabled: process.env.NODE_ENV === 'development',
    enabled: false,
    sendHitTask: process.env.NODE_ENV === 'production'
  },
  anonymizeIp: true,
  forceSSL: true
})
