<template>
  <article
    v-if="doc"
    :class="{
      flash: doc.urgency === 1,
      alerte: doc.urgency === 2,
      urgent: doc.urgency === 3,
      viewed: doc.viewed
    }"
    :lang="doc.lang"
    :dir="doc.lang === 'ar' ? 'rtl' : 'ltr'"
    @click="setCurrentDocument({ docId: doc.uno, indexCol })">
    <p class="published">{{ published }}</p>
    <h1 v-if="doc.product !== 'photo'">
      {{ doc.headline }}
    </h1>
    <div
      v-if="doc.medias.length > 0 && doc.medias[0].sizes.Preview"
      :style="{ 'background-image': `url(${doc.medias[0].sizes.Preview.href})` }"
      class="img-container" />
    <p
      v-if="doc.urgency > 2 && doc.news && doc.news[0]"
      class="lead">
      {{ doc.news[0].substr(0, 100) + '...' }}
    </p>
  </article>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Document',
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
    ...mapState({
      doc (state) {
        return state.documents[this.docId]
      }
    }),
    published () {
      return moment(this.doc.published).calendar()
    }
  },
  methods: {
    ...mapActions([
      'setCurrentDocument'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "~@afp/toolkit-styles/scss/variables.scss";
article {
  min-height: 90px;
  max-height: 500px;
  min-width: 310px;
  max-width: 310px;
  border-top: 1px solid #E1E8ED;
  border-bottom: 1px solid #E1E8ED;
  padding: 5px 12px;
  cursor: pointer;

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
