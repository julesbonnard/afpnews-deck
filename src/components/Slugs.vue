<template>
  <nav
    v-if="slugs.length > 0"
    :class="layout"
  >
    <router-link
      v-for="slug in uniqueSlugs"
      :key="slug"
      :to="`/slug/${slug}`"
      rel="tag"
    >
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
    },
    layout: {
      type: String,
      default: 'vertical'
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
  @media print {
    display: none;
  }
  a {
    color: $link-secondary;
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1rem;
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
  &.vertical {
    a {
      display: block;
      margin-bottom: 15px;
    }
  }
  &.horizontal {
    overflow-x: auto;
    margin-bottom: 15px;
    a {
      display: inline-block;
      margin-right: 15px;
      &:before{
        content: ">";
      }
    }
  }
  @include breakpoint(mobile) {
    overflow-x: auto;
    overflow-y: hidden;
    margin-bottom: 15px;

    &.vertical, &.horizontal {
      a {
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 0px;
        &:before{
          content: ">";
        }
      }
    }
  }
}
</style>
