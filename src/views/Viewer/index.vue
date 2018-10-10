<template>
  <transition
    v-if="docExists"
    :name="type.transition"
    mode="in-out"
    appear>
    <component
      v-hammer:swipe.horizontal="swipe"
      :is="type.component"
      :key="type.transition === `slide-${direction}` ? doc.uno : 'fade'"
      :doc="doc"
      :lang="doc.lang"
      :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'"
      class="document"
      @zoomed="zoomed => swipeActive = !zoomed">
      <div
        slot="actions"
        class="actions">
        <button
          @click="close">
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

export default {
  name: 'Viewer',
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
      _newDocumentTimeout: null, // eslint-disable-line vue/no-reserved-keys
      swipeActive: true
    }
  },
  computed: {
    ...mapGetters([
      'getDocumentById',
      'getPreviousDocumentIdInColById',
      'getNextDocumentIdInColById'
    ]),
    doc () {
      return this.getDocumentById(this.docId)
    },
    docExists () {
      return !!this.doc
    },
    type () {
      switch (this.doc.product) {
        case 'photo':
          return {
            transition: 'fade',
            component: 'Photo'
          }
        case 'infographie':
          return {
            transition: 'fade',
            component: 'Photo'
          }
        case 'videographie':
          return {
            transition: 'fade',
            component: 'Video'
          }
        case 'sidtv':
          return {
            transition: 'fade',
            component: 'Video'
          }
        case 'parismode':
          return {
            transition: 'fade',
            component: 'Video'
          }
        case 'multimedia':
          return {
            transition: `slide-${this.direction}`,
            component: 'Document'
          }
        case 'news':
          return {
            transition: `slide-${this.direction}`,
            component: 'Document'
          }
      }
      return {
        transition: `slide-${this.direction}`,
        component: 'Document'
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
      if (e.key === 'ArrowDown') {
        this.previousDocument()
      } else if (e.key === 'ArrowUp') {
        this.nextDocument()
      } else if (e.key === 'Escape') {
        this.close()
      }
      e.preventDefault()
    },
    swipe (e) {
      if (!this.swipeActive) return
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

.document {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  .actions {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 101;
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
</style>
