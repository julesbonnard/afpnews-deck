<template>
  <article class="document">
    <figure
      ref="video">
      <video
        v-if="videoMedia"
        :key="videoMedia.uno"
        :muted="muted"
        :poster="(highDef && highDef.href) || null"
        :style="{
          width: `${videoWidth}px`,
          height: `${videoHeight}px`
        }"
        controls
        autoplay
        @volumechange="volumeChanged">
        <source
          :src="video.href"
          type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </figure>
    <h1>{{ doc.headline }}</h1>
    <p
      :key="`date-${locale}`"
      class="date">
      {{ $d(new Date(doc.published), 'long') }}
    </p>
    <p
      v-for="(p, i) in doc.news"
      :key="i"
      v-html="p"/>
    <slot name="actions" />
  </article>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Video',
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      muted: false,
      currentWidth: 300,
      currentHeight: 300
    }
  },
  computed: {
    ...mapState([
      'locale'
    ]),
    videoMedia () {
      return this.doc.medias.find(media => media.sizes.some(size => size.type === 'Video'))
    },
    video () {
      return this.videoMedia.sizes.find(size => size.type === 'Video')
    },
    highDef () {
      return this.videoMedia.sizes.find(size => size.role === 'HighDef')
    },
    ratio () {
      return this.video.width / this.video.height
    },
    videoWidth () {
      return Math.min(this.ratio * this.currentHeight, this.currentWidth)
    },
    videoHeight () {
      return this.videoWidth / this.ratio
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
      this.currentWidth = this.$el.clientWidth
      this.currentHeight = window.innerHeight
    },
    volumeChanged (e) {
      this.muted = e.target.muted
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

article.document {
  background-color: white;
  padding: 30px;
  z-index: 5;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  @include breakpoint(mobile) {
    padding: 15px;
  }
  figure {
    margin-left: -30px;
    margin-right: -30px;
    margin-top: -30px;
    background-color: $primary-color;
    @include breakpoint(mobile) {
      margin-left: -15px;
      margin-right: -15px;
      margin-top: -15px;
    }
  }
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

  .actions {
    position: fixed;
  }
}
</style>
