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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    SideBar,
    Connectivity
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  async created () {
    await this.initCredentials()
    await this.initToken()
    await this.resurrectDocuments()
    await this.resurrectColumns()
    await this.initPreferences()
    if (!this.isAuthenticated && this.$route.name === 'deck') {
      this.$router.push({ name: 'login' })
    }
  },
  methods: {
    ...mapActions([
      'initCredentials',
      'initToken',
      'resurrectColumns',
      'resurrectDocuments',
      'initPreferences'
    ])
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
