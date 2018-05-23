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
        :src="currentDocument.medias[0].sizes.find(size => size.role === 'Preview').href"
        :srcset="`${currentDocument.medias[0].sizes.find(size => size.role === 'Preview').href} ${currentDocument.medias[0].sizes.find(size => size.role === 'Preview').width}w, ${currentDocument.medias[0].sizes.find(size => size.role === 'HighDef').href} ${currentDocument.medias[0].sizes.find(size => size.role === 'HighDef').width}w`"
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
          <p>{{ published }}</p>
          <p
            v-for="(p, i) in currentDocument.news"
            :key="i"
            v-html="p"/>
        </article>
      </transition>
    </section>
    <div slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapMutations } from 'vuex'
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
      return moment(this.currentDocument.published).format('MMMM Do YYYY, h:mm a')
    },
    orientation () {
      if (this.ratio >= 1) {
        return 'horizontal'
      }
      return 'vertical'
    },
    ratio () {
      return this.currentDocument.medias[0].sizes.find(size => size.role === 'HighDef').width / this.currentDocument.medias[0].sizes.find(size => size.role === 'HighDef').height
    },
    pictureWidth () {
      return Math.min(this.ratio * this.currentHeight, this.currentWidth)
    },
    displayDetails () {
      return this.displayDetailsActive
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapMutations([
      'resetCurrentDocument'
    ]),
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
    top: 50%;
    transform: scale(1) translateY(-50%);
    transform-origin: left top;
    transition: transform 0.3s ease-in-out;
    @media screen and (max-width: 640px) {
      transform-origin: top;
      transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
    }
    margin: 0px;
    cursor: zoom-out;

    &.small {
      transform: scale3d(0.6, 0.6, 0.6) translateY(-50%);
      cursor: zoom-in;
      @media screen and (max-width: 640px) {
        top: 0;
        transform: scale3d(0.6, 0.6, 0.6);
      }
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
      background-color: white;
      padding: 30px;
      overflow-y: auto;
      overscroll-behavior-y: contain;
      touch-action: pan-y;
      @media screen and (max-width: 640px) {
        padding: 15px;
        max-height: none;
        overflow-y: visible;
        overscroll-behavior-y: auto;
      }
      transition: transform .3s ease-in-out;
      max-height: 50vh;

      h1 {
        font-size: 50px;
        line-height: 60px;
        @media screen and (max-width: 640px) {
          font-size: 24px;
          line-height: 24px;
        }
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
