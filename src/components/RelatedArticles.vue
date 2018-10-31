<template>
  <ul
    v-if="documents.length > 0"
    class="related-articles">
    <h2>{{ $t('document.related-articles') }}</h2>
    <li
      v-for="doc in documents"
      :key="doc.uno">
      <router-link :to="`/doc/${doc.uno}`">
        {{ doc.headline }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import afpNews from '@/plugins/api'
import Doc from '@/store/actions/Doc'

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
        size: 10
      })
      if (documents && Array.isArray(documents)) {
        this.documents = documents.map(doc => new Doc(doc).toObject())
      }
    } catch (e) {}
  }
}
</script>

<style lang="scss" scoped>
  @media print {
    .related-articles {
      display: none;
    }
  }
</style>
