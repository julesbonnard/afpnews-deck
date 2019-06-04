export default {
  name: 'AutoRefreshTimer',
  data () {
    return {
      autoRefreshTimer: null,
      autoRefreshDelay: 10000
    }
  },
  mounted () {
    this.startAutoRefresh()
  },
  beforeDestroy () {
    this.stopAutoRefresh()
  },
  methods: {
    startAutoRefresh () {
      this.autoRefreshTimer = window.setInterval(async () => {
        if (document.hidden === true || navigator.onLine === false) return
        try {
          await this.refreshColumn({ indexCol: this.columnId, mode: 'after' })
        } catch (error) {
          this.$toasted.global.apiError(error)
        }
      }, this.autoRefreshDelay)
    },
    stopAutoRefresh () {
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer)
    }
  }
}
