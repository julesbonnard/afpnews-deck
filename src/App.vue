<!-- Main App file, needed only for dev -->
<template>
  <div id="app">
    <afp-deck
      ref="afpDeck"
      :api="api"
      :initialColumns="columns"
      @saveColumns="saveColumns"
      @saveToken="saveToken"
    ></afp-deck>
  </div>
</template>

<script>
import AfpNews from 'afpnews-api'
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
    this.init()
  },
  methods: {
    async init () {
      // const clientId = localStorage.getItem('afpnews-clientid') || prompt('Please enter your client Id', null)
      // localStorage.setItem('afpnews-clientid', clientId)
      // const clientSecret = localStorage.getItem('afpnews-clientsecret') || prompt('Please enter your client Secret', null)
      // localStorage.setItem('afpnews-clientsecret', clientSecret)

      // this.api = new AfpNews({ baseUrl: 'https://api.afp.com', clientId, clientSecret })

      // const token = localStorage.getItem('afpnews-token')

      // if (token) {
      //   this.api.token = JSON.parse(token)
      // } else {
      //   const username = prompt('Please enter your username', null)
      //   const password = prompt('Please enter your password', null)
      //   await this.api.authenticate({
      //     username,
      //     password
      //   })
      // }
      // localStorage.setItem('afpnews-token', JSON.stringify(this.api.token))

      this.initColumns()
    },
    saveColumns (savedColumns) {
      localStorage.setItem('afpnews-columns', JSON.stringify(savedColumns))
    },
    saveToken (savedToken) {
      // localStorage.setItem('afpnews-token', JSON.stringify(savedToken))
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
