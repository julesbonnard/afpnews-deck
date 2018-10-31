import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import router from '@/router'

Vue.use(VueAnalytics, {
  id: 'UA-127064867-1',
  disabled: false,
  router,
  autoTracking: {
    pageviewOnLoad: true,
    exception: true,
    pageviewTemplate (route) {
      return {
        page: route.path,
        title: document.title,
        location: window.location.href,
        dimension2: navigator.onLine.toString()
      }
    }
  },
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    sendHitTask: process.env.NODE_ENV === 'production'
  },
  anonymizeIp: true,
  forceSSL: true
})
