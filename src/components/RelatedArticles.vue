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
    if (!this.doc.event) return false
    try {
      this.documents = await this.searchDocuments({
        query: `uno:-${this.doc.uno} event:"afpevent:${this.doc.event}"`,
        langs: [this.doc.lang],
        products: [],
        size: 5
      })
    } catch (error) {
      // tslint:disable-next-line no-console
      console.error(error)
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
    margin-top: 28px;

    @media print {
      display: none;
    }

    article {
      margin-bottom: 24px;
    }
  }
</style>
