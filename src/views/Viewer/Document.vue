<template>
  <article class="document">
    <router-link
      v-if="doc.country && doc.city"
      :to="`/place/${doc.country}/${doc.city}`"
      tag="h2">
      {{ doc.city }} ({{ doc.country }})
    </router-link>
    <h1>{{ doc.headline }}</h1>
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
    <div class="cols">
      <aside class="right">
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
      </aside>
      <main>
        <template v-for="(p, i) in doc.news">
          <h2
            v-if="p.match(/^-\s.*\s-$/)"
            :key="i">
            <highlighter
              v-linkified
              :search-words="searchTerms"
              :auto-escape="true"
              :text-to-highlight="p" />
          </h2>
          <p
            v-else
            :key="i">
            <highlighter
              v-linkified
              :search-words="searchTerms"
              :auto-escape="true"
              :text-to-highlight="p" />
          </p>
        </template>
        <related-articles :doc="doc" />
      </main>
    </div>
    <slot name="actions" />
  </article>
</template>

<script>
import MediaGallery from '@/components/MediaGallery'
import Highlighter from 'vue-highlight-words'
import Slugs from '@/components/Slugs'
import RelatedArticles from '@/components/RelatedArticles'
import VueLinkify from 'vue-linkify'
import { mapState } from 'vuex'

export default {
  name: 'Document',
  components: { Slugs, RelatedArticles, MediaGallery, Highlighter },
  directives: {
    linkified: VueLinkify
  },
  props: {
    doc: {
      type: Object,
      required: true
    },
    searchTerms: {
      type: Array,
      required: false,
      default: () => ([])
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

  background-color: white;
  box-shadow: 0 0 25px rgba(black,0.2);
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
    padding: 0px 68px 0px 30px;
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

  h2 {
    font-weight: 600;
    font-size: 2em;

  }

  h2, h3 {
    //font-size: 1em;
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
    margin-right: -68px;
  }

  .caption{
    color : $grey-cold-5;
    line-height: 1.5rem;
  }

  p {
    font-size: 18px;
    line-height: 28px;
    margin-top: 0;

    &.date {
      font-size: 15px;
      color: $grey-cold-5;
      text-transform: capitalize;
    }
  }

  .cols {
    display: flex;
    margin-top:36px;
    aside.right {
      width: 25%;
      //margin-left: -34px;
    }
    main {
      width:75%;
      //margin-left: 34px;
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
