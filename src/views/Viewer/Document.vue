<template>
  <article
    :class="{
      canceled: doc.status === 'Canceled'
    }"
    class="document"
  >
    <div class="actions">
      <slot name="actions" />
    </div>
    <address v-if="doc.country && doc.city">
      <router-link
        :to="`/place/${doc.country}/${doc.city}`"
        class="link"
      >
        {{ doc.city }} ({{ doc.country }})
      </router-link>
    </address>
    <h1>{{ doc.headline }}</h1>
    <time
      :key="`date-${locale}`"
      class="date"
    >
      {{ $d(new Date(doc.published), 'long') }}
    </time>
    <media-gallery
      v-if="doc.medias.length > 0"
      :key="doc.uno"
      :medias="doc.medias"
    />
    <div class="cols">
      <aside class="meta">
        <h3 v-if="doc.creator">
          <router-link
            v-for="(creator, i) in doc.creator.split(',')"
            :key="creator"
            :to="`/creator/${creator.trim()}`"
            rel="author"
            class="link"
          >
            <span>{{ creator.toLowerCase().trim() }}</span>
            <span v-if="(i + 1) < doc.creator.split(',').length">
              <!-- eslint-disable-next-line no-trailing-spaces -->
              , 
            </span>
          </router-link>
        </h3>
        <web-share
          :title="doc.headline"
          :text="doc.summary ? doc.summary.join('\n') : doc.news[0]"
          :image="doc.medias.length > 0 ? doc.medias[0].sizes[0].href : null"
        />
        <slugs :slugs="doc.slugs" />
      </aside>
      <main>
        <p
          v-if="doc.advisory"
          class="advisory"
        >
          {{ doc.advisory }}
        </p>
        <template v-for="(p, i) in doc.news">
          <h2
            v-if="p.match(/^-\s(.*)\s-$/)"
            :key="i"
          >
            <highlighter
              v-linkified
              :search-words="searchTerms"
              :auto-escape="true"
              :text-to-highlight="p.match(/^-\s(.*)\s-$/) && p.match(/^-\s(.*)\s-$/)[1] || p"
            />
          </h2>
          <p
            v-else
            :key="i"
          >
            <highlighter
              v-linkified
              :search-words="searchTerms"
              :auto-escape="true"
              :text-to-highlight="p"
            />
          </p>
        </template>
        <related-articles :doc="doc" />
      </main>
    </div>
  </article>
</template>

<script>
import MediaGallery from '@/components/MediaGallery'
import Highlighter from 'vue-highlight-words'
import Slugs from '@/components/Slugs'
import RelatedArticles from '@/components/RelatedArticles'
import VueLinkify from 'vue-linkify'
import WebShare from '@/components/WebShare'
import { mapState } from 'vuex'

export default {
  name: 'Document',
  components: { WebShare, Slugs, RelatedArticles, MediaGallery, Highlighter },
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
  @media screen {
    max-width: $max-document-width;
    overflow-y: scroll;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    padding: 0px 68px 0px 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    @include breakpoint(mobile) {
      padding: 0px 30px;
    }
  }

  h1 {
    font-size: 56px;
    line-height: 53px;
    margin: 24px 0px;

    @include breakpoint(mobile) {
      font-size: 26px;
      line-height: 28px;
    }
  }

  h2 {
    font-weight: 600;
    font-size: 1.8em;
    margin-top: 36px;
    line-height: 1.2em;
  }

  h3 {
    text-transform: capitalize;
  }

  &.canceled {
    h1 {
      text-decoration: line-through;
    }
  }

  .media-gallery {
    margin-left: -30px;
    margin-right: -68px;
    @include breakpoint(mobile) {
      margin-right: -30px;
    }
  }

  p {
    font-size: 18px;
    line-height: 28px;

    &.advisory {
      color: $red_warm_3;
    }
  }

  address {
    display: inline-block;
    margin: 24px 0px 0px 0px;
    color: black;
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    cursor: pointer;
  }

  time {
    display: block;
    margin: 24px 0px;
    color: black;
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
  }

  .cols {
    display: flex;
    aside.meta {
      width: 25%;
      margin-top: 25px;
      padding-right: 12px;
    }
    main {
      width: 75%;
    }
    @include breakpoint(mobile) {
      display: block;
      aside.meta, main {
        width: 100%;
      }
    }
  }

  .actions {
    position: sticky;
    top: 8px;
    float: right;
    transform: translateX(60px);
    @include breakpoint(mobile) {
      display: inline-block;
      position: fixed;
      right: 8px;
      transform: translateX(0px);
      float: none;
      display: block;
    }
    button {
      background-color: rgba(black, 0.4);
      i {
        color: white;
      }
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
    .actions {
      display: none;
    }
  }
  &[lang="ar"] {
    /deep/ aside.related-articles ul {
      padding-left: inherit;
      padding-right: 0px;
    }
    aside.meta {
      padding-left: 12px;
      padding-right: 0px;
    }
  }
}
</style>
