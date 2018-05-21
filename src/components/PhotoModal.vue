<template>
  <modal
    :lang="currentDocument.lang"
    :layout="`media photo ${orientation}`"
    transition="fade"
    @close="resetCurrentDocument">
    <figure
      ref="picture"
      slot="header"
      :class="[{
        small: displayDetails
      }, orientation]"
      :style="{
        width: `${pictureWidth}px`
      }"
      @click="displayDetailsActive = !displayDetailsActive">
      <img
        :src="currentDocument.medias[0].sizes.Preview.href"
        :srcset="`${currentDocument.medias[0].sizes.Preview.href} ${currentDocument.medias[0].sizes.Preview.width}w, ${currentDocument.medias[0].sizes.HighDef.href} ${currentDocument.medias[0].sizes.HighDef.width}w`"
        :sizes="`${pictureWidth}px`"
        :key="currentDocument.uno"
        width="100%">
    </figure>
    <section
      slot="body"
      :dir="currentDocument.lang === 'ar' ? 'rtl' : 'ltr'">
      <transition name="slide">
        <article v-show="displayDetails">
          <h1>{{ currentDocument.slugs.filter(d => d.length > 0).map(d => `#${d}`).join(' ') }}</h1>
          <p
            v-for="(p, i) in currentDocument.news"
            :key="i"
            v-html="p"/>
          <p>{{ published }}</p>
        </article>
      </transition>
    </section>
    <div slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'PhotoModal',
  components: { Modal },
  data () {
    return {
      currentHeight: 300,
      currentWidth: 300,
      displayDetailsActive: false
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
      if (this.ratio >= 1) {
        return 'horizontal'
      }
      return 'vertical'
    },
    ratio () {
      return this.currentDocument.medias[0].sizes.HighDef.width / this.currentDocument.medias[0].sizes.HighDef.height
    },
    pictureWidth () {
      return Math.min(this.ratio * this.currentHeight, this.currentWidth)
    },
    displayDetails () {
      return this.displayDetailsActive
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
      this.currentHeight = this.$el.clientHeight
      this.currentWidth = window.innerWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  figure {
    position: absolute;
    transform: scale(1);
    transform-origin: left;
    transition: transform 0.3s ease-in-out;
    margin: 0px;
    cursor: zoom-out;

    &.small {
      transform: scale3d(0.6, 0.6, 0.6);
      cursor: zoom-in;
    }

    img {
      transition: opacity 0.1s ease-in-out;
    }

    &.vertical {
      img {
        height: 100%;
        width: auto;
      }
    }

    &.horizontal {
      img {
        width: 100%;
        height: auto;
      }
    }
  }

  section {
    position: relative;
    margin-left: auto;
    article {
      overflow-y: auto;
      background-color: white;
      padding: 30px;
      transition: transform .3s ease-in-out;
      max-height: 50vh;

      h1 {
        font-size: 50px;
        line-height: 60px;
      }

      p {
        font-size: 18px;
        line-height: 28.44px;
      }
    }
  }

  .slide-enter,
  .slide-leave-active {
    transform: translate3d(100%, 0, 0);
  }
</style>
