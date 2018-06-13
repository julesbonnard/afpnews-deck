<template>
  <main>
    <h3>About this app</h3>
    <article>
      <p>AFP News Deck is a reader for AFP feeds. It allows you to fetch and read stories, multimedia articles and photos directly in your browser.</p>
      <p>Made with love by AFP Dataviz team, on a original idea by the Medialab.</p>
    </article>
    <p>
      Version {{ version }}
    </p>
    <router-link :to="{ name: 'deck' }">
      Back to home
    </router-link>
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
  h3 {
    font-size: 33px;
    line-height: 35px;
  }
  article {
    padding-left: 30px;
    padding-right: 30px;
  }
</style>
