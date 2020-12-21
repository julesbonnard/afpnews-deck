<template>
  <nav
    v-if="slugs.length > 0"
    :class="layout"
  >
    <div
      v-for="slug in uniqueSlugs"
      :key="slug"
      class="slug"
    >
      <router-link
        v-if="type === 'topic' ? getTopicMapped(slug) : true"
        :to="`/deck/${type}/${lang}/${slug}`"
        rel="tag"
      >
        {{ type === 'topic' ? getTopicMapped(slug) : slug }}
      </router-link>
    </div>
  </nav>
</template>

<script>
import config from '@/config/topics'

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
    },
    type: {
      type: String,
      default: 'slug'
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
    uniqueSlugs () {
      return [...new Set(this.slugs)]
    }
  },
  methods: {
    getTopicMapped (value) {
      const currentTopic = config[this.lang].find(i => i.value.includes(value))
      if (currentTopic) {
        return currentTopic.label
      }
      return false
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
  margin-bottom: 2rem;
  &.topics{
    a{
      background: $secondary-color;
    }
  }
  .slug{
    margin-bottom: 15px;
  }
  flex-direction: column;
  a {
    font-size: 16px;
    font-weight: 800;
    text-decoration: none;
    text-transform: capitalize;
    transition: 0.1s ease-out;
    padding: 5px;
    background: #FF6E6E;
    color: $light;
    display: inline;

    &:hover{
      background: $dark;
    }
  }

  @media screen and (max-width: 640px) {
    flex-direction: row;
    .slug{
      display: inline-block;
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
      }
    }
  }
}
</style>
