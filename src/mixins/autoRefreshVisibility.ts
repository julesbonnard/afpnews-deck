import { mapActions } from 'vuex'

export default {
  name: 'AutoRefreshVisibility',
  mounted () {
    document.addEventListener('visibilitychange', this.visibilityChanged, false)
  },
  beforeDestroy () {
    document.removeEventListener('visibilitychange', this.visibilityChanged, false)
  },
  methods: {
    ...mapActions([
      'refreshAllColumns'
    ]),
    visibilityChanged () {
      if (document.hidden === true || navigator.onLine === false) return
      this.refreshAllColumns()
    }
  }
}
