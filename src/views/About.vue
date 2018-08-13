<template>
  <main>
    <router-link :to="{ name: 'deck' }">
      {{ $t('back-to-home') }}
    </router-link>
    <article>
      <h3>{{ $t('about.title') }}</h3>
      <p>{{ $t('about.description') }}</p>
      <p>{{ $t('about.copyright') }}</p>
    </article>
    <p>
      {{ $t('about.version') }} {{ version }}
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
