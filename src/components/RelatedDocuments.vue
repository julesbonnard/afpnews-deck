<template>
  <aside
    v-if="doc.event && documents.length > 0"
    class="related-documents"
  >
  <hr>
    <h3>
      <router-link
        :to="`/deck/event/${doc.event.id}`">
        <span>{{ doc.event.name }}</span>
      </router-link>
    </h3>
    <div class="articles">
      <card
        v-for="({ uno }) in documents.slice(0, 3)"
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
    size: {
      type: Number,
      default: 50,
      required: false
    }
  },
  data () {
    return {
      documents: []
    }
  },
  created () {
    this.search()
  },
  watch: {
    doc () {
      this.documents = []
      this.search()
    }
  },
  methods: {
    ...mapActions([
      'searchDocuments'
    ]),
    async search () {
      try {
        if (!this.doc.event) return false
        this.documents = await this.searchDocuments({
          query: this.doc.product !== 'photo' ? `uno:-${this.doc.uno} event:"afpevent:${this.doc.event.id}" ((lang:${this.doc.lang} AND product:-photo slug:-agenda) OR (lang:en product:photo))` : `uno:-${this.doc.uno} event:"afpevent:${this.doc.event.id}" slug:-agenda`,
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
  .related-documents {
    margin: 0 30px;

    select {
      background-color: transparent;
      border: none;
      font-weight: 600;
    }

    @media print {
      display: none;
    }

    h3 {
      position: relative;
      font-size: 30px;
      font-weight: 600;
      a {
        text-decoration: none;
        color: inherit;
        position: relative;
        z-index: 2;
          span{
            &:after {
            content: "";
            display: block;
            background-color: #7DFAAF;
            position: absolute;
            width: 100%;
            height: 20%;
            bottom: 5px;
            left: 0;
            z-index: -1;
            pointer-events: none;
          }
        }
      }
      
    }

    .articles {
      display: flex;
      margin-top: 20px;
    }
  }
</style>
