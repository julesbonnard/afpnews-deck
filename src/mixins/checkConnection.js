import { mapState, mapMutations } from 'vuex'

const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

export default {
  name: 'CheckConnection',
  computed: {
    ...mapState([
      'isOnline'
    ])
  },
  watch: {
    isOnline (newVal, oldVal) {
      if (newVal === false) {
        this.$toasted.clear()
        this.$toasted.show(this.$t('connectivity.messageOff'), {
          duration: 2000,
          type: 'info',
          position: 'bottom-center'
        })
      } else if (oldVal === false) {
        this.$toasted.clear()
        this.$toasted.show(this.$t('connectivity.messageOn'), {
          duration: 2000,
          type: 'info',
          position: 'bottom-center'
        })
      }
    }
  },
  mounted () {
    if (!connection) return false
    this.checkConnection()
    connection.addEventListener('change', this.checkConnection)
  },
  methods: {
    ...mapMutations([
      'setConnectivityStatus'
    ]),
    checkConnection () {
      const isOnline = navigator.onLine === true
      this.setConnectivityStatus(isOnline)
    }
  }
}
