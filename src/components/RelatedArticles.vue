<template>
  <aside
    v-if="documents.length > 0"
    class="related-articles"
  >
    <h3>{{ $t('document.related-articles') }}</h3>
    <card
      v-for="({ uno }) in documents"
      :key="uno"
      :doc-id="uno"
    />
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
    if (!this.doc.iptc || !Array.isArray(this.doc.iptc)) return false
    this.documents = await this.searchDocuments({
      query: `uno:-${this.doc.uno} ${this.doc.iptc.map(iptc => `iptc:${iptc}`).join(' AND ')}`,
      langs: [this.doc.lang],
      products: [],
      size: 5
    })
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

    article {
      margin-bottom: 24px;
    }
  }
</style>
