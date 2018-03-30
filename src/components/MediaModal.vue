<template>
  <modal
    v-if="currentDocument && currentDocument.product === 'photo'"
    :lang="currentDocument.lang"
    transition="fade"
    layout="media"
    @close="resetCurrentDocument">
    <h3
      slot="header"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      {{ currentDocument.headline }}
    </h3>
    <div
      slot="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'"
      class="content">
      <div
        :style="{
          'background-image': currentDocument.imageHd ? `url(${currentDocument.imageHd.href})` : null
        }"
        class="media-container">
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
      </div>
      <article>
        <p
          v-for="(p, i) in currentDocument.news"
          :key="i"
          v-html="p"/>
      </article>
    </div>
    <p slot="footer">{{ published }}</p>
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapMutations } from 'vuex'
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
  methods: {
    ...mapMutations([
      'resetCurrentDocument'
    ])
  }
}
</script>

<style lang="scss" scoped>
  h3 {
    font-size: 33px;
    line-height: 35px;
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .media-container {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    flex: 1;
  }
  article {
    padding-left: 30px;
    padding-right: 30px;
    p {
      font-size: 18px;
      line-height: 28.44px;
    }
  }
</style>
