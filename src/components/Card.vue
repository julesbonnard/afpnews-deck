<template>
  <router-link
    v-if="doc"
    :class="{
      flash: doc.urgency === 1,
      alerte: doc.product !== 'photo' && doc.urgency === 2,
      urgent: doc.product !== 'photo' && doc.urgency === 3,
      photo: doc.product === 'photo',
      canceled: doc.status === 'Canceled'
    }"
    :lang="doc.lang"
    :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'"
    :to="{ name: 'document', params: { indexCol, docId } }"
    class="article"
  >
    <div
      v-if="doc.medias.length > 0 && doc.medias[0].sizes.some(size => size.role === 'Preview')"
      :style="{
        backgroundImage: `url(${doc.medias[0].sizes.find(size => size.role === 'Preview').href})`,
        backgroundPosition: doc.medias[0].faceYOffsetPercent ? `0px ${doc.medias[0].faceYOffsetPercent * 100}%`: null
      }"
      class="img-container"
    >
      <i
        v-if="['sidtv', 'parismode', 'afptvweb', 'afptv1st', 'videographie'].includes(doc.product)"
        class="UI-icon UI-play-video"
      />
    </div>
    <div class="cols">
      <p
        v-if="doc.embargoed && doc.embargoed > new Date()"
        :key="`date-${locale}`"
        class="date embargo"
      >
        Embargo : {{ doc.embargoed | fromNow($root.$now) }}
      </p>
      <p
        v-else
        :key="`date-${locale}`"
        class="date"
      >
        {{ doc.published | fromNow($root.$now) }}
      </p>
      <p
        v-if="doc.product === 'photo' && doc.urgency === 1"
        class="genre"
      >
        Topshot
      </p>
      <p
        v-else-if="doc.genre"
        class="genre"
      >
        {{ $t(`genres.${doc.genre}`) }}
      </p>
    </div>
    <h2 v-if="doc.product !== 'photo'">
      {{ doc.headline }}
    </h2>
    <p
      v-if="['news', 'multimedia'].includes(doc.product) && doc.urgency > 2 && doc.news && doc.news[0] && doc.status === 'Usable'"
      class="lead"
    >
      {{ doc.news[0].substr(0, 100) + '...' }}
    </p>
  </router-link>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Card',
  props: {
    docId: {
      type: String,
      required: true
    },
    indexCol: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    ...mapState([
      'locale'
    ]),
    ...mapGetters([
      'getDocumentById'
    ]),
    doc () {
      return this.getDocumentById(this.docId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.article {
  color: unset;
  text-decoration: unset;
  display: block;
  background-color: white;
  width: 100%;
  cursor: pointer;
  user-select: none;
  margin-bottom: 12px;
  padding-bottom: 18px;
  box-shadow: 0 1px 2px rgba($grey-cold-5,0.4);
  transition: box-shadow 0.2s ease-in-out;
  border-radius: 1px;

  &:hover {
    box-shadow: 0 1px 18px rgba($grey-cold-5,0.4);
  }

  &:not(.photo).flash {
    border-left: $urgency-bar-width solid #c9402d;
  }

  &.alerte {
    border-left: $urgency-bar-width solid $yellow-butter-5;
  }
  &.urgent {
    border-left: $urgency-bar-width solid lighten($yellow-butter-5, 20%);
  }
  &:visited {
    background-color: mix($white, $background-color, 70);

    h2, p {
      color: $grey-cold-3;
    }
  }

  &.canceled {
    & > h2 {
      text-decoration: line-through;
    }
  }

  .cols {
    display: flex;
    justify-content: space-between;
    color: $grey-cold-4;
    padding: 18px 18px 0px 18px;
    font-size: 0.75rem;
    p.date {
      margin: 0px;
      &.embargo {
        color: $red_warm_3;
      }
    }
    p.genre {
      text-transform: uppercase;
      font-weight: 600;
      margin: 0px;
    }
  }

  .img-container + p {
    padding-top: 18px;
    margin-bottom: 0;
  }

  h2 {
    padding: 0 18px;
    font-size: 1.4rem;
    margin: 10px 0px;
    line-height: 1.4rem;
    letter-spacing: -0.045em;
    font-weight: 600;
    word-wrap: break-word;
  }

  .img-container {
    position: relative;
    width: 100%;
    height: 150px;
    background-size: 100% auto;
    background-position: center center;
    background-repeat: no-repeat;
    //margin: 10px 0px;
    border-radius: 2px;

    .UI-icon.UI-play-video {
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translate(0%, -50%);
      font-size: 48px;
      color: white;
      opacity: 0.7;
      margin-left: 16px;
    }
  }

  p.lead {
    padding: 0px 18px 12px;
    display: block;
    display: -webkit-box;
    margin-top: 0px;
    margin-bottom: 0px;
    // max-height: 62px;
    word-wrap: break-word;
    overflow: hidden;
  }
  @media screen and (max-device-height: 568px) {
    p.lead {
      display: none;
    }
  }
}
@media screen {
  .night-mode {
    .article {
      background-color: $font-color;
      box-shadow: 0 1px 6px rgba(black,0.4);
      &:hover {
        box-shadow: 0 1px 12px rgba(black,0.6);
      }
      h2 {
        color: #eee;
        letter-spacing: -0.6px;
        line-height: 23px;
      }
      p.lead {
        color: $grey-cold-4;
      }
      &:visited {
        background-color: mix(white, $font-color, 5);

        h2, p {
          color: $grey-cold-5;
        }
      }
    }
  }
}
</style>
