import { VueAnalytics } from 'vue-analytics'

declare module 'vue/types/vue' {
  interface VueConstructor {
    $ga: VueAnalytics & {
      enable(): void;
    };
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
