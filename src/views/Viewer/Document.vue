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
    <div
      v-if="doc.genre"
      class="genre"
    >
      <router-link
        :to="`/genre/${doc.genre}`"
      >
        {{ doc.genre }}
      </router-link>
    </div>
    <h1>
      {{ doc.headline }}
    </h1>
    <div class="time-address">
      <time
        :key="`date-${locale}`"
        class="date"
      >
        {{ $d(new Date(doc.published), 'long') }}
      </time>
      <span v-if="doc.country && doc.city"> • </span>
      <address v-if="doc.country && doc.city">
        <router-link
          :to="`/place/${doc.country}/${doc.city}`"
          class="link"
        >
          {{ doc.city }} ({{ doc.country }})
        </router-link>
      </address>
    </div>
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
        <web-share
          :title="doc.headline"
          :text="doc.summary ? doc.summary.join('\n') : doc.news[0]"
        />
        <related-documents :doc="doc" />
      </main>
    </div>
  </article>
</template>

<script>
import MediaGallery from '@/components/MediaGallery'
import Highlighter from 'vue-highlight-words'
import Slugs from '@/components/Slugs'
import RelatedDocuments from '@/components/RelatedDocuments'
import VueLinkify from 'vue-linkify'
import WebShare from '@/components/WebShare'
import { mapState } from 'vuex'

export default {
  name: 'Document',
  components: { WebShare, Slugs, RelatedDocuments, MediaGallery, Highlighter },
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
  &::-webkit-scrollbar {
    width: 0.3em;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: darken($background-color, 5);
    border-radius: 4px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: darken($background-color, 15);
  }
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
    margin-top: 0px;
  }

  .genre {
    margin: 24px 0px 18px 0px;
    a {
      display: inline-block;
      text-transform: uppercase;
      font-weight: 600;
      color: white;
      background-color: $font-color;
      padding: 6px 12px;
      border-radius: 2px;
      text-decoration: none;
    }
  }

  &.canceled {
    h1 {
      text-decoration: line-through;
    }
  }

  .media-gallery {
    margin-top: 26px;
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

  .time-address {
    color: $grey-cold-6;
    font-size: 1rem;
    font-weight: 400;
    address {
      display: inline-block;
      font-style: normal;
    }

    time {
      display: inline-block;
      &:first-letter {
        text-transform: capitalize;
      }
    }
  }

  .cols {
    display: flex;
    margin-top: 12px;
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
    aside.related-articles ul {
      padding-left: inherit;
      padding-right: 0px;
    }
    aside.meta {
      padding-left: 12px;
      padding-right: 0px;
    }
  }
}
.night-mode {
  article.document {
    &::-webkit-scrollbar-thumb {
      background-color: darken($background-color-night, 10);
      border-radius: 4px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: darken($background-color-night, 15);
    }
    @media screen {
      background-color: $font-color;
      h1, h2, h3 {
        color: #eee;
      }
      h1 {
        line-height: 56px;
        letter-spacing: -1.2px;
        @include breakpoint(mobile) {
          line-height: 31px;
        }
      }
      address, time {
        color: $grey-cold-4;
      }
      p {
        &.advisory {
          color: $red_warm_3;
        }
        color: white;
      }
      .genre {
        margin-bottom: 12px;
        a {
          display: inline-block;
          text-transform: uppercase;
          font-weight: 600;
          color: $font-color;
          background-color: #eee;
          padding: 6px 12px;
          border-radius: 2px;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
