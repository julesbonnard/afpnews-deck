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
    <document-modal v-if="currentDocument && (currentDocument.product === 'news' || currentDocument.product === 'multimedia')" />
    <media-modal v-if="currentDocument && currentDocument.product === 'photo'" />
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
import MediaModal from '@/components/MediaModal'
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
    MediaModal
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
    overflow-x: scroll;
    height: 100%;
  }
}
</style>
