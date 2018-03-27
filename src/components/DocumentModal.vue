<template>
  <modal
    v-if="currentDocument"
    :lang="currentDocument.lang"
    @close="resetCurrentDocument">
    <h3
      slot="header"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      {{ currentDocument.headline }}
    </h3>
    <article
      slot="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
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
        v-else-if="currentDocument.imageHd"
        :src="currentDocument.imageHd.href">
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
import Vue from 'vue'
import Modal from '@/components/Modal'
import VueLinkify from 'vue-linkify'
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

Vue.directive('linkified', VueLinkify)

export default {
  name: 'DocumentModal',
  components: { Modal },
  computed: {
    ...mapGetters([
      'currentDocument'
    ]),
    published () {
      return moment(this.currentDocument.published).format('MMMM Do YYYY, h:mm:ss a')
    }
  },
  methods: {
    ...mapMutations([
      'resetCurrentDocument'
    ])
  }
}
</script>

<style lang="scss" scoped>
  article {
    img {
      width: 100%;
      height: auto;
    }
  }
</style>
