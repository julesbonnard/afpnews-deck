<template>
  <nav v-if="slugs.length > 0">
    <router-link
      v-for="slug in slugs"
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
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
  a {
    display: block;
    //color: white;
    color: $link-secondary;
    //padding: .25em 0;
    font-size: 0.9rem;
    font-weight: 400;
    text-align: left;
    line-height: 28px;
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
</style>
