<template>
  <div id="afpdeck">
    <side-bar
      @addColumn="addColumn"
      :isLogged="isLogged"
      :allowLogin="allowLogin"
      @openLoginModal="loginModalOpened = true"
      :autoRefresh.sync="autoRefresh"
    ></side-bar>
    <div id="columns">
      <column
        v-for="(column, i) in columns"
        :key="`column-${i}`"
        :documents="column.documents"
        :documentsCount="column.documentsCount"
        :processing="column.processing"
        :error="column.error"
        @close="val => { closeColumn(i) }"
        @move="val => { moveColumn(i, val) }"
        @refresh="val => { refreshColumn(i) }"
        @reset="val => { resetColumn(i) }"
        @loadMore="val => { loadMoreDocuments(i) }"
        :params.sync="column.params"
        @update:params="saveColumns"
        :paramsOpen.sync="column.paramsOpen">
      </column>
    </div>
    <modal v-if="currentDocument" @close="currentDocument = null">
      <h3 slot="header">{{ currentDocument.title }}</h3>
      <article slot="body">
        <video width="100%" height="auto" controls v-if="currentDocument.video" autoplay muted>
          <source :src="currentDocument.video.href" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <img v-else-if="currentDocument.imageHd" :src="currentDocument.imageHd.href" />
        <p v-for="p in currentDocument.body" v-html="p" v-linkified></p>
      </article>
      <p slot="footer">{{ currentDocument.footer }}</p>
    </modal>
    <login-modal v-if="loginModalOpened" @close="loginModalOpened = false">
      <h3 slot="header">Please authenticate</h3>
      <form @submit.stop.prevent="authenticate" slot="body">
        <input v-model="credentials.clientId" type="text" name="client-id" id="client-id" placeholder="Client ID" />
        <input v-model="credentials.clientSecret" type="password" name="client-secret" id="client-secret" placeholder="Client Secret" />
        <input v-model="credentials.username" type="text" name="username" id="username" placeholder="Username" />
        <input v-model="credentials.password" type="password" name="password" id="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
      <p slot="footer"></p>
    </login-modal>
  </div>
</template>

<script>
import AfpNews from 'afpnews-api'
import Vue from 'vue'
import bus from '@/utils/bus'
import SideBar from '@/components/SideBar'
import Column from '@/components/Column'
import Modal from '@/components/Modal'
import LoginModal from '@/components/LoginModal'
import VueLinkify from 'vue-linkify'

Vue.directive('linkified', VueLinkify)

export default {
  name: 'afp-deck',
  props: {
    api: {
      type: Object,
      default: () => {
        return new AfpNews({ baseUrl: 'https://api.afpforum.com' })
      }
    },
    initialColumns: {
      type: Array,
      default: []
    },
    allowLogin: {
      type: Boolean,
      default: true
    }
  },
  components: { SideBar, Column, Modal, LoginModal },
  data () {
    return {
      currentDocument: null,
      columns: this.initialColumns,
      autoRefreshTimer: null,
      autoRefresh: false,
      autoRefreshDelay: 5000,
      loginModalOpened: false,
      credentials: {
        clientId: null,
        clientSecret: null,
        username: null,
        password: null
      },
      isLogged: false
    }
  },
  created () {
    if (localStorage) {
      this.credentials.clientId = localStorage.getItem('afpnews-clientid')
      this.credentials.clientSecret = localStorage.getItem('afpnews-clientsecret')
      const token = localStorage.getItem('afpnews-token')
      if (token) {
        this.api.token = JSON.parse(token)
        this.authenticate()
      }
    }

    bus.$on('setCurrentDocument', data => {
      this.currentDocument = data
    })
  },
  watch: {
    autoRefresh (newVal) {
      if (newVal) this.startAutoRefresh()
      else this.stopAutoRefresh()
    }
  },
  beforeDestroy () {
    this.stopAutoRefresh()
  },
  methods: {
    async authenticate () {
      try {
        const { clientId, clientSecret, username, password } = this.credentials
        this.api.apiKey = { clientId, clientSecret }
        if (username && password) {
          await this.api.authenticate({ username, password })
        } else {
          await this.api.authenticate()
        }
        if (clientId && clientSecret) {
          this.isLogged = true
        }
        this.saveToken()
        this.refreshAllColumns()
        this.loginModalOpened = false
      } catch (e) {
        console.error(e.message)
        if (e.message === 'You need to authenticate with credentials once') {
          this.loginModalOpened = true
        }
      }
    },
    addColumn (name = 'Default', params = {}, paramsOpen = true) {
      params = Object.assign({}, this.api.defaultSearchParams, params)

      this.columns.push({
        params,
        documents: [],
        documentsCount: 0,
        processing: false,
        error: false,
        paramsOpen
      })
      this.saveColumns()
    },
    moveColumn (indexCol, dir) {
      const to = dir === 'left' ? indexCol - 1 : indexCol + 1
      const element = this.columns[indexCol]
      this.columns.splice(indexCol, 1)
      this.columns.splice(to, 0, element)
      this.saveColumns()
    },
    closeColumn (index) {
      const confirmation = confirm('Do you really want to delete the column ?')
      if (!confirmation) return false
      this.columns.splice(index, 1)
      this.saveColumns()
    },
    resetColumn (indexCol) {
      this.columns[indexCol].documents = []
      this.columns[indexCol].count = 0
    },
    async refreshColumn (indexCol, more) {
      let params = JSON.parse(JSON.stringify(this.columns[indexCol].params))

      if (more === 'before') {
        const lastDocument = this.columns[indexCol].documents.slice(-1).pop()
        if (lastDocument) {
          let lastDate = new Date(lastDocument.published)
          lastDate.setSeconds(lastDate.getSeconds() - 1)
          params = Object.assign(params, { dateTo: lastDate.toISOString(), dateFrom: '2012-01-01' })
        }
      } else if (more === 'after' && this.columns[indexCol].documents.length > 0) {
        const firstDocument = this.columns[indexCol].documents[0]
        if (firstDocument) {
          let firstDate = new Date(firstDocument.published)
          firstDate.setSeconds(firstDate.getSeconds() + 1)
          params = Object.assign(params, { dateFrom: firstDate.toISOString(), dateTo: 'now' })
        }
      } else {
        params = Object.assign(params, { dateFrom: '2012-01-01' })
      }

      this.columns[indexCol].processing = true

      try {
        const { documents, count } = await this.api.search(params)

        this.saveToken()

        const existingDocuments = this.columns[indexCol].documents

        if (more === 'before') {
          this.columns[indexCol].documents = existingDocuments.concat(documents)
        } else if (more === 'after' && this.columns[indexCol].documents.length > 0) {
          this.columns[indexCol].documents = documents.concat(existingDocuments)
        } else {
          this.columns[indexCol].documents = documents
          this.columns[indexCol].documentsCount = count
        }

        this.columns[indexCol].error = false
      } catch (e) {
        if (e.response && e.response.status === 401) {
          this.resetToken()
        } else {
          console.error(e.message)
          if (e.message === 'You need to authenticate with credentials once') {
            this.loginModalOpened = true
          }
        }
        this.columns[indexCol].error = true
        this.columns[indexCol].documents = []
      }

      this.columns[indexCol].processing = false
    },
    async loadMoreDocuments (indexCol) {
      await this.refreshColumn(indexCol, 'before')
    },
    refreshAllColumns (more) {
      return Promise.all(
        this.columns
          .filter(column => !column.paramsOpen)
          .map((column, i) => this.refreshColumn(i, more)))
    },
    startAutoRefresh () {
      this.autoRefreshTimer = setInterval(() => { this.refreshAllColumns('after') }, this.autoRefreshDelay)
    },
    stopAutoRefresh () {
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer)
    },
    saveColumns () {
      const savedColumns = this.columns.map(column => {
        return {
          params: column.params,
          name: column.name
        }
      })
      this.$emit('saveColumns', savedColumns)
    },
    saveToken () {
      if (localStorage) {
        localStorage.setItem('afpnews-token', JSON.stringify(this.api.token))
      }
    },
    resetToken () {
      if (localStorage) {
        localStorage.removeItem('afpnews-token')
      }
      this.api.token = {}
      this.isLogged = false
      this.authenticate()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@afp/toolkit-styles/scss/variables.scss";
#afpdeck {
  height: 100vh;
  max-height: 100vh;
  display: flex;

  #columns {
    background-color: #E1E8ED;
    flex: 1;
    display: flex;
    overflow-x: scroll;
    height: 100%;
  }

  article {
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
