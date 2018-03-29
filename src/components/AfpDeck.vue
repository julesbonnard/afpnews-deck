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
    <document-modal id="document-modal" />
    <login-modal
      v-if="loginModalOpened"
      id="login-modal"
      @close="loginModalOpened = false" />
    <credits-modal
      v-if="creditsModalOpened"
      id="credits-modal"
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
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AfpDeck',
  components: { SideBar, Column, Modal, LoginModal, CreditsModal, DocumentModal },
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
      'isAuthenticated'
    ])
  },
  async created () {
    this.authenticate()
    this.resurrectDocuments().then(this.resurrectColumns)
  },
  methods: {
    ...mapActions([
      'authenticate',
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
