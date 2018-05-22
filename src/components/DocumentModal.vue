<template>
  <modal
    :lang="currentDocument.lang"
    layout="document"
    transition="slide"
    @close="resetCurrentDocument">
    <div slot="header" />
    <article
      slot="body"
      ref="article"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      <h3>
        {{ currentDocument.headline }}
      </h3>
      <p class="date">{{ published }}</p>
      <media-gallery
        v-if="currentDocument.medias.length > 0"
        :key="currentDocument.uno"
        :current-width="currentWidth"
        :medias="currentDocument.medias"
        class="media-gallery" />
      <p
        v-linkified
        v-for="(p, i) in currentDocument.news"
        :key="i"
        v-html="p"/>
    </article>
    <p slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import MediaGallery from '@/components/MediaGallery'
import VueLinkify from 'vue-linkify'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'DocumentModal',
  components: { Modal, MediaGallery },
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
      return moment(this.currentDocument.published).format('MMMM Do YYYY, h:mm a')
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
      this.currentWidth = this.$refs.article.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  article {
    overflow-y: scroll;
    // overscroll-behavior-y: contain;

    padding: 0 30px;

    h3 {
      font-size: 33px;
      line-height: 35px;
    }

    .media-gallery {
      margin-left: -30px;
      margin-right: -30px;
    }

    p {
      font-size: 18px;
      line-height: 28.44px;
    }
  }
</style>
