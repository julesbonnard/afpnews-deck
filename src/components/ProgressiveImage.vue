<template>
  <figure>
    <img
      ref="image"
      :key="imgLow.href"
      :src="imgLow.href"
      :srcset="loaded ? srcset : null"
      :sizes="loaded ? sizes : null"
      :width="pictureWidth"
      :height="pictureHeight"
    >
  </figure>
</template>

<script>
import { select, event } from 'd3-selection'
import { zoom } from 'd3-zoom'
import { transition } from 'd3-transition'
import { easeLinear } from 'd3-ease'

const prefix = 'orientation' in screen ? ''
  : 'mozOrientation' in screen ? 'moz'
    : 'msOrientation' in screen ? 'ms'
      : null

const t = transition()
  .duration(350)
  .ease(easeLinear)

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
      currentHeight: 300,
      scale: 1
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
      return `${this.pictureWidth * this.scale}px`
    },
    extent () {
      return [[0, 0], [this.currentWidth, this.currentHeight]]
    },
    translateExtent () {
      return [[0, 0], [this.pictureWidth, this.pictureHeight]]
    },
    scaleExtent () {
      if (this.displaySmall) {
        return [0.8, 4]
      }
      return [1, 4]
    },
    zoomManager () {
      return zoom()
        .extent(this.extent)
        .translateExtent(this.translateExtent)
        .scaleExtent(this.scaleExtent)
        .on('zoom', this.zoom)
    },
    zoomed () {
      return this.scale > 1
    }
  },
  watch: {
    async 'imgLow.href' () {
      this.loaded = false
      this.loadHighRes()
      await this.$nextTick()
      this.enableZoom()
      this.initZoom(false)
    },
    scale () {
      this.loadHighRes()
    },
    zoomed (val) {
      this.$emit('zoomed', val)
    },
    displaySmall (val) {
      this.enableZoom()
      this.initZoom(true)
    }
  },
  async mounted () {
    window.addEventListener('resize', this.onResize)
    window.addEventListener(`${prefix}orientationchange`, this.onResize)
    this.onResize()

    await this.$nextTick()
    this.enableZoom()
    this.initZoom(false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener(`${prefix}orientationchange`, this.onResize)
  },
  methods: {
    onResize () {
      const { width, height } = this.$el.getBoundingClientRect()
      this.currentWidth = width
      this.currentHeight = height
      this.loadHighRes()
      this.enableZoom()
      this.initZoom(false)
    },
    async loadHighRes () {
      await this.$nextTick()
      if (this.loaded) return false
      if (this.currentWidth * window.devicePixelRatio * this.scale <= this.imgLow.width) return false
      const img = new Image()
      img.srcset = this.srcset
      img.sizes = this.sizes
      img.src = this.imgHigh.href
      img.onload = _ => {
        this.loaded = true
      }
    },
    enableZoom () {
      select(this.$el)
        .call(this.zoomManager)
        .on('dblclick.zoom', null)
        .on('click.zoom', null)
    },
    zoom () {
      const { x, y, k } = event.transform
      this.scale = k
      select(this.$refs.image).style('transform', `translate3d(${x}px, ${y}px, 0px) scale3d(${k}, ${k}, 1)`)
    },
    initZoom (transition) {
      this.zoomManager.scaleTo(
        transition ? select(this.$el).transition(t) : select(this.$el),
        this.scaleExtent[0]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
figure {
  margin: 0px;
  height: 100%;
  width: 100%;
  img {
    transform-origin: 0 0;
  }
}
</style>
