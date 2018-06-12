<!-- Main App file, needed only for dev -->
<template>
  <div id="app">
    <side-bar />
    <router-view />
  </div>
</template>

<script>
import SideBar from '@/components/SideBar'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    SideBar
  },
  async created () {
    await this.initCredentials()
    await this.initToken()
    await this.resurrectDocuments()
    await this.resurrectColumns()
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

  #app {
    height: 100vh;
    max-height: 100vh;
    display: flex;
    @media screen and (max-width: 640px) {
      flex-direction: column-reverse;
    }
    overflow-x: hidden;
    overscroll-behavior: contain;

    > main {
      flex: 1;
      align-items: stretch;
    }
  }
</style>
