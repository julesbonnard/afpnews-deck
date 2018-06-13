<template>
  <article class="document">
    <figure
      ref="video">
      <video
        v-if="videoMedia"
        :key="videoMedia.uno"
        :muted="muted"
        :poster="(highDef && highDef.href) || null"
        width="100%"
        height="auto"
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
    <p>{{ published }}</p>
    <p
      v-for="(p, i) in doc.news"
      :key="i"
      v-html="p"/>
    <slot name="actions" />
  </article>
</template>

<script>
import moment from 'moment'

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
      muted: false
    }
  },
  computed: {
    published () {
      return moment(this.doc.published).format('MMMM Do YYYY, h:mm a')
    },
    videoMedia () {
      return this.doc.medias.find(media => media.sizes.some(size => size.type === 'Video'))
    },
    video () {
      return this.videoMedia.sizes.find(size => size.type === 'Video')
    },
    highDef () {
      return this.videoMedia.sizes.find(size => size.role === 'HighDef')
    }
  },
  methods: {
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
