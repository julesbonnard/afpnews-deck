<template>
  <modal @close="$router.push({ name: 'deck' })">
    <template slot="header">
      <h3 v-if="isAuthenticated">{{ $t('auth.success.title') }}</h3>
      <h3 v-else>{{ $t('auth.not-authenticated.title') }}</h3>
      <router-link
        :to="{ name: 'deck' }"
        aria-label="Close"
        class="close">
        <i class="UI-icon UI-close" />
      </router-link>
    </template>
    <template slot="body">
      <form
        v-if="isAuthenticated">
        <p>{{ $t('auth.success.description') }}</p>
        <button
          aria-label="Log out"
          class="btn btn-large danger"
          @click.prevent="reset">
          {{ $t('auth.logout') }}
        </button>
      </form>
      <form
        v-else
        :class="{ danger: authError }"
        @submit.stop.prevent="login">
        <div v-if="client === 'other'">
          <input
            id="client-id"
            v-model.trim="clientId"
            :placeholder="$t('auth.clientId')"
            :aria-label="$t('auth.clientId')"
            type="text"
            name="client-id"
            autocomplete="client-id"
            class="inpt inpt-large"
            required>
          <input
            id="client-secret"
            v-model.trim="clientSecret"
            :placeholder="$t('auth.clientSecret')"
            :aria-label="$t('auth.clientSecret')"
            type="text"
            name="client-secret"
            autocomplete="client-secret"
            class="inpt inpt-large"
            required>
        </div>
        <input
          id="username"
          v-model.trim="username"
          :placeholder="$t('auth.username')"
          :aria-label="$t('auth.username')"
          type="text"
          name="username"
          autocomplete="username"
          class="inpt inpt-large"
          required>
        <input
          id="password"
          v-model.trim="password"
          :placeholder="$t('auth.password')"
          :aria-label="$t('auth.password')"
          type="password"
          name="password"
          autocomplete="password"
          class="inpt inpt-large"
          required>
        <button
          aria-label="Submit"
          class="btn btn-large"
          type="submit">
          {{ $t('submit') }}
        </button>
        <i18n
          :path="client !== 'other' ? 'auth.not-authenticated.external' : 'auth.not-authenticated.afp'"
          tag="p"
          for="click">
          <a
            href="#"
            @click.prevent="client !== 'other' ? client = 'other' : client = 'afpdeck'">
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
  metaInfo: {
    title: 'Login'
  },
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
      'credentials'
    ]),
    ...mapGetters([
      'isAuthenticated'
    ]),
    client: {
      get () {
        return this.credentials.client
      },
      set (value) {
        this.setClient(value)
      }
    },
    clientId: {
      get () {
        return this.credentials.clientId
      },
      set (value) {
        this.setClientId(value)
      }
    },
    clientSecret: {
      get () {
        return this.credentials.clientSecret
      },
      set (value) {
        this.setClientSecret(value)
      }
    }
  },
  methods: {
    ...mapMutations([
      'setClient',
      'setClientId',
      'setClientSecret'
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
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect)
        } else {
          this.$router.push({ name: 'deck' })
        }
      } catch (e) {
        this.authError = true
      }
      await this.refreshAllColumns()
    },
    async reset () {
      await this.logout()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
  a.close {
    position: absolute;
    right: -10px;
    top: -20px;
    text-decoration: none;
    i {
      font-size: 24px;
      color: grey;
    }
  }
  form {
    // input {
    //   width: 100%;
    //   background: transparent;
    //   border: 1px solid #ced4da;
    //   border-radius: .1rem;
    //   height: 48px;
    //   padding: .375rem .75rem;
    // }
    // input {
    //   margin-bottom: 12px;
    // }
    &.danger {
      input {
        outline: 1px solid red;
      }
    }
  }
</style>
