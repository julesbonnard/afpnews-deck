<!-- Main App file, needed only for dev -->
<template>
  <div id="app">
    <afp-deck />
  </div>
</template>

<script>
import AfpDeck from '@/components/AfpDeck'

export default {
  name: 'App',
  components: {
    AfpDeck
  }
}
</script>

<style lang="scss">
$assets_path: '~@afp/toolkit-styles/assets/';
@import "~@afp/toolkit-styles/scss/main.scss";

html, body {
  overscroll-behavior: contain;
}
</style>
