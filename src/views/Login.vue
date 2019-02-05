<template>
  <modal @close="$router.push({ name: 'deck' })">
    <template slot="actions">
      <router-link
        :to="{ name: 'deck' }"
        aria-label="Close"
        class="btn btn-icon close">
        <i class="UI-icon UI-close-alt icon-small" />
      </router-link>
    </template>
    <template slot="header">
      <h1 v-if="isAuthenticated">{{ $t('auth.success.title') }}</h1>
      <h1 v-else>{{ $t('auth.not-authenticated.title') }}</h1>
    </template>
    <template slot="body">
      <form
        :class="{ danger: authError }"
        @submit.stop.prevent="login">
        <input
          id="username"
          v-model.trim="username"
          :placeholder="$t('auth.username')"
          :aria-label="$t('auth.username')"
          type="text"
          name="username"
          autocomplete="username"
          class="inpt inpt-large inpt-bg"
          required>
        <input
          id="password"
          v-model.trim="password"
          :placeholder="$t('auth.password')"
          :aria-label="$t('auth.password')"
          type="password"
          name="password"
          autocomplete="password"
          class="inpt inpt-large inpt-bg"
          required>
        <button
          aria-label="Submit"
          class="btn btn-large"
          type="submit">
          {{ $t('submit') }}
        </button>
      </form>
    </template>
    <template slot="footer">
      <p>{{ $t('auth.cookies') }}</p>
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
    ])
  },
  methods: {
    ...mapActions([
      'authenticate',
      'refreshAllColumns'
    ]),
    async login () {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
  h1 {
    font-size: 1.17em;
    letter-spacing: -0.04rem;
    line-height: inherit;
  }
  a.close {
    display: block;
  }
  form {
    &.danger {
      input {
        outline: 1px solid red;
      }
    }
  }
</style>
