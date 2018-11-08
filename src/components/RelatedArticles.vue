<template>
  <aside v-if="documents.length > 0">
    <h2>{{ $t('document.related-articles') }}</h2>
    <ul>
      <li
        v-for="doc in documents"
        :key="doc.uno">
        <router-link :to="`/doc/${doc.uno}`">
          {{ doc.headline }}
        </router-link>({{ doc.published | fromNow }})
      </li>
    </ul>
  </aside>
</template>

<script>
import afpNews from '@/plugins/api'
import DocumentParser from '@/plugins/DocumentParser'

export default {
  name: 'RelatedArticles',
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
    try {
      const { documents } = await afpNews.search({
        query: `uno:-${this.doc.uno} ${this.doc.iptc.map(iptc => `iptc:${iptc}`).join(' AND ')}`,
        langs: [ this.doc.lang ],
        products: [ this.doc.product ],
        size: 5
      })
      if (documents && Array.isArray(documents)) {
        this.documents = documents.map(doc => doc.parsed ? doc : new DocumentParser(doc).toObject())
      }
    } catch (e) {}
  }
}
</script>

<style lang="scss" scoped>
  @media print {
    ul {
      display: none;
    }
  }
  ul {
    padding-left: 0;
    list-style-type: none;
    li {
      margin-bottom: 8px;
    }
  }
</style>
