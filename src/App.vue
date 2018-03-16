<!-- Main App file, needed only for dev -->
<template>
  <div id="app">
    <afp-deck
      ref="afpDeck"
      :api="api"
      :initialColumns="columns"
      @saveColumns="saveColumns"
    ></afp-deck>
  </div>
</template>

<script>
import AfpDeck from './components/AfpDeck'

export default {
  name: 'app',
  components: {
    AfpDeck
  },
  data () {
    return {
      api: undefined,
      columns: []
    }
  },
  mounted () {
    this.initColumns()
  },
  methods: {
    saveColumns (savedColumns) {
      localStorage.setItem('afpnews-columns', JSON.stringify(savedColumns))
    },
    initColumns () {
      if (localStorage.getItem('afpnews-columns')) {
        const savedColumns = JSON.parse(localStorage.getItem('afpnews-columns'))
        savedColumns.forEach(({ name, params }) => {
          this.$refs.afpDeck.addColumn(name, params, false)
        })
      } else {
        this.$refs.afpDeck.addColumn(undefined, undefined, false)
      }
    }
  }
}
</script>

<style lang="scss">
$assets_path: '~@afp/toolkit-styles/assets/';
@import "~@afp/toolkit-styles/scss/main.scss";
</style>
