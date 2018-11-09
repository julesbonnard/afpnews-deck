<template>
  <router-link
    v-if="doc"
    :class="{
      flash: doc.urgency === 1,
      alerte: doc.urgency === 2,
      urgent: doc.urgency === 3,
      viewed
    }"
    :lang="doc.lang"
    :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'"
    :to="{ name: 'document', params: { indexCol, docId } }"
    tag="article">
    <p
      :key="`date-${locale}`"
      class="published">
      {{ doc.published | fromNow }}
    </p>
    <h1 v-if="doc.product !== 'photo'">
      {{ doc.headline }}
    </h1>
    <div
      v-if="doc.medias.length > 0 && doc.medias[0].sizes.some(size => size.role === 'Preview')"
      :style="{
        backgroundImage: `url(${doc.medias[0].sizes.find(size => size.role === 'Preview').href})`,
        backgroundPosition: doc.medias[0].faceYOffsetPercent ? `0px ${doc.medias[0].faceYOffsetPercent * 100}%`: null
      }"
      class="img-container" />
    <p
      v-if="['news', 'multimedia'].includes(doc.product) && doc.urgency > 2 && doc.news && doc.news[0]"
      class="lead">
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
      required: true
    }
  },
  computed: {
    ...mapState([
      'locale'
    ]),
    ...mapGetters([
      'getDocumentById',
      'isDocumentViewed'
    ]),
    viewed () {
      return this.isDocumentViewed(this.docId)
    },
    doc () {
      return this.getDocumentById(this.docId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
article {
  min-height: 90px;
  max-height: 500px;
  min-width: 310px;
  max-width: 310px;
  border-top: 1px solid #E1E8ED;
  border-bottom: 1px solid #E1E8ED;
  padding: 5px 12px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: lightgrey;
  }

  &.flash {
    background-color: $red_dark;
    color: white;
    text-shadow: 0 1px 1px rgba(0,0,0,0.2);
  }
  &.alerte {
    background-color: $yellow-butter-5;
  }
  &.urgent {
    background-color: lighten($yellow-butter-5, 20%);
  }

  &.viewed {
    opacity: 0.5;
  }

  h1 {
    font-size: 1rem;
    margin-top: 10px;
    margin-bottom: 12px;
  }

  p.published {
    font-size: 0.7rem;
    margin-bottom: 0px;
    margin-top: 5px;
  }

  .img-container {
    width: 100%;
    height: 150px;
    background-size: 100% auto;
    background-position: center center;
    background-repeat: no-repeat;
    margin: 12px 0px;
    border-radius: 5px;
  }

  p.lead {
    display: block;
    display: -webkit-box;
    margin-top: 0px;
    margin-bottom: 0px;
    max-height: 62px;
    overflow: hidden;
  }
}
</style>
