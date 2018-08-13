<template>
  <div class="media-gallery">
    <transition
      name="fade"
      mode="out-in">
      <figure :key="media.uno">
        <div
          :style="{ paddingTop: `${maxRatio*100}%` }"
          class="placeholder" />
        <video
          v-if="media.sizes.some(size => size.type === 'Video')"
          :poster="media.sizes.find(size => size.role === 'HighDef') ? media.sizes.find(size => size.role === 'HighDef').href : null"
          controls
          autoplay
          muted>
          <source
            :src="media.sizes.find(size => size.type === 'Video').href"
            type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <img
          v-else
          :src="media.sizes.find(size => size.role === 'Preview').href"
          :srcset="`${media.sizes.find(size => size.role === 'Preview').href} ${media.sizes.find(size => size.role === 'Preview').width}w, ${media.sizes.find(size => size.role === 'HighDef').href} ${media.sizes.find(size => size.role === 'HighDef').width}w`"
          :sizes="`${currentWidth}px`">
      </figure>
    </transition>
    <div
      v-if="mediasRatios.length > 1"
      class="controls">
      <button
        class="previous"
        @click="previous">
        <i class="UI-icon UI-slide-left" />
      </button>
      <ul>
        <li
          v-for="(m, i) in mediasRatios"
          :key="m.uno"
          :class="{ active: i === current }"
          @click="goTo(i)" />
      </ul>
      <button
        class="next"
        @click="next">
        <i class="UI-icon UI-slide-right" />
      </button>
    </div>
    <p v-if="media.caption">{{ media.caption }}</p>
  </div>
</template>

<script>
export default {
  name: 'MediaGallery',
  props: {
    medias: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      current: 0,
      currentWidth: 300
    }
  },
  computed: {
    media () {
      return this.mediasRatios[this.current]
    },
    mediasRatios () {
      return this.medias.map(media => {
        try {
          const size = media.sizes.find(size => ['Preview', 'HighDef'].includes(size.role) || size.type === 'Video')
          return { ratio: size.height / size.width, ...media }
        } catch (e) {
          console.error('Unable to calculate media ratio', media)
          return { ratio: 0, ...media }
        }
      })
        .sort((a, b) => b.ratio - a.ratio)
    },
    maxRatio () {
      return Math.max(...this.mediasRatios.map(media => media.ratio))
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyPress)
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyPress)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize () {
      this.currentWidth = this.$el.clientWidth
    },
    previous () {
      this.current = this.current - 1 < 0 ? this.medias.length - 1 : this.current - 1
    },
    next () {
      this.current = this.current + 1 > this.medias.length - 1 ? 0 : this.current + 1
    },
    goTo (i) {
      this.current = i
    },
    onKeyPress (e) {
      if (e.key === 'ArrowRight') {
        this.next()
      } else if (e.key === 'ArrowLeft') {
        this.previous()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.media-gallery {
  figure {
    position: relative;
    & > *:not(.placeholder) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0px;
      width: 100%;
    }
    margin: 0;
  }
  .controls {
    display: flex;
    justify-content: center;
    button {
      background: transparent;
      color: black;
      &.previous {
        margin-right: auto;
      }
      &.next {
        margin-left: auto;
      }
    }
    ul {
      display: flex;
      justify-content: center;
      list-style-type: none;
      li {
        width: 10px;
        height: 10px;
        margin: 0 3px;
        border-radius: 50%;
        background-color: grey;
        cursor: pointer;
        &.active {
          transform: scale(1.2);
          cursor: default;
        }
      }
    }
  }
  p {
    margin-top: 10px;
    padding: 0 30px;
  }
}
</style>
