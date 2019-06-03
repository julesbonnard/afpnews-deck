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
import DayNight from '@/mixins/dayNight'

export default {
  name: 'App',
  mixins: [
    CheckConnection,
    DayNight
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
