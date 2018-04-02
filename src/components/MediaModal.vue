<template>
  <modal
    :lang="currentDocument.lang"
    transition="fade"
    layout="media"
    @close="resetCurrentDocument">
    <div slot="header">
      <video
        v-if="currentDocument.video"
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
        v-if="currentDocument.imageHd"
        :src="currentDocument.imageHd.href">
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
    }
  }
}
</script>

<style lang="scss" scoped>
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 65vh;
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
