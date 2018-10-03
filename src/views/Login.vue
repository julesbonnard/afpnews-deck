<template>
  <modal @close="$router.push({ name: 'deck' })">
    <template slot="header">
      <h3 v-if="isAuthenticated">{{ $t('auth.success.title') }}</h3>
      <h3 v-else>{{ $t('auth.not-authenticated.title') }}</h3>
      <router-link
        :to="{ name: 'deck' }"
        class="close">
        <i class="UI-icon UI-close" />
      </router-link>
    </template>
    <template slot="body">
      <form
        v-if="isAuthenticated">
        <p>{{ $t('auth.success.description') }}</p>
        <button
          @click.prevent="logout">
          {{ $t('auth.logout') }}
        </button>
      </form>
      <form
        v-else
        :class="{ danger: authError }"
        @submit.stop.prevent="login">
        <div v-if="client === 'other'">
          <div class="form-group">
            <label for="client-id">{{ $t('auth.clientId') }}</label>
            <input
              id="client-id"
              v-model="clientId"
              type="text"
              name="client-id"
              autocomplete="client-id">
          </div>
          <div class="form-group">
            <label for="client-secret">{{ $t('auth.clientSecret') }}</label>
            <input
              id="client-secret"
              v-model="clientSecret"
              type="text"
              name="client-secret"
              autocomplete="client-secret">
          </div>
        </div>
        <div class="form-group">
          <label for="client-id">{{ $t('auth.username') }}</label>
          <input
            id="username"
            v-model="username"
            type="text"
            name="username"
            autocomplete="username">
        </div>
        <div class="form-group">
          <label for="client-id">{{ $t('auth.password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="password">
        </div>
        <div class="form-group">
          <button type="submit">{{ $t('submit') }}</button>
        </div>
        <i18n
          :path="client !== 'other' ? 'auth.not-authenticated.external' : 'auth.not-authenticated.afp'"
          tag="p"
          for="click">
          <a
            href="#"
            @click="client !== 'other' ? client = 'other' : client = 'afpdeck'">
            {{ $t('auth.not-authenticated.click') }}
          </a>
        </i18n>
      </form>
    </template>
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: { Modal },
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
      'logout'
    ]),
    async login () {
      if (!this.client) {
        this.client = 'afpdeck'
      }
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
@import "@/assets/scss/variables.scss";
  .close {
    position: absolute;
    right: -10px;
    top: -20px;
    i {
      font-size: 24px;
      color: grey;
    }
  }
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
</style>
