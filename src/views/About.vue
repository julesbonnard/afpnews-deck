<template>
  <modal
    class="about"
    @close="$router.push({ name: 'deck' })"
  >
    <template #actions>
      <router-link
        :to="{ name: 'deck' }"
        aria-label="Close"
        class="btn btn-icon close"
      >
        <i class="UI-icon UI-close-alt icon-small" />
      </router-link>
    </template>
    <template #header>
      <h3>{{ $t('about.title') }}</h3>
    </template>
    <template #body>
      <article>
        <p
          v-for="(p, i) in $t('about.description')"
          :key="`p-${i}`"
        >
          {{ p }}
        </p>

        <p>
          <button
            v-if="displayInstallApp"
            :aria-label="$t('install-app')"
            class="btn btn-large"
            @click.prevent="installApp"
          >
            {{ $t('install-app') }}
          </button>
        </p>
      </article>
    </template>
    <template #footer>
      <p>{{ $t('about.version') }} {{ version }}</p>
    </template>
  </modal>
</template>

<script>
import { mapState } from 'vuex'
import installApp from '@/plugins/installApp'
import Modal from '@/components/Modal'
import info from '@/../package.json'

export default {
  name: 'About',
  metaInfo: {
    title: 'About'
  },
  components: { Modal },
  data () {
    return {
      version: info.version,
      installApp
    }
  },
  computed: {
    ...mapState([
      'displayInstallApp'
    ])
  }
}
</script>

<style lang="scss" scoped>
.about{
  a.close {
    display: block;
    text-align: right;
    i{
      font-size: 20px;
      font-weight: 600;
    }
  }

  h3{
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 2rem;
  }

  p{
    margin-bottom: 1rem;
  }
}

</style>
