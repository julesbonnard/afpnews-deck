<template>
  <ul>
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
  name: 'More',
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
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss" scoped></style>
