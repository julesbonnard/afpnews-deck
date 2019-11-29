<template>
  <aside
    v-if="doc.event && documents.length > 0"
    class="related-documents"
  >
    <h3>
      <router-link
        :to="`/event/${doc.event.id}`">
        {{ doc.event.name }}
      </router-link>
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

    h3 {
      position: relative;
      a {
        text-decoration: none;
        color: inherit;
        position: relative;
        z-index: 2;
      }
      &:after {
        content: " ";
        display: block;
        background-color: $link-secondary;
        position: absolute;
        width: calc(100% + .8rem);
        height: .6rem;
        bottom: -.2rem;
        left: -.4rem;
        z-index: 1;
        pointer-events: none;
      }
    }

    .articles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-template-rows: 1fr;
      grid-gap: 10px;
      justify-items: stretch;
      align-items: center;
      justify-content: start;
      align-content: start;
      grid-auto-flow: row dense;

      .article {
        margin: 0px;
        grid-column: auto / span 1;
        grid-row: auto / span 1;

        &.news:nth-child(2n) {
          grid-column: auto / span 2;
        }
        &.multimedia, &.infographie, &.video {
          grid-column: auto / span 2;
          grid-row: auto / span 2;
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
