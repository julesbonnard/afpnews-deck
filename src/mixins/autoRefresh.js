import { mapState, mapActions } from 'vuex'

export default {
  name: 'AutoRefresh',
  data () {
    return {
      autoRefreshTimer: null,
      autoRefreshDelay: 10000
    }
  },
  computed: {
    ...mapState([
      'autoRefresh'
    ])
  },
  mounted () {
    document.addEventListener('visibilitychange', this.visibilityChanged, false)
    this.startAutoRefresh()
  },
  beforeDestroy () {
    this.stopAutoRefresh()
    document.removeEventListener('visibilitychange', this.visibilityChanged, false)
  },
  methods: {
    ...mapActions([
      'refreshAllColumns'
    ]),
    startAutoRefresh () {
      this.refreshAllColumns()
      this.autoRefreshTimer = setInterval(() => {
        if (document.hidden) return
        this.refreshAllColumns()
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
    }
  }
}
