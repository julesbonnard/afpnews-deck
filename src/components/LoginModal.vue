<template>
  <modal
    layout="login"
    transition="slide"
    @close="$emit('close')">
    <h3 slot="header">Please authenticate</h3>
    <div slot="body">
      <p v-if="isAuthenticated">You're correctly logged in. Enjoy AFP Deck !</p>
      <p v-else>You're not authenticated. Please type in your credentials to have access to the complete feed.</p>
      <form
        v-if="!isAuthenticated"
        @submit.stop.prevent="login">
        <input
          id="client-id"
          v-model.lazy="clientId"
          type="text"
          name="client-id"
          placeholder="Client ID"
          autocomplete="client-id">
        <input
          id="client-secret"
          v-model.lazy="clientSecret"
          type="text"
          name="client-secret"
          placeholder="Client Secret"
          autocomplete="client-secret">
        <input
          id="username"
          v-model="username"
          type="text"
          name="username"
          placeholder="Username"
          autocomplete="username">
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="password">
        <button type="submit">Submit</button>
      </form>
      <button
        v-else
        @click="deleteToken">
        Logout
      </button>
    </div>
    <p slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginModal',
  components: { Modal },
  data () {
    return {
      username: undefined,
      password: undefined
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ]),
    clientId: {
      get () {
        return this.$store.state.credentials.clientId
      },
      set (value) {
        this.$store.commit('updateClientId', value)
      }
    },
    clientSecret: {
      get () {
        return this.$store.state.credentials.clientSecret
      },
      set (value) {
        this.$store.commit('updateClientSecret', value)
      }
    }
  },
  methods: {
    ...mapActions([
      'authenticate',
      'refreshAllColumns',
      'deleteToken'
    ]),
    async login () {
      try {
        await this.authenticate({ username: this.username, password: this.password })
        await this.refreshAllColumns()
        this.$emit('close')
      } catch (e) {
        console.error('Credentials are wrong. Please retry.')
      }
    }
  }
}
</script>
