<template>
  <article>
    <progressive-image
      v-if="media"
      :display-small="displayDetails"
      :img-low="preview"
      :img-high="highDef"
      :class="{ small: displayDetails }"
      class="figure"
      @toggleDetails="displayDetailsActive = !displayDetailsActive"
    />
    <transition name="slide">
      <aside
        v-show="displayDetails"
      >
        <h1 v-if="doc.country && doc.city">
          <router-link
            :to="`/place/${doc.country}/${doc.city}`"
            class="link"
          >
            {{ doc.city }} ({{ doc.country }})
          </router-link>
        </h1>
        <h2 v-if="doc.creator">
          <router-link
            v-for="(creator, i) in doc.creator.split(',')"
            :key="creator"
            :to="`/creator/${creator.trim()}`"
            class="link"
          >
            <span>{{ creator.toLowerCase().trim() }}</span>
            <span v-if="(i + 1) < doc.creator.split(',').length">
              <!-- eslint-disable-next-line no-trailing-spaces -->
              , 
            </span>
          </router-link>
        </h2>
        <web-share
          :title="doc.headline"
          :text="doc.headline"
        />
        <slugs
          :slugs="doc.slugs"
          layout="horizontal"
        />
        <time :key="`date-${locale}`">
          {{ $d(new Date(doc.published), 'long') }}
        </time>
        <p
          v-if="doc.advisory"
          class="advisory"
        >
          {{ doc.advisory }}
        </p>
        <div v-if="doc.product !== 'infographie'">
          <!-- eslint-disable vue/no-v-html -->
          <p
            v-for="(p, i) in doc.news"
            :key="i"
            v-html="p"
          />
        </div>
      </aside>
    </transition>
    <div class="actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<script>
import ProgressiveImage from '@/components/ProgressiveImage'
import Slugs from '@/components/Slugs'
import WebShare from '@/components/WebShare'
import { mapState } from 'vuex'

export default {
  name: 'Photo',
  components: { ProgressiveImage, Slugs, WebShare },
  props: {
    doc: {
      type: Object,
      required: true,
      validator (value) {
        const hasMedia = Array.isArray(value.medias) && value.medias.length > 0
        return hasMedia
      }
    }
  },
  data () {
    return {
      displayDetailsActive: false
    }
  },
  computed: {
    ...mapState([
      'locale'
    ]),
    media () {
      return this.doc.medias[0]
    },
    preview () {
      return this.media.sizes.find(size => size.role === 'Preview')
    },
    highDef () {
      return this.media.sizes.find(size => size.role === 'HighDef')
    },
    displayDetails () {
      return this.displayDetailsActive
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
article.document {
  .actions {
    position: absolute;
    top: 8px;
    right: 8px;
    button {
      background-color: rgba(black, 0.4);
      i {
        color: white;
      }
    }
  }
  aside {
    margin-top: 24px;
    h1 {
      font-size: 2rem;
      line-height: 2.2rem;
      @include breakpoint(mobile) {
        font-size: 24px;
        line-height: 24px;
      }
    }

    h2 {
      font-size: 1.3rem;
      line-height: 1.4rem;
      text-transform: capitalize;
      @include breakpoint(mobile) {
        font-size: 16px;
        line-height: 16px;
      }
    }

    p {
      font-size: 18px;
      line-height: 28px;
      &.advisory {
        color: $red_warm_3;
      }
    }

    time {
      display: block;
      margin: 24px 0px;
      color: black;
      font-style: normal;
      font-weight: 400;
      font-size: 1rem;
    }
  }
}
@media screen {
  article {
    background-color: $primary-color;
    overflow: hidden;
    .figure {
      cursor: zoom-out;
      height: 100%;
      width: 100%;
      &.small {
        cursor: zoom-in;
        height: 50%;
      }
    }
    aside {
      position: absolute;
      bottom: 0px;
      right: 0px;
      padding: 30px;
      overflow-y: auto;
      overscroll-behavior-y: contain;
      background-color: white;
      padding: 30px;
      @include breakpoint(mobile) {
        padding: 15px;
      }
      transition: transform .3s ease-in-out;
      max-height: 70%;
      max-width: $max-document-width;

      h1, h2 {
        cursor: pointer;
      }
    }
  }

  .slide-enter,
  .slide-leave-active {
    transform: translateX(100%);
  }
}

@media print {
  aside {
    display: block !important;
  }
}

.night-mode {
  article {
    @media screen {
      background-color: $background-color-night;

      aside {
        background-color: $font-color;
        h1, h2, h3 {
          color: white;
        }
        address, time {
          color: $grey-cold-4;
        }
        p {
          color: white;
        }
      }
    }
  }
}
</style>
