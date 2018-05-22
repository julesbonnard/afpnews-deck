<template>
  <div class="media-gallery">
    <div
      :style="{ paddingTop: `${maxRatio*100}%` }"
      class="placeholder" />
    <transition
      name="fade"
      mode="out-in">
      <figure :key="media.uno">
        <video
          v-if="media.sizes.Video"
          width="100%"
          height="auto"
          controls
          autoplay
          muted>
          <source
            :src="media.sizes.Video.href"
            type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <img
          v-else
          :src="media.sizes.Preview.href"
          :srcset="`${media.sizes.Preview.href} ${media.sizes.Preview.width}w, ${media.sizes.HighDef.href} ${media.sizes.HighDef.width}w`"
          :sizes="currentWidth">
      </figure>
    </transition>
    <div
      v-if="medias.length > 1"
      class="controls">
      <button
        class="previous"
        @click="previous">
        <i class="UI-icon UI-slide-left" />
      </button>
      <ul>
        <li
          v-for="(m, i) in medias"
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
    },
    currentWidth: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      current: 0
    }
  },
  computed: {
    media () {
      return this.medias[this.current]
    },
    maxRatio () {
      const ratios = this.medias.map(media => media.sizes.HighDef.height / media.sizes.HighDef.width)
      return Math.max(...ratios)
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyPress)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyPress)
  },
  methods: {
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
    position: relative;
    figure {
      position: absolute;
      top: 0px;
      left: 0px;
      margin: 0;
      img {
        width: 100%;
        height: auto;
      }
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
