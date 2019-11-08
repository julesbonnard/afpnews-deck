import Vue from 'vue'

declare module 'vue/types/vue' {
  interface VueConstructor {
    $ga: {
      enable(): void
      disable(): void
    }
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
    genre?: string[],
    event?: string[]
  }
}