<template>
  <modal @close="$router.push({ name: 'deck' })">
    <template slot="actions">
      <router-link
        :to="{ name: 'deck' }"
        aria-label="Close"
        class="btn btn-icon close"
      >
        <i class="UI-icon UI-close-alt icon-small" />
      </router-link>
    </template>
    <template slot="header">
      <h3>{{ $t('about.title') }}</h3>
    </template>
    <article slot="body">
      <p
        v-for="(p, i) in $t('about.description')"
        :key="`p-${i}`"
      >
        {{ p }}
      </p>

      <p>
        <button
          :aria-label="$t('tour.goto')"
          class="btn btn-large"
          @click.prevent="$router.push({ name: 'tour' })"
        >
          {{ $t('tour.goto') }}
        </button>

        <button
          v-if="displayInstallApp"
          :aria-label="$t('install-app')"
          class="btn btn-large"
          @click.prevent="installApp"
        >
          {{ $t('install-app') }}
        </button>

        <button
          v-if="isAuthenticated"
          aria-label="Log out"
          class="btn btn-large danger"
          @click.prevent="logoutHandler"
        >
          {{ $t('auth.logout') }}
        </button>
      </p>
    </article>
    <div slot="footer">
      <p>{{ $t('about.version') }} {{ version }}</p>
    </div>
  </modal>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import installApp from '@/plugins/installApp'
import Modal from '@/components/Modal'
import { version } from '@/../package.json'

export default {
  name: 'About',
  metaInfo: {
    title: 'About'
  },
  components: { Modal },
  data () {
    return {
      version,
      installApp
    }
  },
  computed: {
    ...mapState([
      'displayInstallApp'
    ]),
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    logoutHandler () {
      this.$toasted.show(this.$t('auth.not-authenticated.toast').toString(), {
        position: 'bottom-center',
        duration: 1500,
        type: 'info'
      })
      this.logout()
    }
  }
}
</script>

<style lang="scss" scoped>
  a.close {
    display: block;
  }
</style>
