<template>
  <article class="document">
    <h3>{{ doc.headline }}</h3>
    <p class="date">{{ published }}</p>
    <media-gallery
      v-if="doc.medias.length > 0"
      :key="doc.uno"
      :current-width="currentWidth"
      :medias="doc.medias"
      class="media-gallery" />
    <p
      v-linkified
      v-for="(p, i) in doc.news"
      :key="i"
      v-html="p" />
    <slot name="actions" />
  </article>
</template>

<script>
import MediaGallery from '@/components/MediaGallery'
import VueLinkify from 'vue-linkify'
import moment from 'moment'

export default {
  name: 'Document',
  components: { MediaGallery },
  directives: {
    linkified: VueLinkify
  },
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentWidth: 0
    }
  },
  computed: {
    published () {
      return moment(this.doc.published).format('MMMM Do YYYY, h:mm a')
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
    onResize () {
      this.currentWidth = this.$el.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
article.document {
  left: $sidebar-size;
  @include breakpoint(mobile) {
    left: 0px;
  }
  z-index: 4;
  background-color: white;
  max-width: $max-document-width;
  overflow-y: scroll;
  overscroll-behavior-y: contain;
  padding: 0 30px;

  h3 {
    font-size: 33px;
    line-height: 35px;
    @include breakpoint(mobile) {
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

  @include breakpoint(mobile) {
    .actions {
      position: fixed;
    }
  }
}
</style>
