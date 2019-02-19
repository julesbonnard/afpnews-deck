<template>
  <modal @close="$router.push({ name: 'deck' })">
    <template v-slot:header>
      <h3>{{ $t('browser-warning.title') }}</h3>
      <router-link
        :to="{ name: 'deck' }"
        aria-label="Close"
        class="btn btn-icon close"
      >
        <i class="UI-icon UI-close-alt icon-small" />
      </router-link>
    </template>
    <template v-slot:body>
      <p>{{ $t('browser-warning.description') }}</p>
      <h4>{{ $t('browser-warning.unsupported-features') }}</h4>
      <ul>
        <li
          v-for="([feature]) in $modernizr.unsupportedFeatures"
          :key="feature"
        >
          {{ feature }}
        </li>
      </ul>
    </template>
  </modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/components/Modal.vue'

export default Vue.extend({
  name: 'BrowserWarning',
  metaInfo: {
    title: 'Browser warning'
  },
  components: { Modal }
})
</script>

<style lang="scss" scoped>
  a.close {
    position: absolute;
    right: -10px;
    top: -20px;
  }
</style>
