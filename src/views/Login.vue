<template>
  <modal class="on-left header-out">
    
    <template v-slot:header>
      <img src="./../assets/img/afp_logo.png">
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
        <select v-model="lang" required class="inpt inpt-large inpt-bg select">
          <option value='none' selected disabled>Langue des articles</option>
          <option
            v-for="{ label, value, disabled } in languages"
            :key="value.join('|')"
            :value="value"
            :disabled="disabled"
            >
            {{ label }}
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
    </template>
  </modal>
</template>

<script>
import Vue from 'vue'
import Modal from '@/components/Modal.vue'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import afpNews from '@/plugins/api'
import { v4 as uuidv4 } from 'uuid'
import config from '@/config/topics'

export default Vue.extend({
  name: 'Login',
  metaInfo: {
    title: 'Login'
  },
  components: { Modal },
  data () {
    return {
      username: '',
      password: '',
      lang: 'none',
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
    languages () {
        return [
            {
            label: this.$t('languages.en'),
            value: ['en'],
            disabled: false
            },
            {
            label: this.$t('languages.fr'),
            value: ['fr'],
            disabled: false
            },
            {
            label: this.$t('languages.de'),
            value: ['de'],
            disabled: false
            },
            {
            label: this.$t('languages.es'),
            value: ['es'],
            disabled: false
            },
            {
            label: this.$t('languages.pt'),
            value: ['pt'],
            disabled: false
            },
            {
            label: this.$t('languages.ar'),
            value: ['ar'],
            disabled: false
            },
            {
            label: this.$t('languages.zh-tw'),
            value: ['zh-tw'],
            disabled: false
            },
            {
            label: this.$t('languages.zh-cn'),
            value: ['zh-cn'],
            disabled: false
            }
        ]
      }
  },
  methods: {
    ...mapActions([
      'authenticate'
    ]),
    ...mapMutations([
    'resetAllColumns',
    'addColumn'
    ]),
    async login () {
      if (this.username.includes('@afp.com')) {
        this.$toasted.show(this.$t('auth.warning-email').toString(), {
          position: 'bottom-center',
          duration: 1500,
          type: 'error'
        })
        this.authError = true
        return false
      }
      try {
        await this.authenticate({ username: this.username, password: this.password })
        this.$toasted.show(this.$t('auth.success.title').toString(), {
          position: 'bottom-center',
          duration: 1500,
          type: 'success'
        })
        this.authError = false
        this.$ga.enable()

        if (this.lang !== 'none') {
          const topics = config[this.lang]

          for (const topic of topics) {
            if (topic.default) {
              const column = {id: uuidv4(), params: Object.assign({}, afpNews.defaultSearchParams, { products: ['multimedia'], topics: topic.value, langs: this.lang, size: 4, sources: ['afp', 'AFPTV', 'AFP Vidéographie', 'AFP Videographics', 'AFP Vidéographic', 'AFPTV / AFP Videografik'] }), documentsIds: [] }
              this.addColumn(column)
            }
          }
        }

        this.$router.push({ name: 'deck' })

      } catch (e) {
        this.authError = true
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
  .modal-mask{
    background: url("../assets/img/background/background-1.jpg");
  }

  h1 {
    font-size: 1.17em;
    letter-spacing: -0.04rem;
    line-height: inherit;
  }
  a.close {
    display: block;
  }
  form {
    padding: 1rem 2rem;
    
    .select{
      &:invalid {
        color: gray;
      }
      
      // Styling for browsers which do support
      // styling select option elements directly
      [disabled] {
        color: gray;
      }
      
      option {
        color: $dark;
      }
    }

    &>*{
      margin-bottom: 17px;
    }
    &.danger {
      input {
        outline: 1px solid red;
      }
    }
  }
</style>
