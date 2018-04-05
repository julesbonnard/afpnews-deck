<template>
  <modal
    :lang="currentDocument.lang"
    :layout="`media photo ${orientation}`"
    transition="fade"
    @close="resetCurrentDocument">
    <div slot="actions">
      <button
        @click="displayDetails = !displayDetails">
        <i class="UI-icon UI-info" />
      </button>
      <button
        @click="resetCurrentDocument">
        <i class="UI-icon UI-close-alt" />
      </button>
    </div>
    <figure
      ref="picture"
      slot="header"
      :style="{
        width: `${pictureWidth}px`
      }"
    >
      <img
        :src="currentDocument.imageSd.href"
        :srcset="`${currentDocument.imageSd.href} ${currentDocument.imageSd.width}w, ${currentDocument.imageHd.href} ${currentDocument.imageHd.width}w`"
        :sizes="`${pictureWidth}px`"
        :key="currentDocument.uno"
        :class="orientation">
    </figure>
    <article
      slot="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      <transition name="slide">
        <div
          v-show="displayDetails"
          class="details">
          <h1>{{ currentDocument.slugs.filter(d => d.length > 0).map(d => `#${d}`).join(' ') }}</h1>
          <p
            v-for="(p, i) in currentDocument.news"
            :key="i"
            v-html="p"/>
          <p>{{ published }}</p>
        </div>
      </transition>
    </article>
    <div slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'MediaModal',
  components: { Modal },
  data () {
    return {
      currentHeight: 300,
      currentWidth: 300,
      displayDetails: true
    }
  },
  computed: {
    ...mapGetters([
      'currentDocument'
    ]),
    published () {
      return moment(this.currentDocument.published).format('MMMM Do YYYY, h:mm:ss a')
    },
    orientation () {
      if (this.currentDocument.imageHd.width >= this.currentDocument.imageHd.height) {
        return 'horizontal'
      }
      return 'vertical'
    },
    ratio () {
      return this.currentDocument.imageHd.width / this.currentDocument.imageHd.height
    },
    pictureWidth () {
      return Math.min(this.ratio * this.currentHeight, this.currentWidth)
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyPress)
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyPress)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapMutations([
      'resetCurrentDocument'
    ]),
    ...mapActions([
      'previousDocument',
      'nextDocument'
    ]),
    onKeyPress (e) {
      if (e.key === 'ArrowDown') {
        this.previousDocument()
      } else if (e.key === 'ArrowUp') {
        this.nextDocument()
      } else if (e.key === 'Escape') {
        this.resetCurrentDocument()
      }
      e.preventDefault()
    },
    onResize () {
      this.currentHeight = this.$refs.picture.clientHeight
      this.currentWidth = window.innerWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  figure {
    margin: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    img {
      &.vertical {
        height: 100%;
        width: auto;
      }
      &.horizontal {
        width: 100%;
        height: auto;
      }
    }
  }

  article {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100px;

    .details {
      background-color: #231f20;
      padding-left: 30px;
      padding-right: 30px;
      max-width: 600px;
      min-width: 600px;
      margin-left: auto;
      transition: transform .3s ease;

      h1 {
        font-size: 60px;
        line-height: 60px;
      }

      p {
        font-size: 18px;
        line-height: 28.44px;
      }
    }
  }

  button {
    color: white;
    background-color: transparent;
    border: 1px solid transparent;

    &:hover {
      background-color: transparent;
      border: 1px solid white;
    }
  }

  .slide-enter,
  .slide-leave-active {
    transform: translateX(1000px);
  }
</style>
