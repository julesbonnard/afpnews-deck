<template>
  <nav v-if="slugs.length > 0">
    <router-link
      v-for="slug in uniqueSlugs"
      :key="slug"
      :to="`/slug/${slug}`"
      rel="tag">
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
@import "@/assets/scss/variables.scss";
nav {
  a {
    display: block;
    //color: white;
    color: $link-secondary;
    //padding: .25em 0;
    font-size: 0.9rem;
    font-weight: 400;
    text-align: left;
    line-height: 1rem;
    margin-bottom: 15px;
    border-radius: .25rem;
    //margin-right: 2px;
    //margin-bottom: 5px;
    text-decoration: none;
    text-transform: capitalize;
    transition: transform 0.07s ease-out;

    &:hover{
      color: darken($link-secondary, 25);
      transform : translateX(3px);
      &:before{
        content: ">";
      }
    }
  }
  @include breakpoint(mobile) {
    overflow-x: auto;
    margin-bottom: 15px;
    a {
      // display: inline;
      display: inline-block;
      margin-right: 15px;
      margin-bottom: 0px;
      // white-space: nowrap;
      &:before{
        content: ">";
      }
    }
  }
}
</style>
