<template>
  <nav id="sidebar">
    <button @click="search">
      <i class="UI-icon UI-search" />
    </button>
    <button
      :class="{ success: autoRefresh, processing }"
      @click="autoRefresh = !autoRefresh">
      <i class="UI-icon UI-refreshing" />
    </button>
    <router-link
      :class="{ success: isAuthenticated, error: !isAuthenticated }"
      :to="{ name: 'login' }"
      tag="button">
      <i class="UI-icon UI-user-male" />
    </router-link>
    <router-link
      :to="{ name: 'about' }"
      tag="button">
      <i class="UI-icon UI-heart" />
    </router-link>
  </nav>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'SideBar',
  data () {
    return {
      autoRefreshTimer: null,
      autoRefresh: false,
      autoRefreshDelay: 10000,
      processing: false
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  watch: {
    autoRefresh (autoRefresh) {
      if (autoRefresh === true) {
        this.startAutoRefresh()
      } else {
        this.stopAutoRefresh()
      }
    }
  },
  beforeDestroy () {
    this.stopAutoRefresh()
  },
  methods: {
    ...mapMutations([
      'addColumn'
    ]),
    ...mapActions([
      'refreshAllColumns'
    ]),
    async search () {
      if (this.$route.name !== 'deck') {
        this.$router.push({ name: 'deck' })
      }
      this.addColumn()
      await this.$nextTick()
      document.querySelector('.column:last-child').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    },
    startAutoRefresh () {
      document.addEventListener('visibilitychange', this.visibilityChanged, false)
      this.refreshAllColumns().catch()
      this.autoRefreshTimer = setInterval(async () => {
        if (document.hidden) return
        this.processing = true
        this.refreshAllColumns().catch()
        this.processing = false
      }, this.autoRefreshDelay)
    },
    stopAutoRefresh () {
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer)
      document.removeEventListener('visibilitychange', this.visibilityChanged, false)
    },
    visibilityChanged () {
      if (document.hidden === false) {
        this.refreshAllColumns()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@afp/toolkit-styles/scss/variables.scss";
@import "@/assets/scss/variables.scss";

#sidebar {
  width: $sidebar-size;
  z-index: 5;
  @include breakpoint(mobile) {
    display: flex;
    flex-direction: row-reverse;
    width: auto;
    height: $sidebar-size;
  }
  background-color: $primary-color;

  button {
    display: block;
    width: calc(100% - 10px);
    color: $secondary-color;
    border: 1px solid $secondary-color;
    background-color: transparent;
    padding: 10px 12px;
    margin: 5px;
  }
}
</style>
