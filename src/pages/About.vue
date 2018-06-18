<template>
  <main>
    <router-link :to="{ name: 'deck' }">
      Back to home
    </router-link>
    <article>
      <h3>About this app</h3>
      <p>AFP News Deck is a reader for AFP feeds. It allows you to fetch and read stories, multimedia articles and photos directly in your browser.</p>
      <p>Made with love by AFP Dataviz team, on a original idea by the Medialab.</p>
    </article>
    <p>
      Version {{ version }}
    </p>
  </main>
</template>

<script>
import { version } from '@/../package.json'

export default {
  name: 'About',
  data () {
    return {
      version
    }
  }
}
</script>

<style lang="scss" scoped>
  main {
    padding: 30px;
    flex: 1;
    article {
      max-width: 600px;
    }
  }
</style>
