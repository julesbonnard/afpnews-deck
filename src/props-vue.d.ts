import _Vue, { PluginFunction } from 'vue'

declare class VueAnalytics {
  static install(Vue: typeof _Vue, options: any): void;
  analyticsMiddleware: any;
  onAnalyticsReady: any;
  event: any;
  ecommerce: any;
  set: any;
  page: any;
  query: any;
  screenview: any;
  time: any;
  require: any;
  exception: any;
  social: any;
  disable: any;
  enable: any;
}

declare module 'vue/types/vue' {
  interface Vue {
    $ga: VueAnalytics;
  }
  interface VueConstructor {
    $ga: VueAnalytics;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends _Vue> {
    ga?: VueAnalytics;
  }
}

// // `ComponentOptions` est déclarée dans types/options.d.ts
// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//     myOption?: string
//   }
// }

declare module 'afpnews-api/dist/types' {
  interface AfpDocument {
  }
}
