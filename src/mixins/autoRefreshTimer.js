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
        this.refreshColumn({ indexCol: this.columnId, mode: 'after' })
      }, this.autoRefreshDelay)
    },
    stopAutoRefresh () {
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer)
    }
  }
}
