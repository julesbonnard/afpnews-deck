<template>
  <transition
    v-if="docExists"
    :name="type.transition"
    mode="out-in"
    appear>
    <component
      v-hammer:swipe="swipe"
      :is="type.component"
      :key="type.transition === 'slide' ? doc.uno : 'fade'"
      :doc="doc"
      :lang="doc.lang"
      :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'"
      class="document">
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
import Document from '@/components/Document'
import Photo from '@/components/Photo'
import Video from '@/components/Video'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'MultiViewer',
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
      'getPreviousDocumentInColById',
      'getNextDocumentInColById'
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
            transition: 'slide',
            component: 'Document'
          }
        case 'news':
          return {
            transition: 'slide',
            component: 'Document'
          }
      }
      return {
        transition: 'slide',
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
    goTo ({ indexCol, docId }) {
      this.$router.push({ name: 'document', params: { indexCol, docId } })
    },
    async nextDocument () {
      const nextDocument = this.getNextDocumentInColById(this.indexCol, this.docId)
      if (nextDocument) {
        this.goTo({ indexCol: this.indexCol, docId: nextDocument })
      } else if (this.indexCol !== null) {
        try {
          await this.refreshColumn({ indexCol: this.indexCol, more: 'after' })
          this.nextDocument()
        } catch (e) {
          this.close()
        }
      } else {
        this.close()
      }
    },
    async previousDocument () {
      const previousDocument = this.getPreviousDocumentInColById(this.indexCol, this.docId)
      if (previousDocument) {
        this.goTo({ indexCol: this.indexCol, docId: previousDocument })
      } else if (this.indexCol !== null) {
        try {
          await this.refreshColumn({ indexCol: this.indexCol, more: 'before' })
          this.previousDocument()
        } catch (e) {
          this.close()
        }
      } else {
        this.close()
      }
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
@import "~@afp/toolkit-styles/scss/variables.scss";
@import "@/assets/scss/variables.scss";

.document {
  position: fixed;
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

.slide-enter-active,
.slide-leave-active {
  transition: transform .3s ease-in-out;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave {
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
