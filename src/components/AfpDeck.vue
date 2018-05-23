<template>
  <div id="afpdeck">
    <side-bar
      :allow-login="allowLogin"
      @toggleLoginModal="loginModalOpened = !loginModalOpened"
      @toggleCreditsModal="creditsModalOpened = !creditsModalOpened"/>
    <div id="columns">
      <column
        v-for="(column, i) in columns"
        :key="`column-${i}`"
        :column-id="i" />
    </div>
    <photo-modal v-if="currentDocument && ['photo', 'infographie'].includes(currentDocument.product)" />
    <video-modal v-else-if="currentDocument && ['videographie', 'sidtv', 'parismode'].includes(currentDocument.product)" />
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
      'currentDocument',
      'isAuthenticated'
    ])
  },
  async created () {
    await this.initCredentials()
    await this.initToken()
    await this.resurrectDocuments()
    await this.resurrectColumns()
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
  @media screen and (max-width: 640px) {
    flex-direction: column-reverse;
  }

  #columns {
    background-color: #E1E8ED;
    background-image: url('~@/assets/img/afp-logo.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 25% auto;
    flex: 1;
    display: flex;
    overflow-x: auto;
    height: 100%;
  }
}
</style>
