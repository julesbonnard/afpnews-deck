<template>
  <figure
    :style="{
      transform: displaySmall ? `scale(0.8)` : `translateY(${(currentHeight - pictureHeight) / 2}px)`
    }"
  >
    <img
      :key="imgLow.href"
      :src="imgLow.href"
      :srcset="loaded ? srcset : null"
      :sizes="loaded ? sizes : null"
      :style="{
        width: `${pictureWidth}px`,
        height: `${pictureHeight}px`
      }"
    >
  </figure>
</template>

<script>
export default {
  name: 'ProgressiveImage',
  props: {
    imgLow: {
      type: Object,
      required: true
    },
    imgHigh: {
      type: Object,
      required: true
    },
    displaySmall: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loaded: false,
      currentWidth: 300,
      currentHeight: 300
    }
  },
  computed: {
    ratio () {
      return this.imgHigh.width / this.imgHigh.height
    },
    pictureWidth () {
      return Math.min(this.ratio * this.currentHeight, this.currentWidth)
    },
    pictureHeight () {
      return this.pictureWidth / this.ratio
    },
    srcset () {
      return `${this.imgLow.href} ${this.imgLow.width}w, ${this.imgHigh.href} ${this.imgHigh.width}w`
    },
    sizes () {
      return `${this.pictureWidth}px`
    }
  },
  watch: {
    imgHigh () {
      this.loaded = false
      this.loadHighRes()
    }
  },
  mounted () {
    const prefix = 'orientation' in screen ? ''
      : 'mozOrientation' in screen ? 'moz'
        : 'msOrientation' in screen ? 'ms'
          : null
    window.addEventListener('resize', this.onResize)
    window.addEventListener(`${prefix}orientationchange`, this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('orientationchange', this.onResize)
  },
  methods: {
    onResize () {
      const { width, height } = this.$el.parentNode.getBoundingClientRect()
      this.currentWidth = width
      this.currentHeight = height
      this.loadHighRes()
    },
    async loadHighRes () {
      await this.$nextTick()
      if (this.loaded) return false
      if (this.currentWidth * window.devicePixelRatio <= this.imgLow.width) return false
      const img = new Image()
      img.srcset = this.srcset
      img.sizes = this.sizes
      img.src = this.imgHigh.href
      img.onload = _ => {
        this.loaded = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
figure {
  margin: 0px;
}
</style>
