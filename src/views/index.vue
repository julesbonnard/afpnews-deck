<template>
  <div id="app">
    <router-view />
    <connectivity />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Connectivity from '@/components/Connectivity.vue'

export default Vue.extend({
  name: 'App',
  components: {
    Connectivity
  }
})
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
