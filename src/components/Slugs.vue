<template>
  <nav
    v-if="slugs.length > 0"
    :class="layout"
  >
  <div class="slug"
      v-for="slug in uniqueSlugs"
      :key="slug">
    <router-link :to="`/deck/${type}/${lang}/${parseSlash(slug)}`" rel="tag" v-if="!(slug.startsWith('ONLINE-NEWS-'))">
      {{ getTopicMapped(slug)}}
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
      if (this.lang !== undefined) {
        const currentTopic = config[this.lang].filter(i => i.value[0] == value)
        if (currentTopic.length > 0) {
          return currentTopic[0].label
        }
      }
      return value
    },
    parseSlash (value) {
      return value.replace('/', '*-*')
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
      background: #7DFAAF;
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
