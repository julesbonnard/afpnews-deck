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
      display: flex;
      flex-flow: row wrap;
      margin-left: -8px; /* Adjustment for the gutter */
      .article {
        flex: auto;
        min-width: 180px;
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
