<template>
  <transition
    name="curtain"
    appear
  >
    <div
      v-if="!connectivity.isConnected"
      id="connectivity"
    >
      {{ $t('connectivity.message') }}
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

export default {
  name: 'Connectivity',
  computed: {
    ...mapState([
      'connectivity'
    ])
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
      const isConnected = navigator.onLine === true
      this.setConnectivityStatus({ isConnected })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
#connectivity {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background-color: $secondary-color;
  color: white;
  padding: 4px 4px;
  font-size: smaller;
}
.curtain-enter-active, .curtain-leave-active {
  transition: transform 350ms ease-in-out;
}
.curtain-enter, .curtain-leave-to {
  transform: translateY(100%);
}
.curtain-enter-to {
  transform: translateY(0%);
}
</style>
