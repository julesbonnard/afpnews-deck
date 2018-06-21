<template>
  <main>
    <router-link :to="{ name: 'deck' }">
      Back to home
    </router-link>
    <article v-if="isAuthenticated">
      <h3>You're correctly logged in.</h3>
      <p>Enjoy AFP Deck !</p>
      <button
        @click="deleteToken">
        Logout
      </button>
    </article>
    <article v-else>
      <h3>You're not authenticated.</h3>
      <p>Please type in your credentials to have access to the complete feed.</p>
      <form
        :class="{ danger: authError }"
        @submit.stop.prevent="login">
        <div class="form-group">
          <label for="client">Client</label>
          <select
            id="client"
            v-model="client"
            name="client"
            autocomplete="client">
            <option
              v-for="label in clients"
              :key="label"
              :value="label">
              {{ label }}
            </option>
          </select>
        </div>
        <div v-if="client === 'other'">
          <div class="form-group">
            <label for="client-id">Client Id</label>
            <input
              id="client-id"
              v-model="clientId"
              type="text"
              name="client-id"
              autocomplete="client-id">
          </div>
          <div class="form-group">
            <label for="client-secret">Client Secret</label>
            <input
              id="client-secret"
              v-model="clientSecret"
              type="text"
              name="client-secret"
              autocomplete="client-secret">
          </div>
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
  </main>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      username: undefined,
      password: undefined,
      authError: false
    }
  },
  computed: {
    ...mapState([
      'credentials',
      'clients'
    ]),
    ...mapGetters([
      'isAuthenticated'
    ]),
    client: {
      get () {
        return this.credentials.client
      },
      set (value) {
        this.updateClient(value)
      }
    },
    clientId: {
      get () {
        return this.credentials.clientId
      },
      set (value) {
        this.updateClientId(value)
      }
    },
    clientSecret: {
      get () {
        return this.credentials.clientSecret
      },
      set (value) {
        this.updateClientSecret(value)
      }
    }
  },
  methods: {
    ...mapMutations([
      'updateClient',
      'updateClientId',
      'updateClientSecret'
    ]),
    ...mapActions([
      'authenticate',
      'refreshAllColumns',
      'deleteToken'
    ]),
    async login () {
      try {
        await this.authenticate({ username: this.username, password: this.password })
        this.authError = false
        this.$router.push({ name: 'deck' })
      } catch (e) {
        this.authError = true
      }
      this.refreshAllColumns()
    }
  }
}
</script>

<style lang="scss" scoped>
  main {
    padding: 30px;
    flex: 1;
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
        &.danger {
          input {
            outline: 1px solid red;
          }
        }
      }
    }
  }
</style>
