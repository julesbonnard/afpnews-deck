<template>
  <div
    id="app"
    :class="{
      'night-mode': !useLightTheme
    }"
  >
    <router-view />
  </div>
</template>

<script>
import CheckConnection from '@/mixins/checkConnection'
import NightMode from '@/mixins/nightMode'

export default {
  name: 'App',
  mixins: [
    CheckConnection,
    NightMode
  ]
}
</script>

<style lang="scss" src="@/assets/scss/main.scss"></style>

<style lang="scss" scoped>
  @import "@/assets/scss/variables.scss";
  #app {
    width: 100vw;
    height: 100%;
    overflow: hidden;
  }
</style>
