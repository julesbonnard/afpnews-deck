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
      <div
        slot="actions"
        class="actions"
      >
        <button
          aria-label="Close the document"
          class="btn btn-icon"
          @click="close"
        >
          <i class="UI-icon UI-close-alt" />
        </button>
      </div>
    </component>
  </transition>
</template>

<script>
import Document from './Document'
import Photo from './Photo'
import Video from './Video'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { parse as queryParser } from 'lucene-query-parser'

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
  created () {
    this.startTimeout()
  },
  mounted () {
    window.addEventListener('keydown', this.keyPress)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyPress)
    this.clearTimeout()
  },
  beforeRouteUpdate (to, from, next) {
    this.clearTimeout()
    if (to.name === 'document') {
      this.startTimeout()
    }
    next()
  },
  methods: {
    ...mapMutations([
      'setDocumentViewed'
    ]),
    ...mapActions([
      'refreshColumn'
    ]),
    close () {
      this.$router.push('/')
    },
    clearTimeout () {
      this._newDocumentTimeout && clearTimeout(this._newDocumentTimeout)
    },
    startTimeout () {
      this._newDocumentTimeout = setTimeout(_ => {
        this.setDocumentViewed(this.docId)
      }, 3000)
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
        const newDocsFound = await this.refreshColumn({ indexCol: this.indexCol, more: 'after' })
        if (newDocsFound) {
          this.nextDocument()
          return
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
        const newDocsFound = await this.refreshColumn({ indexCol: this.indexCol, more: 'before' })
        if (newDocsFound) {
          this.previousDocument()
          return
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
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    .actions {
      z-index: 1;
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
