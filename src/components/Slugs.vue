<template>
  <nav v-if="slugs.length > 0">
    <router-link
      v-for="slug in uniqueSlugs"
      :key="slug"
      :to="`/slug/${slug}`">
      {{ slug }}
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'Slugs',
  props: {
    slugs: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    uniqueSlugs () {
      return [...new Set(this.slugs)]
    }
  }
}
</script>

<style lang="scss" scoped>
  a {
    display: inline-block;
    color: white;
    background-color: #6c757d;
    padding: .25em .4em;
    font-size: 75%;
    font-weight: 700;
    text-align: center;
    border-radius: .25rem;
    margin-right: 2px;
    margin-bottom: 5px;
  }
</style>
