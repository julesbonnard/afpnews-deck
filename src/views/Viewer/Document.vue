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
        :to="`/deck/genre/${doc.genre}`"
      >
        {{ doc.genre }}
      </router-link>
    </div>
    <h1>
      {{ doc.headline }}
    </h1>
    <div class="time-address">
      <time
        :key="`date-created-${locale}`"
        :title="$d(doc.created, 'long')"
        class="date"
      >
        {{ $t('document.published') }} {{ doc.created | calendar($root.$now, $t('calendar')) }}
      </time>

      <span v-if="doc.created.toString() !== doc.published.toString()"> • </span>

      <time
        v-if="doc.created.toString() !== doc.published.toString()"
        :key="`date-updated-${locale}`"
        :title="$d(doc.published, 'long')"
        class="date"
      >
        {{ $t('document.updated') }} {{ doc.published | calendarRelative(doc.created, $root.$now, $t('calendar')) }}
      </time>
    </div>
    <section
      :class="{ arabic: doc.lang == 'ar' }"
      class="meta"
    >
      <div class="dateline-byline">
        <span>{{ doc.source }}</span>
        <span
          v-if="doc.country && doc.city"
          style="user-select: none"
        > • </span>
        <address v-if="doc.country && doc.city">
          <router-link
            :to="`/deck/place/${doc.country}/${doc.city}`"
            class="link"
          >
            {{ doc.city }} ({{ doc.country }})
          </router-link>
        </address>
        <p
          v-if="doc.creator"
          class="creator"
        >
          <span
            v-for="(creator, i) in doc.creator.split(',')"
            :key="creator"
          >
            <router-link
              :to="`/deck/creator/${creator.trim()}`"
              rel="author"
              class="link"
            >
              <span>{{ creator.trim() }}</span>
            </router-link>
            <span v-if="(i + 1) < doc.creator.split(',').length">
              <!-- eslint-disable-next-line no-trailing-spaces -->
              , 
            </span>
          </span>
        </p>
      </div>
      <div
        id="update"
        class="update"
      >
        <router-link
          v-if="doc.advisory"
          :to="{ hash: 'version' }"
        >
          {{ $t('document.version') }} {{ doc.revision }}
        </router-link>
        <span v-else>{{ $t('document.version') }} {{ doc.revision }}</span>
      </div>
    </section>
    <media-gallery
      v-if="doc.medias.length > 0"
      :key="doc.uno"
      :medias="doc.medias"
    />
    <div class="cols">
      <aside class="meta">
        <p
          v-if="doc.topic"
          class="subtitle"
        >
          {{ $t('document.topics') }}
        </p>
        <slugs
          :slugs="doc.topic"
          :lang="doc.lang"
          class="topics"
          type="topic"
        />
        <p
          v-if="doc.slugs"
          class="subtitle"
        >
          {{ $t('document.related') }}
        </p>
        <slugs
          :slugs="doc.slugs"
          :lang="doc.lang"
          type="slug"
        />
      </aside>
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
        
        <aside
          v-if="doc.advisory"
          id="version"
          class="message advisory"
        >
          <h3 class="message-header">
            <router-link
              :to="{ hash: 'update' }"
            >
              {{ $t('document.version') }} {{ doc.revision }}
            </router-link>
          </h3>
          <p class="message-body">
            {{ doc.advisory }}
          </p>
        </aside>
      </main>
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
import { mapState } from 'vuex'

export default {
  name: 'Document',
  components: { Slugs, RelatedDocuments, MediaGallery, Highlighter },
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
  section.meta {
    display: flex;
    align-items: flex-start;

    &.arabic {
      display: flex-reverse;
    }

    .dateline-byline {
      flex: 1;
      margin-right: 15px;
      a {
        text-decoration: underline;
      }
      address {
        display: inline-block;
        font-style: normal;
      }
      > * {
        margin: 4px 5px;
        font-size: 1rem;
      }
      @include breakpoint(mobile) {
        margin-bottom: 15px;
      } 
    }

    .update {
      background: $dark;
      color: $light;
      padding: 8px 16px;
      font-weight: 600;
      a {
        color: white;
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
    // margin-top: 30px;
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
    .message-header {
      font-size: 16px;
      font-weight: 600;
      line-height: 1rem;
      background: $dark;
      margin-bottom: 0px;
      a {
        text-decoration: none;
      }
    }
    p {
      margin-top: 0px;
    }
  }

  .time-address {
    color: $grey-cold-6;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 10px;
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
      margin-bottom: 2rem !important;
    aside.meta {
      position: sticky;
      top: 5%;
      height: 100%;
      width: 25%;
      margin-top: 25px;
      padding-right: 12px;
      .subtitle{
        font-weight: 600;
        color: $dark;
      }
      
      @media screen and (max-width: 640px) {
        position: relative !important;
      } 
    }
    main {
      margin-top: 25px;
      width: 75%;
      p{
        margin-bottom: 1rem;
      }
      h2{
        margin-bottom: 1rem;
      }
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
    aside.meta {
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
</style>
