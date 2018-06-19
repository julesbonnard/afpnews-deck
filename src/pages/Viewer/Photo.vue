<template>
  <article
    class="document"
    @click="displayDetailsActive = !displayDetailsActive">
    <progressive-image
      :display-small="displayDetails"
      :img-low="preview"
      :img-high="highDef"
      :class="{ transition: transitionActive, figure: true, small: displayDetails }" />
    <transition name="slide">
      <aside
        v-show="displayDetails">
        <h1>{{ doc.slugs.filter(d => d.length > 0).map(d => `#${d}`).join(' ') }}</h1>
        <p>{{ published }}</p>
        <p
          v-for="(p, i) in doc.news"
          :key="i"
          v-html="p"/>
      </aside>
    </transition>
    <slot name="actions" />
  </article>
</template>

<script>
import ProgressiveImage from '@/components/ProgressiveImage'
import moment from 'moment'

export default {
  name: 'Photo',
  components: { ProgressiveImage },
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      transitionActive: false,
      displayDetailsActive: false
    }
  },
  computed: {
    published () {
      return moment(this.doc.published).format('MMMM Do YYYY, h:mm a')
    },
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
  },
  watch: {
    async doc () {
      this.transitionActive = false
      await this.$nextTick()
      this.transitionActive = true
    }
  },
  mounted () {
    this.transitionActive = true
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
article.document {
  z-index: 6;
  background-color: $primary-color;
  .figure {
    transform-origin: top left;
    &.transition {
      transition: transform 0.3s ease-in-out;
    }
    @include breakpoint(mobile) {
      transform-origin: top;
    }
    cursor: zoom-out;

    &.small {
      cursor: zoom-in;
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
      font-size: 50px;
      line-height: 60px;
      @include breakpoint(mobile) {
        font-size: 24px;
        line-height: 24px;
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
</style>
