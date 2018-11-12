<template>
  <article class="document">
    <router-link
      v-if="doc.country && doc.city"
      :to="`/place/${doc.country}/${doc.city}`"
      tag="h2">
      {{ doc.city }} ({{ doc.country }})
    </router-link>
    <h1>{{ doc.headline }}</h1>
    <h3 v-if="doc.creator">
      <router-link
        v-for="(creator, i) in doc.creator.split(',')"
        :key="creator"
        :to="`/creator/${creator.trim()}`">
        <span>{{ creator.toLowerCase().trim() }}</span>
        <span v-if="(i + 1) < doc.creator.split(',').length">, </span>
      </router-link>
    </h3>
    <slugs :slugs="doc.slugs" />
    <p
      :key="`date-${locale}`"
      class="date">
      {{ $d(new Date(doc.published), 'long') }}
    </p>
    <media-gallery
      v-if="doc.medias.length > 0"
      :key="doc.uno"
      :medias="doc.medias"
      />
    <p
      v-linkified
      v-for="(p, i) in doc.news"
      :key="i"
      v-html="p" />
    <related-articles :doc="doc" />
    <slot name="actions" />
  </article>
</template>

<script>
import MediaGallery from '@/components/MediaGallery'
import Slugs from '@/components/Slugs'
import RelatedArticles from '@/components/RelatedArticles'
import VueLinkify from 'vue-linkify'
import { mapState } from 'vuex'

export default {
  name: 'Document',
  components: { Slugs, RelatedArticles, MediaGallery },
  directives: {
    linkified: VueLinkify
  },
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState([
      'locale'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
article.document {

  .who{
    color: red;
    background-color: yellow;
  }

  background-color: white;
  @media screen {
    max-width: $max-document-width;
    left: $sidebar-size;
    @include breakpoint(mobile) {
      left: 0px;
      height: calc(100% - #{$sidebar-size});
    }
    z-index: 4;
    overflow-y: scroll;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    padding: 0px 30px;
    h2 {
      margin-top: 36px;
    }
  }

  h1 {
    font-size: 56px;
    line-height: 53px;
    margin-top: 24px;

    @include breakpoint(mobile) {
      font-size: 26px;
      line-height: 28px;
    }
  }

  h2, h3 {
    font-size: 1em;
    cursor: pointer;
    a {
      color: black;
    }
  }

  h3 {
    text-transform: capitalize;
  }

  .media-gallery {
    margin-left: -30px;
    margin-right: -30px;
  }

  .caption{
    color : $grey-cold-5;
    line-height: 1.5rem;
  }

  p {
    font-size: 18px;
    line-height: 28.44px;
    &.date {
      font-size: 15px;
      color: $grey-cold-5;
    }
  }

  @include breakpoint(mobile) {
    .actions {
      position: fixed;
    }
  }

  @media print {
    a[href*='//']:after {
      content:" (" attr(href) ") ";
      color: black;
    }
    p {
      page-break-inside: avoid;
    }
  }
}
</style>
