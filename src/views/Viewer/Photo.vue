<template>
  <article @click="displayDetailsActive = !displayDetailsActive">
    <progressive-image
      :display-small="displayDetails"
      :img-low="preview"
      :img-high="highDef"
      :class="{ small: displayDetails }"
      class="figure" />
    <transition name="slide">
      <aside
        v-show="displayDetails">
        <router-link
          v-if="doc.country && doc.city"
          :to="`/place/${doc.country}/${doc.city}`"
          tag="h1">
          {{ doc.city }} ({{ doc.country }})
        </router-link>
        <h2 v-if="doc.creator">
          <router-link
            v-for="(creator, i) in doc.creator.split(',')"
            :key="creator"
            :to="`/creator/${creator.trim()}`">
            <span>{{ creator.toLowerCase().trim() }}</span>
            <span v-if="(i + 1) < doc.creator.split(',').length">, </span>
          </router-link>
        </h2>
        <slugs :slugs="doc.slugs" />
        <p
          :key="`date-${locale}`"
          class="date">
          {{ $d(new Date(doc.published), 'long') }}
        </p>
        <div v-if="doc.product !== 'infographie'">
          <p
            v-for="(p, i) in doc.news"
            :key="i"
            v-html="p" />
        </div>
      </aside>
    </transition>
    <slot name="actions" />
  </article>
</template>

<script>
import ProgressiveImage from '@/components/ProgressiveImage'
import Slugs from '@/components/Slugs'
import { mapState } from 'vuex'

export default {
  name: 'Photo',
  components: { ProgressiveImage, Slugs },
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      displayDetailsActive: false
    }
  },
  computed: {
    ...mapState([
      'locale'
    ]),
    media () {
      return this.doc.medias[0]
    },
    preview () {
      return this.media.sizes.find(size => size.role === 'Preview')
    },
    highDef () {
      return this.media.sizes.find(size => size.role === 'HighDef')
    },
    displayDetails () {
      return this.displayDetailsActive
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
@media screen {
  article {
    z-index: 6;
    background-color: $primary-color;
    overflow: hidden;
    .figure {
      cursor: zoom-out;
      height: 100%;
      width: 100%;
      &.small {
        cursor: zoom-in;
        height: 50%;
      }
    }
    aside {
      position: absolute;
      bottom: 0px;
      right: 0px;
      overflow-y: auto;
      overscroll-behavior-y: contain;
      background-color: white;
      padding: 30px;
      @include breakpoint(mobile) {
        padding: 15px;
      }
      transition: transform .3s ease-in-out;
      max-height: 70%;
      max-width: $max-document-width;

      h1 {
        font-size: 2rem;
        line-height: 2.2rem;
        @include breakpoint(mobile) {
          font-size: 24px;
          line-height: 24px;
        }
      }

      h2 {
        font-size: 1.3rem;
        line-height: 1.4rem;
        @include breakpoint(mobile) {
          font-size: 16px;
          line-height: 16px;
        }
      }

      h1, h2 {
        cursor: pointer;
        a {
          color: black;
        }
      }

      p {
        font-size: 18px;
        line-height: 28.44px;
      }
    }
  }

  .slide-enter,
  .slide-leave-active {
    transform: translateX(100%);
  }
}
h2 {
  a {
    text-transform: capitalize;
  }
}
@media print {
  aside {
    display: block !important;
  }
}
</style>
