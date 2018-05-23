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
import { mapGetters, mapMutations } from 'vuex'
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
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapMutations([
      'resetCurrentDocument'
    ]),
    onResize () {
      this.currentWidth = this.$refs.article.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  article {
    // overflow-y: scroll;
    // overscroll-behavior-y: contain;

    padding: 0 30px;

    h3 {
      font-size: 33px;
      line-height: 35px;
      @media screen and (max-width: 640px) {
        font-size: 26px;
        line-height: 28px;
      }
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
