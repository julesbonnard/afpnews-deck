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

  * {
    box-sizing: border-box;
  }

  @media screen {
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
  }

  @page {
    margin-top: 2cm;
    margin-bottom: 2cm;
    margin-left: 4cm;
    margin-right: 4cm;
  }
</style>
