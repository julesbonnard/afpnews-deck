<template>
  <section
    v-hammer:swipe="swipe">
    <photo-modal
      v-if="doc && ['photo', 'infographie'].includes(doc.product)"
      :doc="doc"
      @close="close" />
    <video-modal
      v-else-if="doc && ['videographie', 'sidtv', 'parismode'].includes(doc.product)"
      :doc="doc"
      @close="close" />
    <document-modal
      v-else-if="doc"
      :doc="doc"
      @close="close" />
  </section>
</template>

<script>
import DocumentModal from '@/components/DocumentModal'
import PhotoModal from '@/components/PhotoModal'
import VideoModal from '@/components/VideoModal'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MultiViewer',
  components: {
    DocumentModal,
    PhotoModal,
    VideoModal
  },
  props: {
    docId: {
      type: String,
      required: true
    },
    columnIndex: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'getDocumentById'
    ]),
    doc () {
      return this.getDocumentById(this.docId)
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyPress)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyPress)
  },
  methods: {
    close () {
      this.$router.push('/')
    },
    ...mapActions([
      'previousDocument',
      'nextDocument'
    ]),
    keyPress (e) {
      if (e.key === 'ArrowDown') {
        this.previousDocument()
      } else if (e.key === 'ArrowUp') {
        this.nextDocument()
      } else if (e.key === 'Escape') {
        this.close()
      }
      e.preventDefault()
    },
    swipe (e) {
      if (e.direction === 2) {
        this.previousDocument()
      } else if (e.direction === 4) {
        this.nextDocument()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@afp/toolkit-styles/scss/variables.scss";

section {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 4;
}
</style>
