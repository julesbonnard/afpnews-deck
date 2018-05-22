<template>
  <modal
    :lang="currentDocument.lang"
    layout="media video"
    transition="fade"
    @close="resetCurrentDocument">
    <figure
      ref="video"
      slot="header">
      <video
        v-if="videoMedia"
        :key="videoMedia.uno"
        :muted="muted"
        :poster="videoMedia.sizes.HighDef.href"
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
    <section
      slot="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      <article>
        <h1>{{ currentDocument.headline }}</h1>
        <p
          v-for="(p, i) in currentDocument.news"
          :key="i"
          v-html="p"/>
        <p>{{ published }}</p>
      </article>
    </section>
    <div slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'VideoModal',
  components: { Modal },
  data () {
    return {
      muted: false
    }
  },
  computed: {
    ...mapGetters([
      'currentDocument'
    ]),
    published () {
      return moment(this.currentDocument.published).format('MMMM Do YYYY, h:mm:ss a')
    },
    videoMedia () {
      return this.currentDocument.medias.find(media => Object.entries(media.sizes).some(([key, val], i) => val.type === 'Video'))
    },
    video () {
      return Object.entries(this.videoMedia.sizes).find(([key, val]) => val.type === 'Video')[1]
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyPress)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyPress)
  },
  methods: {
    ...mapMutations([
      'resetCurrentDocument'
    ]),
    ...mapActions([
      'previousDocument',
      'nextDocument'
    ]),
    onKeyPress (e) {
      if (e.key === 'ArrowDown') {
        this.previousDocument()
      } else if (e.key === 'ArrowUp') {
        this.nextDocument()
      } else if (e.key === 'Escape') {
        this.resetCurrentDocument()
      }
      e.preventDefault()
    },
    volumeChanged (e) {
      this.muted = e.target.muted
    }
  }
}
</script>

<style lang="scss" scoped>
  figure {
    margin: 0px;
  }

  section {
    article {
      background-color: white;
      padding: 30px;

      h1 {
        font-size: 50px;
        line-height: 60px;
      }

      p {
        font-size: 18px;
        line-height: 28.44px;
      }
    }
  }
</style>
