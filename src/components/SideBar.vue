<template>
  <header id="sidebar">
    <button @click="addColumn">
      <i class="UI-icon UI-search" />
    </button>
    <button
      :class="{ success: autoRefresh, processing }"
      @click="autoRefresh = !autoRefresh">
      <i class="UI-icon UI-refreshing" />
    </button>
    <button
      v-if="allowLogin"
      :class="{ success: isAuthenticated }"
      @click="$emit('toggleLoginModal')">
      <i class="UI-icon UI-user-male" />
    </button>
    <button
      @click="$emit('toggleCreditsModal')">
      <i class="UI-icon UI-heart" />
    </button>
  </header>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'SideBar',
  props: {
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    allowLogin: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      autoRefreshTimer: null,
      autoRefresh: false,
      autoRefreshDelay: 10000,
      processing: false
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
    startAutoRefresh () {
      this.autoRefreshTimer = setInterval(async () => {
        this.processing = true
        try {
          await this.refreshAllColumns()
        } catch (e) {
          // console.log(e.message)
        }
        this.processing = false
      }, this.autoRefreshDelay)
    },
    stopAutoRefresh () {
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@afp/toolkit-styles/scss/variables.scss";

#sidebar {
  min-width: 50px;
  height: 100%;
  background-color: #243447;

  button {
    display: block;
    width: calc(100% - 10px);
    color: #1DA1F2;
    border: 1px solid #1DA1F2;
    background-color: transparent;
    padding: 10px 12px;
    margin: 5px;
  }
}
</style>
