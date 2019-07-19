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
        if (document.hidden === true) return
        this.$root.$now = new Date()
        if (navigator.onLine === false) return
        await this.refreshAllColumns()
      }, this.autoRefreshDelay)
    },
    stopAutoRefresh () {
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer)
    }
  }
}
