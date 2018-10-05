<template>
  <div id="app">
    <side-bar />
    <router-view />
    <connectivity />
  </div>
</template>

<script>
import SideBar from '@/components/SideBar'
import Connectivity from '@/components/Connectivity'

export default {
  name: 'App',
  components: {
    SideBar,
    Connectivity
  }
}
</script>

<style lang="scss">
  @import url('~@afp/toolkit-styles');
  @import "@/assets/scss/variables.scss";

  html, body {
    height: 100%;
  }

  #app {
    display: flex;
    align-items: stretch;
    width: 100vw;
    height: 100%;
    @include breakpoint(mobile) {
      flex-direction: column-reverse;
    }
    overflow: hidden;
  }
</style>
