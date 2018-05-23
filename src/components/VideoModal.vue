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
        :poster="videoMedia.sizes.find(size => size.role === 'HighDef') ? videoMedia.sizes.find(size => size.role === 'HighDef').href : null"
        width="100%"
        height="auto"
        controls
        autoplay
        @volumechange="volumeChanged">
        <source
          :src="videoMedia.sizes.find(size => size.type === 'Video').href"
          type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </figure>
    <section
      slot="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      <article>
        <h1>{{ currentDocument.headline }}</h1>
        <p>{{ published }}</p>
        <p
          v-for="(p, i) in currentDocument.news"
          :key="i"
          v-html="p"/>
      </article>
    </section>
    <div slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapMutations } from 'vuex'
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
      return moment(this.currentDocument.published).format('MMMM Do YYYY, h:mm a')
    },
    videoMedia () {
      return this.currentDocument.medias.find(media => media.sizes.some(size => size.type === 'Video'))
    }
  },
  methods: {
    ...mapMutations([
      'resetCurrentDocument'
    ]),
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
      @media screen and (max-width: 640px) {
        padding: 15px;
      }

      h1 {
        font-size: 50px;
        line-height: 60px;
        @media screen and (max-width: 640px) {
          font-size: 24px;
          line-height: 24px;
        }
      }

      p {
        font-size: 18px;
        line-height: 28.44px;
      }
    }
  }
</style>
