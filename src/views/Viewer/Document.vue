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
        class="date"
      >
        {{$t('document.published')}} {{ $d(new Date(doc.created), 'long') }}
      </time>

      <span v-if="doc.country && doc.city"> • </span>

      <time
        :key="`date-updated-${locale}`"
        class="date"
      >
        {{$t('document.updated')}} {{ $d(new Date(doc.published), 'long') }}
      </time>
    </div>
    <div class="author" v-if="doc.creator">          
      <router-link
            v-for="(creator, i) in doc.creator.split(',')"
            :key="creator"
            :to="`/deck/creator/${creator.trim()}`"
            rel="author"
            class="link">
            <span>{{ creator.trim() }}</span>
            <span v-if="(i + 1) < doc.creator.split(',').length">
              <!-- eslint-disable-next-line no-trailing-spaces -->
              , 
            </span>
      </router-link>
      <span v-if="doc.country && doc.city"> • </span>
      <address v-if="doc.country && doc.city">
        <router-link
          :to="`/deck/place/${doc.country}/${doc.city}`"
          class="link"
        >
          {{ doc.city }} ({{ doc.country }})
        </router-link>
      </address>
    </div>
    <div class="update">
      <span>{{$t('document.version')}} {{doc.revision}}</span>
    </div>
    <media-gallery
      v-if="doc.medias.length > 0"
      :key="doc.uno"
      :medias="doc.medias"
    />
    <div class="cols">
      <aside class="meta">
        <p class="subtitle" v-if='doc.topic'>{{$t('document.topics')}}</p>
        <slugs class='topics' :slugs="doc.topic" type="topic" :lang="doc.lang"/>
        <p class="subtitle" v-if='doc.slugs'>{{$t('document.related')}}</p>
        <slugs :slugs="doc.slugs" type="slug" :lang="doc.lang"/>
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
        
        <article class="message advisory" v-if="doc.advisory">
          <div class="message-header">
            <p>{{$t('document.version')}}{{doc.revision}}</p>
          </div>
          <div class="message-body">
            {{ doc.advisory }}
          </div>
        </article>
      </main>
    </div>
    
    <related-documents :doc="doc" />
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
  .author{
    display: flex;
    
    a{
      text-decoration: underline;
    }
    >span{
      margin: 0 5px;
    }
    @media screen and (max-width: 640px) {
      margin-bottom: 15px;
    } 
  }

  .update{
    position: absolute;
    right: 0;
    margin-right: 30px;
    background: $dark;
    color: $light;
    padding: 5px 15px;
    transform: translateY(-50px);
    font-weight: 600;
    @media screen and (max-width: 640px) {
      margin: 20px 0;
      position: relative !important;
      transform: none;
      display: inline;
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
    margin-top: 50px;
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

  .advisory{
    .message-header{
      max-height: 32px;
      font-size: 16px;
      font-weight: 600;
      background: $dark;
      p{
        margin-bottom: 0;
      }
    }
  }

  .time-address {
    color: $grey-cold-6;
    font-size: 1rem;
    font-weight: 400;
      margin-bottom: 15px;
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
