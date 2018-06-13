<template>
  <article class="document">
    <figure
      ref="picture"
      :class="{
        small: displayDetails
      }"
      :style="{
        width: `${pictureWidth}px`
      }"
      @click="displayDetailsActive = !displayDetailsActive">
      <img
        :src="preview.href"
        :srcset="`${preview.href} ${preview.width}w, ${highDef.href} ${highDef.width}w`"
        :sizes="`${pictureWidth}px`"
        :key="doc.uno"
        :class="orientation"
        width="100%">
    </figure>
    <transition name="slide">
      <aside v-show="displayDetails">
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
import moment from 'moment'

export default {
  name: 'Photo',
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentHeight: 300,
      currentWidth: 300,
      displayDetailsActive: false
    }
  },
  computed: {
    published () {
      return moment(this.doc.published).format('MMMM Do YYYY, h:mm a')
    },
    orientation () {
      if (this.ratio >= 1) {
        return 'horizontal'
      }
      return 'vertical'
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
    ratio () {
      return this.highDef.width / this.highDef.height
    },
    pictureWidth () {
      return Math.min(this.ratio * this.currentHeight, this.currentWidth)
    },
    displayDetails () {
      return this.displayDetailsActive
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize () {
      this.currentHeight = this.$el.clientHeight
      this.currentWidth = window.innerWidth
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
article.document {
  z-index: 5;
  background-color: $primary-color;
  figure {
    position: absolute;
    top: 50%;
    transform: scale(1) translateY(-50%);
    transform-origin: top left;
    transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
    @include breakpoint(mobile) {
      transform-origin: top;
    }
    margin: 0px;
    cursor: zoom-out;

    &.small {
      top: 0px;
      transform: scale(0.6);
      cursor: zoom-in;
    }

    img {
      height: 100%;
      width: 100%;
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
