import { mapActions } from 'vuex'

export default {
  name: 'AutoRefreshVisibility',
  mounted () {
    this.visibilityChanged()
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
      if (document.hidden === true) return
      this.$root.$now = new Date()
      if (navigator.onLine === false) return
      this.refreshAllColumns()
    }
  }
}
