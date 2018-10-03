<template>
  <modal @close="$router.push({ name: 'deck' })">
    <template slot="header">
      <h3>{{ $t('about.title') }}</h3>
      <router-link
        :to="{ name: 'deck' }"
        class="close">
        <i class="UI-icon UI-close" />
      </router-link>
    </template>
    <article slot="body">
      <p
        v-for="(p, i) in $t('about.description')"
        :key="`p-${i}`">
        {{ p }}
      </p>

      <a
        href="#"
        @click.prevent="$router.push({ name: 'tour' })">
        {{ $t('tour.goto') }}
      </a>
    </article>
    <p slot="footer">
      {{ $t('about.version') }} {{ version }}
    </p>
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { version } from '@/../package.json'

export default {
  name: 'About',
  components: { Modal },
  data () {
    return {
      version
    }
  }
}
</script>

<style lang="scss" scoped>
  .close {
    position: absolute;
    right: -10px;
    top: -20px;
    i {
      font-size: 24px;
      color: grey;
    }
  }
</style>
