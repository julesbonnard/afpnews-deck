<template>
  <nav v-if="uniqueSlugs.length > 0">
    <h3 v-if="title">
      {{ title }}
    </h3>
    <ul :class="`${type} ${layout}`">
      <li
        v-for="slug in uniqueSlugs"
        :key="slug.id"
      >
        <router-link
          :to="`/${type}/${lang}/${slug.id}`"
          rel="tag"
        >
          {{ slug.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import config from '@/config/topics'

export default {
  name: 'Slugs',
  props: {
    title: {
      type: String,
      default: ''
    },
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
      const unique = [...new Set(this.slugs)]
      if (this.type === 'topic') {
        return unique.map(d => {
          const result = this.getTopicMapped(d)
          if (result) {
            return {
              id: result.id.join('|'),
              label: result.label
            }
          }
          return false
        }).filter(d => d.label)
      }
      return unique.map(d => ({
        id: d,
        label: d
      }))
    }
  },
  methods: {
    getTopicMapped (value) {
      const currentTopic = config[this.lang].find(i => i.value.includes(value))
      if (currentTopic) {
        return {
          id: currentTopic.value,
          label: currentTopic.label
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
nav {
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    display: flex;

    li {
      line-height: 2rem;
    }
    
    &.vertical {
      flex-direction: column;
    }

    &.horizontal {
      margin: 12px 0px;
      li {
        margin: 0 2px;
      }
    }

    &.topic {
      li a {
        background-color: $secondary-color;
      }
    }

    li {
      a {
        font-size: 16px;
        font-weight: 800;
        text-decoration: none;
        transition: 0.1s ease-out;
        padding: 5px;
        background-color: #FF6E6E;
        color: $light;

        &:hover{
          background-color: $dark;
        }
      }
    }
  }

  @media screen and (max-width: 640px) {
    ul.vertical, ul.horizontal {
      display: block;
      
      li {
        display: inline-block;
        margin: 0px 2px;
      }
    }
  }
}
.night-mode {
  nav h3 {
    color: #eee;
  }
}
</style>
