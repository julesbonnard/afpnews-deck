<template>
  <modal
    :lang="currentDocument.lang"
    transition="fade"
    layout="media"
    @close="resetCurrentDocument">
    <div
      ref="header"
      slot="header"
      class="header">
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
        :style="{
          width: isHorizontal ? '100%' : 'auto',
          height: isHorizontal ? 'auto': '100%',
          'max-height': `${ratio * currentWidth}px`
        }"
        :key="currentDocument.uno">
    </div>
    <article
      slot="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      <!-- <h3>{{ currentDocument.headline }}</h3> -->
      <p
        v-for="(p, i) in currentDocument.news"
        :key="i"
        v-html="p"/>
    </article>
    <p slot="footer">{{ published }}</p>
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'MediaModal',
  components: { Modal },
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
    },
    isHorizontal () {
      return this.currentDocument.imageHd.width >= this.currentDocument.imageHd.height
    },
    ratio () {
      return this.currentDocument.imageHd.width / this.currentDocument.imageHd.height
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
      this.currentWidth = this.$refs.header.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    height: 100%;

    img {
      max-width: 100%;
    }
  }

  article {
    padding-left: 30px;
    padding-right: 30px;
    max-width: 600px;
    margin: auto;

    h3 {
      margin-top: 15px;
      margin-bottom: 15px;
      font-size: 28px;
      line-height: 30px;
    }

    p {
      font-size: 18px;
      line-height: 28.44px;
    }
  }
</style>
