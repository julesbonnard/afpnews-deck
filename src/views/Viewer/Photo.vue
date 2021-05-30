<template>
  <article>
    <progressive-image
      v-if="media"
      :display-small="displayDetails"
      :img-low="preview"
      :img-high="highDef"
      :class="{ small: displayDetails }"
      class="figure"
      @toggle-details="displayDetailsActive = !displayDetailsActive"
    />
    <transition name="slide">
      <aside
        v-show="displayDetails"
        class="photo-details"
      >
        <h1 v-if="doc.country && doc.city">
          <router-link
            :to="`/place/${doc.country}/${doc.city}`"
            class="link"
          >
            {{ doc.city }} ({{ doc.country }})
          </router-link>
        </h1>
        <h3 v-if="doc.creator">
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
        </h3>
        <time>
          <span
            :key="`date-created-${locale}`"
            :title="$d(doc.created, 'long')"
          >{{ doc.created | calendar($root.$now, $t('calendar')) }}</span>

          <component
            :is="doc.advisory ? 'router-link' : 'span'"
            v-if="doc.created.toString() !== doc.published.toString()"
            :key="`date-updated-${locale}`"
            :title="$d(doc.published, 'long')"
            :to="{ hash: 'version' }"
          >{{ $t('document.updated') }} {{ doc.published | calendarRelative(doc.created, $root.$now, $t('calendar')) }}</component>
        </time>
        <slugs
          v-if="doc.slugs"
          :slugs="doc.slugs"
          :lang="doc.lang"
          type="slug"
          layout="horizontal"
        />
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
        <web-share
          :title="doc.headline"
          :text="doc.headline"
        />
        <related-documents :doc="doc" />
      </aside>
    </transition>
    <div class="actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<script>
import ProgressiveImage from '@/components/ProgressiveImage'
import RelatedDocuments from '@/components/RelatedDocuments'
import Slugs from '@/components/Slugs'
import WebShare from '@/components/WebShare'
import { mapState } from 'vuex'

export default {
  name: 'Photo',
  components: { ProgressiveImage, RelatedDocuments, Slugs, WebShare },
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
    z-index: 1;
    button {
      background-color: rgba(black, 0.4);
      i {
        color: white;
      }
    }
  }
  aside.photo-details {
    margin-top: 24px;
    h1 {
      font-size: 2rem;
      line-height: 2.2rem;
      @include breakpoint(mobile) {
        font-size: 24px;
        line-height: 24px;
      }
    }

    h3 {
      text-transform: capitalize;
    }

    p {
      font-size: 18px;
      line-height: 28px;
      &.advisory {
        color: $red_warm_3;
      }
    }

    time {
      color: $grey-cold-6;
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 10px;

      a {
        color: $grey-cold-6;
      }

      span + span, span + a {
        &::before {
          display: inline-block;
          content: "•";
          margin: 0px 4px;
        }
      }
    }

    address {
      color: $grey-cold-6;
      font-style: normal;
      margin: 12px 0px 16px;

      a {
        color: $grey-cold-6;
      }

      span + span, span + a {
        &::before {
          display: inline-block;
          content: "•";
          margin: 0px 4px;
        }
      }
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
    aside.photo-details {
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
    }
  }

  .slide-enter,
  .slide-leave-active {
    transform: translateX(100%);
  }
}

@media print {
  aside.photo-details {
    display: block !important;
  }
}

.night-mode {
  article {
    @media screen {
      background-color: $background-color-night;

      aside.photo-details {
        background-color: $font-color;
        h1, h2, h3 {
          color: white;
        }
        address, time, .creator {
          color: $grey-cold-4;
          a {
            color: $grey-cold-4;
          }
        }
        p {
          &.advisory {
            color: $red_warm_3;
          }
          color: white;
        }
      }
    }
  }
}
</style>
