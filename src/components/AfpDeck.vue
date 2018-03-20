<template>
  <div id="afpdeck">
    <side-bar
      :is-logged="isLogged"
      :allow-login="allowLogin"
      :auto-refresh.sync="autoRefresh"
      @addColumn="addColumn"
      @openLoginModal="loginModalOpened = true"
      @openCreditsModal="creditsModalOpened = true"/>
    <div id="columns">
      <column
        v-for="(column, i) in columns"
        :key="`column-${i}`"
        :documents="column.documents"
        :documents-count="column.documentsCount"
        :processing="column.processing"
        :error="column.error"
        :params.sync="column.params"
        :params-open.sync="column.paramsOpen"
        @close="val => { closeColumn(i) }"
        @move="val => { moveColumn(i, val) }"
        @refresh="val => { refreshColumn(i) }"
        @reset="val => { resetColumn(i) }"
        @loadMore="val => { loadMoreDocuments(i) }"
        @update:params="saveColumns"/>
    </div>
    <modal
      v-if="currentDocument"
      id="current-document-modal"
      :lang="currentDocument.lang"
      @close="currentDocument = null">
      <h3
        slot="header"
        :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
        {{ currentDocument.title }}
      </h3>
      <article
        slot="body"
        :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
        <video
          v-if="currentDocument.video"
          width="100%"
          height="auto"
          controls
          autoplay
          muted>
          <source
            :src="currentDocument.video.href"
            type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <img
          v-else-if="currentDocument.imageHd"
          :src="currentDocument.imageHd.href">
        <p
          v-linkified
          v-for="(p, i) in currentDocument.body"
          :key="i"
          v-html="p"/>
      </article>
      <p slot="footer">{{ currentDocument.footer }}</p>
    </modal>
    <modal
      v-if="loginModalOpened"
      id="login-modal"
      @close="loginModalOpened = false">
      <h3 slot="header">Please authenticate</h3>
      <form
        slot="body"
        @submit.stop.prevent="authenticate">
        <input
          id="client-id"
          v-model="credentials.clientId"
          type="text"
          name="client-id"
          placeholder="Client ID">
        <input
          id="client-secret"
          v-model="credentials.clientSecret"
          type="password"
          name="client-secret"
          placeholder="Client Secret">
        <input
          id="username"
          v-model="credentials.username"
          type="text"
          name="username"
          placeholder="Username">
        <input
          id="password"
          v-model="credentials.password"
          type="password"
          name="password"
          placeholder="Password">
        <button type="submit">Submit</button>
      </form>
      <p slot="footer" />
    </modal>
    <modal
      v-if="creditsModalOpened"
      id="credits-modal"
      @close="creditsModalOpened = false">
      <h3 slot="header">About this app</h3>
      <article slot="body">
        <p>AFP News Deck is a reader for AFP feeds. It allows you to fetch and read stories, multimedia articles and photos directly in your browser.</p>
        <p>Built with love by AFP Dataviz team, on a original idea by the Medialab.</p>
      </article>
      <p slot="footer" />
    </modal>
  </div>
</template>

<script>
import AfpNews from 'afpnews-api'
import Vue from 'vue'
import bus from '@/utils/bus'
import SideBar from '@/components/SideBar'
import Column from '@/components/Column'
import Modal from '@/components/Modal'
import VueLinkify from 'vue-linkify'

Vue.directive('linkified', VueLinkify)

export default {
  name: 'AfpDeck',
  components: { SideBar, Column, Modal },
  props: {
    api: {
      type: Object,
      default: () => {
        return new AfpNews({ baseUrl: 'https://api.afpforum.com' })
      }
    },
    storageKeys: {
      type: Object,
      default: () => ({
        columns: 'afpnews-deck-columns',
        token: 'afpnews-deck-token',
        clientId: 'afpnews-deck-client-id',
        clientSecret: 'afpnews-deck-client-secret'
      })
    },
    storage: {
      type: Object,
      default: () => ({
        get (key) {
          const value = localStorage.getItem(key)
          try {
            return JSON.parse(value)
          } catch (e) {
            return value
          }
        },
        set (key, value) {
          return localStorage.setItem(key, JSON.stringify(value))
        },
        remove (key) {
          return localStorage.removeItem(key)
        }
      })
    },
    allowLogin: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentDocument: null,
      columns: [],
      autoRefreshTimer: null,
      autoRefresh: false,
      autoRefreshDelay: 5000,
      loginModalOpened: false,
      creditsModalOpened: false,
      credentials: {
        clientId: null,
        clientSecret: null,
        username: null,
        password: null
      },
      isLogged: false
    }
  },
  watch: {
    autoRefresh (newVal) {
      if (newVal) this.startAutoRefresh()
      else this.stopAutoRefresh()
    }
  },
  created () {
    this.authenticate()
    this.initColumns()
    bus.$on('setCurrentDocument', data => {
      this.currentDocument = data
    })
  },
  beforeDestroy () {
    this.stopAutoRefresh()
  },
  methods: {
    async authenticate () {
      try {
        this.credentials.clientId = this.storage.get(this.storageKeys.clientId)
        this.credentials.clientSecret = this.storage.get(this.storageKeys.clientSecret)

        const { clientId, clientSecret, username, password } = this.credentials
        this.api.apiKey = { clientId, clientSecret }

        const token = this.storage.get(this.storageKeys.token)
        if (token) {
          this.api.token = token
        }

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
      this.storage.set(this.storageKeys.columns, savedColumns)
    },
    saveToken () {
      this.storage.set(this.storageKeys.token, this.api.token)
    },
    resetToken () {
      this.storage.remove(this.storageKeys.token)
      this.api.token = {}
      this.isLogged = false
      this.authenticate()
    },
    initColumns () {
      const savedColumns = this.storage.get(this.storageKeys.columns)
      if (Array.isArray(savedColumns) && savedColumns.length > 0) {
        savedColumns.forEach(({ name, params }) => {
          this.addColumn(name, params, false)
        })
      } else {
        this.addColumn(undefined, undefined, false)
      }
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

<style lang="scss">
  #login-modal, #credits-modal {
    &.modal-mask {
      align-items: flex-start;
      .modal-container {
        height: auto;
      }
    }
  }
</style>
