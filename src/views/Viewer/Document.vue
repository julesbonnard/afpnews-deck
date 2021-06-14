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
    <h1 id="title">
      {{ doc.headline }}
    </h1>
    <time>
      <span
        :key="`date-created-${locale}`"
        :title="$d(doc.created, 'long')"
      >{{ $t('document.published') }} {{ doc.created | calendar($root.$now, $t('calendar')) }}</span>

      <component
        :is="doc.advisory ? 'router-link' : 'span'"
        v-if="doc.created.toString() !== doc.published.toString()"
        :key="`date-updated-${locale}`"
        :title="$d(doc.published, 'long')"
        :to="{ hash: 'version' }"
      >{{ $t('document.updated') }} {{ doc.published | calendarRelative(doc.created, $root.$now, $t('calendar')) }}</component>
    </time>

    <address>
      <span>{{ doc.source }}</span>
      <span v-if="doc.creator">
        <router-link
          v-for="creator in doc.creator.split(',')"
          :key="creator"
          :to="`/creator/${creator.trim()}`"
          rel="author"
        >{{ creator.trim() }}</router-link>
      </span>
      <span>
        <router-link
          v-if="doc.country && doc.city"
          :to="`/place/${doc.country}/${doc.city}`"
        >{{ doc.city }} ({{ doc.country }})</router-link>
      </span>
    </address>

    <media-gallery
      v-if="doc.medias.length > 0"
      :key="doc.uno"
      :medias="doc.medias"
    />
    <div class="cols">
      <main>
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
        
        <div
          v-if="doc.advisory"
          id="version"
          class="message advisory"
        >
          <h3 class="message-header">
            <router-link
              :to="{ hash: 'title' }"
            >
              {{ $t('document.updated') }} {{ doc.published | calendarRelative(doc.created, $root.$now, $t('calendar')) }} ({{ $t('document.version') }} {{ doc.revision }})
            </router-link>
          </h3>
          <p class="message-body">
            {{ doc.advisory }}
          </p>
        </div>
      </main>
      <aside class="slugs">
        <slugs
          v-if="doc.topic"
          :title="$t('document.topics')"
          :slugs="doc.topic"
          :lang="doc.lang"
          type="topic"
        />
        <slugs
          v-if="doc.slugs"
          :title="$t('document.related')"
          :slugs="doc.slugs"
          :lang="doc.lang"
          type="slug"
        />
        <web-share
          :title="doc.headline"
          :text="doc.headline"
        />
      </aside>
    </div>
    
    <related-documents
      :doc="doc"
      :size="3"
    />
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
  components: { Slugs, RelatedDocuments, MediaGallery, Highlighter, WebShare },
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

@import "bulma/sass/utilities/initial-variables";
@import "bulma/sass/utilities/functions";
@import "bulma/sass/utilities/derived-variables";
@import "bulma/sass/utilities/mixins";
@import "bulma/sass/utilities/controls";
@import "bulma/sass/utilities/extends";
@import "bulma/sass/components/message";

article.document {
  background-color: white;
  color: $dark;
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
    max-width: 900px;
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

  time {
    color: $grey-cold-6;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 10px;

    a {
      color: $grey-cold-6;
    }

    span + span, span + a {
      &::before {
        display: inline-block;
        content: "•";
        margin: 0px 4px;
      }
    }
  }

  address {
    color: $grey-cold-6;
    font-style: normal;
    margin: 12px 0px 16px;

    a {
      color: $grey-cold-6;
    }

    span + span, span + a {
      &::before {
        display: inline-block;
        content: "•";
        margin: 0px 4px;
      }
    }
  }

  h2 {
    font-weight: 600;
    font-size: 1.8em;
    margin-top: 36px;
    line-height: 1.2em;
  }

  h3 {
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
    margin-left: -30px;
    margin-right: -68px;
    @include breakpoint(mobile) {
      margin-right: -30px;
    }
  }

  p {
    font-size: 18px;
    line-height: 28px;
  }

  .advisory {
    h3.message-header {
      font-size: 16px;
      font-weight: 600;
      line-height: 1rem;
      background: $dark;
      margin-bottom: 0px;
      a {
        text-decoration: none !important;
      }
    }
    p {
      margin: 0px;
    }
  }

  .cols {
    display: flex;
    flex-direction: row-reverse;
    aside.slugs {
      padding-top: 32px;
      position: sticky;
      top: 12px;
      height: 100%;
      width: 25%;

      nav {
        margin-bottom: 2rem;
      }
      
      @media screen and (max-width: 640px) {
        padding-top: 0px;
        position: relative !important;
      }
    }
    main {
      margin-top: 25px;
      width: 75%;
      p{
        margin-bottom: 1rem;
      }
      h2 {
        margin-bottom: 1rem;
      }
    }
    @include breakpoint(mobile) {
      display: block;
      aside.slugs, main {
        width: 100%;
      }
      aside.slugs {
        margin-bottom: 24px;
      }
    }
  }

  .actions {
    position: sticky;
    top: 8px;
    float: right;
    transform: translateX(60px);
    z-index: 1;
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
    aside.slugs {
      display: none;
    }
  }
  &[lang="ar"] {
    aside.related-articles ul {
      padding-left: inherit;
      padding-right: 0px;
    }
    aside.slugs {
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
        a {
          color: $grey-cold-4;
        }
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
      .advisory {
        background-color: transparent;
        p {
          background-color: rgba(black, 0.2);
        }
      }
      .actions button {
        i {
          color: #eee;
        }
      }
    }
  }
}
</style>
