<template>
  <modal
    :lang="doc.lang"
    :layout="`media photo ${orientation}`"
    transition="fade"
    @close="$emit('close')">
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
        :src="doc.medias[0].sizes.find(size => size.role === 'Preview').href"
        :srcset="`${doc.medias[0].sizes.find(size => size.role === 'Preview').href} ${doc.medias[0].sizes.find(size => size.role === 'Preview').width}w, ${doc.medias[0].sizes.find(size => size.role === 'HighDef').href} ${doc.medias[0].sizes.find(size => size.role === 'HighDef').width}w`"
        :sizes="`${pictureWidth}px`"
        :key="doc.uno"
        width="100%">
    </figure>
    <section
      slot="body"
      :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'">
      <transition name="slide">
        <article v-show="displayDetails">
          <h1>{{ doc.slugs.filter(d => d.length > 0).map(d => `#${d}`).join(' ') }}</h1>
          <p>{{ published }}</p>
          <p
            v-for="(p, i) in doc.news"
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
import moment from 'moment'

export default {
  name: 'PhotoModal',
  components: { Modal },
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentHeight: 300,
      currentWidth: 300,
      displayDetailsActive: false
    }
  },
  computed: {
    published () {
      return moment(this.doc.published).format('MMMM Do YYYY, h:mm a')
    },
    orientation () {
      if (this.ratio >= 1) {
        return 'horizontal'
      }
      return 'vertical'
    },
    ratio () {
      return this.doc.medias[0].sizes.find(size => size.role === 'HighDef').width / this.doc.medias[0].sizes.find(size => size.role === 'HighDef').height
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
    @media screen and (max-width: 640px) {
      transform-origin: top;
      top: 50%;
      transform: scale(1) translateY(-50%);
      transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
    }
    margin: 0px;
    cursor: zoom-out;

    &.small {
      transform: scale3d(0.6, 0.6, 0.6);
      cursor: zoom-in;
      @media screen and (max-width: 640px) {
        top: 0;
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
      overflow-y: auto;
      background-color: white;
      padding: 30px;
      @media screen and (max-width: 640px) {
        padding: 15px;
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
