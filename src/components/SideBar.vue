<template>
  <nav id="sidebar">
    <button
      name="search"
      aria-label="search"
      data-v-step="new"
      @click="search">
      <i class="UI-icon UI-search" />
    </button>
    <button
      :class="{ success: autoRefresh, processing }"
      name="auto-refresh"
      aria-label="auto refresh"
      data-v-step="auto-refresh"
      @click="toggleAutoRefresh">
      <i class="UI-icon UI-refreshing" />
    </button>
    <router-link
      :class="{ success: isAuthenticated, error: !isAuthenticated }"
      :to="{ name: 'login' }"
      name="authenticate"
      aria-label="authenticate"
      tag="button"
      data-v-step="authenticate">
      <i class="UI-icon UI-user-male" />
    </router-link>
    <router-link
      :to="{ name: 'about' }"
      name="about"
      aria-label="about"
      tag="button">
      <i class="UI-icon UI-heart" />
    </router-link>
    <select
      v-model="locale"
      name="locale"
      aria-label="change language">
      <option value="fr">fr</option>
      <option value="en">en</option>
    </select>
  </nav>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'SideBar',
  data () {
    return {
      autoRefreshTimer: null,
      autoRefreshDelay: 10000,
      processing: false
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ]),
    ...mapState([
      'autoRefresh'
    ]),
    locale: {
      get () {
        return this.$store.state.locale
      },
      set (value) {
        this.changeLocale(value)
      }
    }
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
  mounted () {
    document.addEventListener('visibilitychange', this.visibilityChanged, false)
  },
  beforeDestroy () {
    this.stopAutoRefresh()
    document.removeEventListener('visibilitychange', this.visibilityChanged, false)
  },
  methods: {
    ...mapActions([
      'addColumn',
      'refreshAllColumns',
      'savePreferences',
      'setAutoRefresh',
      'changeLocale'
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
      this.refreshAllColumns()
      this.autoRefreshTimer = setInterval(async () => {
        if (document.hidden) return
        this.processing = true
        this.refreshAllColumns()
        this.processing = false
      }, this.autoRefreshDelay)
    },
    stopAutoRefresh () {
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer)
    },
    visibilityChanged () {
      if (this.autoRefresh === false) return
      if (document.hidden === true) {
        this.stopAutoRefresh()
      } else {
        this.startAutoRefresh()
      }
    },
    toggleAutoRefresh () {
      this.setAutoRefresh(!this.autoRefresh)
    }
  }
}
</script>

<style lang="scss" scoped>
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

  button, select {
    display: block;
    width: calc(100% - 10px);
    color: $secondary-color;
    border: 1px solid $secondary-color;
    background-color: transparent;
    padding: 10px 12px;
    margin: 5px;
  }
  select {
    padding: 10px 0px;
    text-align-last: center;
  }
}
</style>
