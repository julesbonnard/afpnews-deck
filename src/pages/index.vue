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
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    SideBar,
    Connectivity
  },
  async created () {
    await this.initCredentials()
    await this.initToken()
    await this.resurrectDocuments()
    this.resurrectColumns()
  },
  methods: {
    ...mapActions([
      'initCredentials',
      'initToken',
      'resurrectColumns',
      'resurrectDocuments'
    ])
  }
}
</script>

<style lang="scss">
  $assets_path: '~@afp/toolkit-styles/assets/';
  @import "~@afp/toolkit-styles/scss/main.scss";
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
