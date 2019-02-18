import Vue, { PluginFunction } from 'vue'
import VueAnalytics from 'vue-analytics'
import router from '@/router'

declare module 'vue-analytics' {
  function event(category: string, action: string, label: string, value?: number): void
  class VueAnalytics {
    static install: PluginFunction<never>
  }
}

Vue.use(VueAnalytics, {
  id: 'UA-127064867-1',
  disabled: false,
  router,
  autoTracking: {
    pageviewOnLoad: true,
    exception: true
  },
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    sendHitTask: process.env.NODE_ENV === 'production'
  },
  anonymizeIp: true,
  forceSSL: true
})
