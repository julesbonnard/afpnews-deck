<template>
  <panel
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
      </article>
    </template>
  </panel>
</template>

<script>
import Panel from '@/components/Panel'

export default {
  name: 'About',
  metaInfo: {
    title: 'About'
  },
  components: { Panel }
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
    margin-bottom: 1rem;
  }

  p{
    margin-bottom: 1rem;
  }
}

</style>
