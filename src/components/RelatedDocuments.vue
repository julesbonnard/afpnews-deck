<template>
  <aside class="related-documents">
    <h3>Documents du même
      <select v-model="display">
        <option
          :disabled="!doc.event"
          value="event"
        >
          évènement
        </option>
        <option
          :disabled="!doc.iptc || !Array.isArray(doc.iptc)"
          value="category"
        >
          sujet
        </option>
        <option
          :disabled="!doc.creator"
          value="creator"
        >
          auteur
        </option>
        <option
          :disabled="!doc.city"
          value="location"
        >
          lieu
        </option>
      </select>
    </h3>
    <div class="articles">
      <card
        v-for="({ uno }) in documents"
        :key="uno"
        :doc-id="uno"
      />
    </div>
  </aside>
</template>

<script>
import { mapActions } from 'vuex'
import Card from '@/components/Card'

export default {
  name: 'RelatedDocuments',
  components: { Card },
  props: {
    doc: {
      type: Object,
      default: () => ({}),
      required: true
    },
    sameProduct: {
      type: Boolean,
      default: false,
      required: false
    },
    sameLang: {
      type: Boolean,
      default: false,
      required: false
    },
    size: {
      type: Number,
      default: 10,
      required: false
    }
  },
  data () {
    return {
      documents: [],
      display: 'event'
    }
  },
  computed: {
    query () {
      if (this.display === 'event') {
        return `uno:-${this.doc.uno} slug:-agenda event:"afpevent:${this.doc.event.id}"`
      }
      if (this.display === 'category') {
        return `uno:-${this.doc.uno} ${this.doc.slugs.map(slug => `slug:${slug}`).join(' AND ')}`
      }
      if (this.display === 'creator') {
        return `uno:-${this.doc.uno} creator:"${this.doc.creator}"`
      }
      if (this.display === 'location') {
        return `uno:-${this.doc.uno} city:"${this.doc.city}" country:"${this.doc.country}"`
      }
    }
  },
  created () {
    this.init()
  },
  watch: {
    doc () {
      this.documents = []
      this.init()
    },
    display () {
      this.documents = []
      this.init()
    }
  },
  methods: {
    ...mapActions([
      'searchDocuments'
    ]),
    async init () {
      try {
        if (this.display === 'event' && !this.doc.event) {
          this.display = 'category'
          return
        }
        if (this.display === 'creator' && !this.doc.creator) {
          this.display = 'category'
          return
        }
        this.documents = await this.searchDocuments({
          query: this.query,
          langs: this.sameLang ? [this.doc.lang] : [],
          products: this.sameProduct ? this.doc.product : [],
          size: this.size
        })
      } catch (error) {
        // tslint:disable-next-line no-console
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
  aside {
    margin-top: 28px;

    select {
      background-color: transparent;
      border: none;
      font-weight: 600;
    }

    @media print {
      display: none;
    }

    .articles {
      display: flex;
      flex-flow: row wrap;
      margin-left: -8px; /* Adjustment for the gutter */
      .article {
        flex: auto;
        min-width: 300px;
        margin: 0 8px 8px 0; /* Some gutter */
        width: calc(50% - 16px);
        &.photo, &.video {
          min-width: 150px;
          width: calc(33% - 24px);
        }
        &.news {
          min-width: 150px;
          width: calc(50% - 16px);
        }
      }
    }
  }
  .night-mode {
    aside {
      h3 {
        color: #eee;
      }
      select {
        background-color: transparent;
        border: none;
        color: #eee;
        font-weight: 600;
      }
    }
  }
</style>
