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
  async mounted () {
    await this.initCredentials()
    await this.initToken()
    if (!this.isAuthenticated) {
      this.$router.push({ name: 'login' })
    }
    await this.resurrectDocuments()
    this.resurrectColumns()
    this.changeLocale(this.$i18n.locale)
    this.initPreferences()
  },
  methods: {
    ...mapActions([
      'initCredentials',
      'initToken',
      'resurrectColumns',
      'resurrectDocuments',
      'changeLocale',
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
