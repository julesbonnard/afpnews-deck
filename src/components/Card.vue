<template>
  <router-link
    v-if="doc"
    :class="{
      flash: doc.urgency === 1,
      alerte: doc.product !== 'photo' && doc.urgency === 2,
      urgent: doc.urgency === 3,
      viewed
    }"
    :lang="doc.lang"
    :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'"
    :to="{ name: 'document', params: { indexCol, docId } }"
    tag="article">
    <div
      v-if="doc.medias.length > 0 && doc.medias[0].sizes.some(size => size.role === 'Preview')"
      :style="{
        backgroundImage: `url(${doc.medias[0].sizes.find(size => size.role === 'Preview').href})`,
        backgroundPosition: doc.medias[0].faceYOffsetPercent ? `0px ${doc.medias[0].faceYOffsetPercent * 100}%`: null
      }"
      class="img-container" />
    <p
      :key="`date-${locale}`"
      class="published">
      {{ doc.published | fromNow }}
    </p>
    <h2 v-if="doc.product !== 'photo'">
      {{ doc.headline }}
    </h2>
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

  &.flash {
    border-left: $urgency-bar-width solid $red_dark;
  }
  &.alerte {
    border-left: $urgency-bar-width solid $yellow-butter-5;
  }
  &.urgent {
    border-left: $urgency-bar-width solid lighten($yellow-butter-5, 20%);
  }
  &.viewed {
    background-color: mix($white, $background-color, 70);

    h2, p {
      color: $grey-cold-3;
    }
  }

  p.published {
    padding: 18px 18px 0px;
    font-size: 0.75rem;
    margin: 0px;
    color: $grey-cold-4;
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
  }

  .img-container {
    width: 100%;
    height: 150px;
    background-size: 100% auto;
    background-position: center center;
    background-repeat: no-repeat;
    //margin: 10px 0px;
    border-radius: 2px;
  }

  p.lead {
    padding: 0px 18px 12px;
    display: block;
    display: -webkit-box;
    margin-top: 0px;
    margin-bottom: 0px;
    // max-height: 62px;
    overflow: hidden;
  }

}
</style>
