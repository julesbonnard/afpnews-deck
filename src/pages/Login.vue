<template>
  <main>
    <router-link :to="{ name: 'deck' }">
      Back to home
    </router-link>
    <div v-if="isAuthenticated">
      <article>
        <h3>You're correctly logged in.</h3>
        <p>Enjoy AFP Deck !</p>
        <button
          @click="deleteToken">
          Logout
        </button>
      </article>
    </div>
    <div v-else>
      <article>
        <h3>You're not authenticated.</h3>
        <p>Please type in your credentials to have access to the complete feed.</p>
        <form @submit.stop.prevent="login">
          <div class="form-group">
            <label for="client-id">Client ID</label>
            <input
              id="client-id"
              v-model.lazy="clientId"
              type="text"
              name="client-id"
              autocomplete="off">
          </div>
          <div class="form-group">
            <label for="client-id">Client Secret</label>
            <input
              id="client-secret"
              v-model.lazy="clientSecret"
              type="text"
              name="client-secret"
              autocomplete="off">
          </div>
          <div class="form-group">
            <label for="client-id">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              name="username"
              autocomplete="username">
          </div>
          <div class="form-group">
            <label for="client-id">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              autocomplete="password">
          </div>
          <div class="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </article>
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
        this.$router.push({ name: 'deck' })
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss" scoped>
  main {
    padding: 30px;
    article {
      max-width: 600px;
      form {
        .form-group {
          margin-bottom: 12px;
          label {
            display: inline-block;
            min-width: 120px;
          }
        }
      }
    }
  }
</style>
