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
    <main>
      <h1>{{ doc.headline }}</h1>
      <router-link
        v-if="doc.country && doc.city"
        :to="`/place/${doc.country}/${doc.city}`"
        tag="address">
        {{ doc.city }} ({{ doc.country }})
      </router-link>
      <router-link
        v-for="(creator, i) in doc.creator.split(',')"
        :key="creator"
        :to="`/creator/${creator.trim()}`"
        tag="h2">
        <span>{{ creator.toLowerCase().trim() }}</span>
        <span v-if="(i + 1) < doc.creator.split(',').length">, </span>
      </router-link>
      <slugs :slugs="doc.slugs" />
      <time :key="`date-${locale}`">
        {{ $d(new Date(doc.published), 'long') }}
      </time>
      <p
        v-for="(p, i) in doc.news"
        :key="i"
        v-html="p"/>
    </main>
    <slot name="actions" />
  </article>
</template>

<script>
import Slugs from '@/components/Slugs'
import { mapState } from 'vuex'

export default {
  name: 'Video',
  components: { Slugs },
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
article {
  h1 {
    font-size: 50px;
    line-height: 60px;
    @include breakpoint(mobile) {
      font-size: 24px;
      line-height: 24px;
    }
  }
  address {
    margin: 24px 0px;
    color: black;
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    cursor: pointer;
  }
  time {
    display: block;
    margin: 24px 0px;
    color: black;
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
  }
  p {
    font-size: 18px;
    line-height: 28px;
  }
  h2 {
    cursor: pointer;
    text-transform: capitalize;
  }
  h3 {
    text-transform: capitalize;
  }
}
@media screen {
  article {
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

    main {
      max-width: 800px;
      margin: auto;
    }

    .actions {
      position: fixed;
      color: rgba(white, 0.5);
    }
  }
}

@media print {
  figure {
    margin: 0;
  }
}
</style>
