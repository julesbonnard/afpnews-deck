<template>
  <div id="afpdeck">
    <side-bar
      :is-authenticated="isAuthenticated"
      :allow-login="allowLogin"
      @toggleLoginModal="loginModalOpened = !loginModalOpened"
      @toggleCreditsModal="creditsModalOpened = !creditsModalOpened"/>
    <div id="columns">
      <column
        v-for="(column, i) in columns"
        :key="`column-${i}`"
        :column-id="i" />
    </div>
    <photo-modal v-if="currentDocument && ['photo'].includes(currentDocument.product)" />
    <video-modal v-else-if="currentDocument && ['videographie', 'sidtv', 'parismode'].includes(currentDocument.product)" />
    <graphics-modal v-else-if="currentDocument && ['infographie'].includes(currentDocument.product)" />
    <document-modal v-else-if="currentDocument" />
    <login-modal
      v-if="loginModalOpened"
      @close="loginModalOpened = false" />
    <credits-modal
      v-if="creditsModalOpened"
      @close="creditsModalOpened = false" />
  </div>
</template>

<script>
import SideBar from '@/components/SideBar'
import Column from '@/components/Column'
import Modal from '@/components/Modal'
import LoginModal from '@/components/LoginModal'
import CreditsModal from '@/components/CreditsModal'
import DocumentModal from '@/components/DocumentModal'
import PhotoModal from '@/components/PhotoModal'
import VideoModal from '@/components/VideoModal'
import GraphicsModal from '@/components/GraphicsModal'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AfpDeck',
  components: {
    SideBar,
    Column,
    Modal,
    LoginModal,
    CreditsModal,
    DocumentModal,
    PhotoModal,
    GraphicsModal,
    VideoModal
  },
  props: {
    allowLogin: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loginModalOpened: false,
      creditsModalOpened: false
    }
  },
  computed: {
    ...mapState([
      'columns'
    ]),
    ...mapGetters([
      'isAuthenticated',
      'currentDocument'
    ])
  },
  async created () {
    await this.initCredentials()
    await this.initToken()
    this.resurrectColumns()
    // this.resurrectDocuments().then(this.resurrectColumns)
  },
  methods: {
    ...mapActions([
      'initCredentials',
      'initToken',
      'resurrectColumns',
      'resurrectDocuments'
    ])
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
    overflow-x: auto;
    height: 100%;
  }
}
</style>
