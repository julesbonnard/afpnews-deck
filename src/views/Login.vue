<template>
  <modal
    :background-image="randomBgImage"
    class="on-left"
  >
    <template #header>
      <h1>AFP Deck</h1>
    </template>
    <template #body>
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
        <select
          id="default-lang"
          v-model="lang"
          required
          name="default-lang"
          autocomplete="default-lang"
          class="slct slct-large slct-bg"
        >
          <option
            selected
            disabled
            :value="null"
          >
            {{ $t('auth.language') }}
          </option>
          <option
            v-for="language in languages"
            :key="language"
            :value="language"
          >
            {{ $t(`languages.${language}`) }}
          </option>
        </select>
        <button
          aria-label="Submit"
          class="btn btn-large"
          type="submit"
        >
          {{ $t('submit') }}
        </button>
      </form>
      <p class="cookies">
        {{ $t('auth.cookies') }}
      </p>
    </template>
  </modal>
</template>

<script>
import Vue from 'vue'
import Modal from '@/components/Modal.vue'
import { mapState, mapActions } from 'vuex'

export default Vue.extend({
  name: 'Login',
  metaInfo: {
    title: 'Login | AFP Deck'
  },
  components: { Modal },
  data () {
    return {
      username: null,
      password: null,
      authError: false
    }
  },
  computed: {
    ...mapState([
      'defaultLang'
    ]),
    lang: {
      get () {
        return this.defaultLang
      },
      set (val) {
        this.changeAllContentLanguage(val)
      }
    },
    languages () {
      return ['en', 'fr', 'de', 'es', 'pt', 'ar', 'zh-tw', 'zh-cn']
    },
    randomBgImage () {
      return `url('img/background/background-${Math.floor( Math.random() * 5) + 1}.jpg')`
    }
  },
  methods: {
    ...mapActions([
      'authenticate',
      'changeAllContentLanguage'
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
        this.$ga.enable()
        this.$router.push(this.$route.query.redirect ? { path: this.$route.query.redirect } : { name: 'deck' })

      } catch (e) {
        this.authError = true
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
  .modal-mask {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  h1 {
    font-size: 1.17em;
    letter-spacing: -0.04rem;
    line-height: inherit;
  }
  form {
    &>*{
      margin-bottom: 17px;
    }
    &.danger {
      input {
        outline: 1px solid $danger-color;
        background-color: rgba($danger-color, 0.2);
      }
    }
  }
  .cookies {
    color: $grey-cold-5;
  }
</style>
