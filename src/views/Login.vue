<template>
  <modal @close="$router.push({ name: 'deck' })">
    <template v-slot:actions>
      <router-link
        :to="{ name: 'deck' }"
        aria-label="Close"
        class="btn btn-icon close"
      >
        <i class="UI-icon UI-close-alt icon-small" />
      </router-link>
    </template>
    <template v-slot:header>
      <h1 v-if="isAuthenticated">
        {{ $t('auth.success.title') }}
      </h1>
      <h1 v-else>
        {{ $t('auth.not-authenticated.title') }}
      </h1>
    </template>
    <template v-slot:body>
      <form
        :class="{ danger: authError }"
        @submit.stop.prevent="login"
      >
        <input
          id="username"
          v-model.trim="username"
          :placeholder="$t('auth.username')"
          :aria-label="$t('auth.username')"
          type="text"
          name="username"
          autocomplete="username"
          class="inpt inpt-large inpt-bg"
          required
        >
        <input
          id="password"
          v-model.trim="password"
          :placeholder="$t('auth.password')"
          :aria-label="$t('auth.password')"
          type="password"
          name="password"
          autocomplete="password"
          class="inpt inpt-large inpt-bg"
          required
        >
        <button
          aria-label="Submit"
          class="btn btn-large"
          type="submit"
        >
          {{ $t('submit') }}
        </button>
      </form>
    </template>
    <template v-slot:footer>
      <p>{{ $t('auth.cookies') }}</p>
    </template>
  </modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/components/Modal.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default Vue.extend({
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
        this.$toasted.show(this.$t('auth.success.title').toString(), {
          position: 'bottom-center',
          duration: 1500,
          type: 'success'
        })
        this.authError = false
        const redirects = this.$route.query.redirect
        if (redirects) {
          if (Array.isArray(redirects)) {
            const redirect = redirects[0]
            if (redirect) {
              this.$router.push({ path: redirect })
            }
          } else {
            this.$router.push({ path: redirects })
          }
        } else {
          this.$router.push({ name: 'deck' })
        }
      } catch (e) {
        this.authError = true
      }
      await this.refreshAllColumns()
    }
  }
})
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
