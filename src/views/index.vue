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

<style lang="scss" src="@/assets/scss/main.scss"></style>

<style lang="scss" scoped>
  @import "@/assets/scss/variables.scss";
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
