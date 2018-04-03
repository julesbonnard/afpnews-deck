<template>
  <modal
    :lang="currentDocument.lang"
    layout="document"
    transition="slide"
    @close="resetCurrentDocument">
    <h3
      slot="header"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      {{ currentDocument.headline }}
    </h3>
    <article
      slot="body"
      ref="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      <div class="media-container">
        <video
          v-if="currentDocument.video"
          :key="currentDocument.uno"
          width="100%"
          height="auto"
          controls
          autoplay
          muted>
          <source
            :src="currentDocument.video.href"
            type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <img
          v-else-if="currentDocument.imageHd && currentDocument.imageSd"
          :src="currentDocument.imageSd.href"
          :srcset="`${currentDocument.imageSd.href} ${currentDocument.imageSd.width}w, ${currentDocument.imageHd.href} ${currentDocument.imageHd.width}w`"
          :sizes="currentWidth"
          :key="currentDocument.uno">
      </div>
      <p
        v-linkified
        v-for="(p, i) in currentDocument.news"
        :key="i"
        v-html="p"/>
    </article>
    <p slot="footer">{{ published }}</p>
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import VueLinkify from 'vue-linkify'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'DocumentModal',
  components: { Modal },
  directives: {
    linkified: VueLinkify
  },
  data () {
    return {
      currentWidth: 0
    }
  },
  computed: {
    ...mapGetters([
      'currentDocument'
    ]),
    published () {
      return moment(this.currentDocument.published).format('MMMM Do YYYY, h:mm:ss a')
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
    onResize () {
      this.currentWidth = this.$refs.body.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  h3 {
    font-size: 33px;
    line-height: 35px;
  }
  article {
    overflow-y: auto;
    overscroll-behavior-y: contain;

    padding-left: 30px;
    padding-right: 30px;

    .media-container {
      margin-left: -30px;
      margin-right: -30px;
      img {
        width: 100%;
        height: auto;
      }
    }
    p {
      font-size: 18px;
      line-height: 28.44px;
    }
  }
</style>
