<template>
  <div class="media-gallery">
    <transition
      name="fade"
      mode="out-in"
    >
      <figure :key="media.uno">
        <div
          :style="{ paddingTop: `${media.ratio*100}%` }"
          class="placeholder"
        />
        <video
          v-if="media.sizes.some(size => size.type === 'Video')"
          :poster="media.sizes.find(size => size.role === 'HighDef') ? media.sizes.find(size => size.role === 'HighDef').href : null"
          controls
          autoplay
          muted
        >
          <source
            :src="media.sizes.find(size => size.type === 'Video').href"
            type="video/mp4"
          >
          Your browser does not support the video tag.
        </video>
        <img
          v-else
          :src="selectPreview(media.sizes).href"
          :srcset="`${selectPreview(media.sizes).href} ${selectPreview(media.sizes).width}w, ${media.sizes.find(size => size.role === 'HighDef').href} ${media.sizes.find(size => size.role === 'HighDef').width}w`"
          :sizes="`${currentWidth}px`"
        >
      </figure>
    </transition>
    <p class='description' v-if="media.caption">
      {{ media.caption }}
    </p>
    <nav v-if="mediasRatios.length > 1">
      <ul>
        <li
          v-for="(m, i) in mediasRatios"
          :key="m.uno"
          :class="{ active: i === current }"
          @click="goTo(i)"
        >
          <img :src="m.sizes.find(size => size.role === 'Squared120').href">
        </li>
      </ul>
    </nav>
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
      return this.medias
        .filter(media => {
          return media.sizes.some(size => size.role === 'Preview' || size.role === 'HighDef')
        })
        .map(media => {
          try {
            const size = media.sizes
              .find(mediaSize => ['Preview', 'HighDef']
              .includes(mediaSize.role) || mediaSize.type === 'Video')
            return { ratio: size.height / size.width, ...media }
          } catch (e) {
            // tslint:disable-next-line no-console
            console.error('Unable to calculate media ratio', media)
            return { ratio: 0, ...media }
          }
        })
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
    },
    selectPreview (sizes) {
      return sizes.find(size => size.role === 'Preview') || sizes.find(size => size.role === 'HighDef')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
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
  nav {
    display: flex;
    justify-content: center;
    @media print {
      display: none;
    }
    ul {
      padding: 0;
      max-width: 80%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      list-style-type: none;
      li {
        margin: 0 3px;
        cursor: pointer;
        &.active {
          border-bottom: 4px solid $secondary-color;
          cursor: default;
        }
        img {
          width: 48px;
        }
      }
    }
  }
  p {
    padding: 20px 80px;
    background: #ECEBE9;
    margin-bottom: 10px;
    color: $dark;
    font-size: 14px;
  }
}
</style>
