<template>
  <aside
    v-if="documents.length > 0"
    class="related-articles">
    <h3>{{ $t('document.related-articles') }}</h3>
    <ul>
      <!-- <li
        v-for="doc in documents"
        :key="doc.uno">
        <router-link :to="`/doc/${doc.uno}`">
          {{ doc.headline }}
        </router-link>
        <div class="date">
          {{ doc.published | fromNow }}
        </div>
      </li> -->
      <card
        v-for="doc in documents"
        :key="doc.uno"
        :doc-id="doc.uno" />
    </ul>
  </aside>
</template>

<script>
import { mapActions } from 'vuex'
import DocumentParser from '@/plugins/DocumentParser'
import Card from '@/components/Card'

export default {
  name: 'RelatedArticles',
  components: { Card },
  props: {
    doc: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  data () {
    return {
      documents: []
    }
  },
  async created () {
    const documents = await this.searchDocuments({
      query: `uno:-${this.doc.uno} ${this.doc.iptc.map(iptc => `iptc:${iptc}`).join(' AND ')}`,
      langs: [this.doc.lang],
      products: [],
      size: 5
    })
    if (documents && Array.isArray(documents)) {
      this.documents = documents.map(doc => doc.parsed ? doc : new DocumentParser(doc).toObject())
    }
  },
  methods: {
    ...mapActions([
      'searchDocuments'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
  aside {
    margin-top: 68px;

    @media print {
      display: none;
    }
    ul {
      padding-left: 0;
      list-style-type: none;
      margin-bottom: 48px;

      li {
        margin-bottom: 24px;
        div {
          margin-top:8px;
          line-height: 1.5rem;
          color:$grey-cold-5;
        }
        a {
          font-weight: 600;
          font-size: 1.6rem;
          letter-spacing: -0.06rem;
          text-decoration: none;
          line-height: 1.8rem;
          color:$black;
        }
      }
    }
  }
</style>
