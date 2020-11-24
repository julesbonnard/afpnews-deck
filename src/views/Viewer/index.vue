<template>
  <transition
    v-if="docExists"
    :name="type.transition"
    mode="in-out"
    appear
  >
    <component
      :is="type.component"
      :key="type.transition === `slide-${direction}` ? doc.uno : 'fade'"
      v-hammer:swipe.horizontal="swipe"
      :doc="doc"
      :lang="doc.lang"
      :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'"
      :search-terms="columnSearchTerms"
      class="document"
    >
      <template v-slot:actions>
        <button
          aria-label="Close the document"
          class="btn btn-icon"
          @click="close"
        >
          <i class="UI-icon UI-close-alt" />
        </button>
      </template>
    </component>
  </transition>
</template>

<script>
import Document from './Document'
import Photo from './Photo'
import Video from './Video'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { parse as queryParser } from 'lucene'

function recursiveSearchTerms (cur) {
  if (cur.term) return [cur.term]
  if (cur.left && cur.right) return [...recursiveSearchTerms(cur.left), ...recursiveSearchTerms(cur.right)]
  if (cur.left) return [...recursiveSearchTerms(cur.left)]
  if (cur.right) return [...recursiveSearchTerms(cur.right)]
  return []
}

export default {
  name: 'Viewer',
  metaInfo () {
    if (!this.doc) return
    return {
      title: this.doc.headline,
      meta: [
        {
          property: 'og:title',
          template: chunk => `${chunk} - AFP Deck`,
          content: this.doc.headline
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          property: 'og:url',
          content: window.location.href
        }
      ]
    }
  },
  components: {
    Document,
    Photo,
    Video
  },
  props: {
    docId: {
      type: String,
      required: true
    },
    indexCol: {
      type: Number,
      default: null
    },
    direction: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      _newDocumentTimeout: null // eslint-disable-line vue/no-reserved-keys
    }
  },
  computed: {
    ...mapGetters([
      'getDocumentById',
      'getPreviousDocumentIdInColById',
      'getNextDocumentIdInColById',
      'getColumnByIndex'
    ]),
    doc () {
      return this.getDocumentById(this.docId)
    },
    column () {
      return this.getColumnByIndex(this.indexCol)
    },
    columnSearchTerms () {
      if (this.indexCol === null) {
        return []
      }
      return [...recursiveSearchTerms(queryParser(this.column.params.query))]
    },
    docExists () {
      return !!this.doc
    },
    type () {
      switch (this.doc.product) {
        case 'photo':
          // falls through
        case 'infographie':
          return {
            transition: 'fade',
            component: 'Photo'
          }
        case 'videographie':
          // falls through
        case 'sidtv':
          // falls through
        case 'parismode':
          // falls through
        case 'afptvweb':
          // falls through
        case 'afptv1st':
          return {
            transition: 'fade',
            component: 'Video'
          }
        case 'multimedia':
          // falls through
        case 'news':
          // falls through
        default:
          return {
            transition: `slide-${this.direction}`,
            component: 'Document'
          }
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyPress)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyPress)
  },
  methods: {
    ...mapActions([
      'refreshColumn'
    ]),
    close () {
      this.$router.push('/deck')
    },
    goTo ({ indexCol, docId, direction }) {
      this.$router.push({ name: 'document', params: { indexCol, docId, direction } })
    },
    async nextDocument () {
      const nextDocument = this.getNextDocumentIdInColById(this.indexCol, this.docId)
      if (nextDocument) {
        this.goTo({ indexCol: this.indexCol, docId: nextDocument, direction: 'left' })
        return
      } else if (this.indexCol !== null) {
        try {
          const newDocsFound = await this.refreshColumn({ indexCol: this.indexCol, mode: 'after' })
          if (newDocsFound) {
            this.nextDocument()
            return
          }
        } catch (error) {
          this.$toasted.global.apiError(error)
        }
      }
      this.close()
    },
    async previousDocument () {
      const previousDocument = this.getPreviousDocumentIdInColById(this.indexCol, this.docId)
      if (previousDocument) {
        this.goTo({ indexCol: this.indexCol, docId: previousDocument, direction: 'right' })
        return
      } else if (this.indexCol !== null) {
        try {
          const newDocsFound = await this.refreshColumn({ indexCol: this.indexCol, mode: 'before' })
          if (newDocsFound) {
            this.previousDocument()
            return
          }
        } catch (error) {
          this.$toasted.global.apiError(error)
        }
      }
      this.close()
    },
    keyPress (e) {
      switch (e.key) {
        case 'ArrowDown':
          this.previousDocument()
          e.preventDefault()
          break
        case 'ArrowUp':
          this.nextDocument()
          e.preventDefault()
          break
        case 'Escape':
          this.close()
          e.preventDefault()
      }
    },
    swipe (e) {
      if (e.pointerType === 'mouse') return false
      if (['infographie', 'photo'].includes(this.doc.product)) return false
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
@import "@/assets/scss/variables.scss";

@media screen {
  article.document {
    z-index: 999;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    .actions {
      z-index: 1;

      button{
        background: none;
        i{
          color: $dark;
        }
      }
    }
  }

  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: transform .3s ease-in-out;
  }

  .slide-left-enter,
  .slide-right-enter {
    transform: translateX(-100%);
  }
  @media (max-width: $max-document-width) {
    .slide-right-enter {
      transform: translateX(100%);
    }
  }

  .slide-left-leave-to,
  .slide-right-leave-to {
    transform: translateX(-100%);
  }
  @media (max-width: $max-document-width) {
    .slide-right-leave-to {
      transform: translateX(-100%);
    }
  }

  .slide-left-enter-to,
  .slide-left-leave,
  .slide-right-enter-to,
  .slide-right-leave {
    transform: translateX(0%);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s ease-in-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-to,
  .fade-leave {
    opacity: 1;
  }
}

@media print {
  .document {
    margin: auto;
    .actions {
      display: none;
    }
  }
}
</style>
