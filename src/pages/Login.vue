<template>
  <main>
    <h3>Please authenticate</h3>
    <div>
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
          autocomplete="off">
        <input
          id="client-secret"
          v-model.lazy="clientSecret"
          type="text"
          name="client-secret"
          placeholder="Client Secret"
          autocomplete="off">
        <input
          id="username"
          v-model="username"
          type="text"
          name="username"
          placeholder="Username">
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          placeholder="Password">
        <button type="submit">Submit</button>
      </form>
      <button
        v-else
        @click="deleteToken">
        Logout
      </button>
      <router-link :to="{ name: 'deck' }">
        Back to home
      </router-link>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
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
      } catch (e) {
        console.error('Credentials are wrong. Please retry.')
      }
    }
  }
}
</script>
