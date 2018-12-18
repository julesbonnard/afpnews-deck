<template>
  <div id="app">
    <router-view />
    <connectivity />
  </div>
</template>

<script>
import Connectivity from '@/components/Connectivity'
export default {
  name: 'App',
  components: {
    Connectivity
  }
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
