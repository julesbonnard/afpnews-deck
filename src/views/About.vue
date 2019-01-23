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
      <h3>{{ $t('about.title') }}</h3>
    </template>
    <article slot="body">
      <p
        v-for="(p, i) in $t('about.description')"
        :key="`p-${i}`">
        {{ p }}
      </p>

      <p>
        <button
          :aria-label="$t('tour.goto')"
          class="btn btn-large"
          @click.prevent="$router.push({ name: 'tour' })">
          {{ $t('tour.goto') }}
        </button>

        <button
          v-if="displayInstallApp"
          :aria-label="$t('install-app')"
          class="btn btn-large"
          @click.prevent="installApp">
          {{ $t('install-app') }}
        </button>

        <button
          v-if="isAuthenticated"
          aria-label="Log out"
          class="btn btn-large danger"
          @click.prevent="logout">
          {{ $t('auth.logout') }}
        </button>
      </p>
    </article>
    <div slot="footer">
      <p v-if="storage">{{ storagePersisted ? $t('about.quota-estimate-persistent', prettyStorage) : $t('about.quota-estimate-temporary', prettyStorage) }}
        <a
          href="#"
          @click.prevent="clearCache">
          {{ $t('about.clear-cache') }}
        </a>
      </p>

      <p>{{ $t('about.version') }} {{ version }}</p>
    </div>
  </modal>
</template>

<script>
import prettyBytes from 'pretty-bytes'
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
      installApp,
      storage: null,
      storagePersisted: false
    }
  },
  computed: {
    ...mapState([
      'displayInstallApp'
    ]),
    ...mapGetters([
      'isAuthenticated'
    ]),
    prettyStorage () {
      if (!this.storage) return null
      return {
        usage: prettyBytes(this.storage.usage),
        quota: prettyBytes(this.storage.quota)
      }
    }
  },
  mounted () {
    this.estimateQuota()
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    async estimateQuota () {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        this.storage = await navigator.storage.estimate()
      }
    },
    async isStoragePersistent () {
      if (navigator.storage && navigator.storage.persist && navigator.storage.persisted) {
        this.storagePersisted = await navigator.storage.persisted()
      }
    },
    async clearCache () {
      if ('serviceWorker' in navigator) {
        const cacheNames = await caches.keys()
        cacheNames.forEach(cacheName => caches.delete(cacheName))
        this.$ga.event('storage', 'clear')
        this.estimateQuota()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  a.close {
    display: block;
  }
</style>
