<template>
  <section class="column">
    <header>
      <h1>
        <input
          v-model.lazy="queryString"
          type="text"
          name="query"
          placeholder="Search..."
          autofocus>
      </h1>
      <button
        :class="{ success: paramsOpen, danger: column.error && !paramsOpen }"
        @click="toggleParamsOpen">
        <i class="UI-icon UI-settings" />
      </button>
    </header>
    <form
      v-if="paramsOpen"
      @submit.stop.prevent=""
      @keydown.enter.stop.prevent="refresh">
      <div class="actions">
        <button
          @click="move('left')">
          <i class="UI-icon UI-slide-left" />
        </button>
        <button
          class="margin-right-auto"
          @click="move('right')">
          <i class="UI-icon UI-slide-right" />
        </button>
        <button
          :class="{ processing: column.processing, danger: column.error }"
          class="margin-left-auto"
          @click="refresh">
          <i class="UI-icon UI-refresh" />
        </button>
        <button
          class="danger"
          @click="close">
          <i class="UI-icon UI-close-alt" />
        </button>
      </div>
      <select
        v-model="lang"
        name="lang">
        <option
          disabled
          selected>Choose a lang</option>
        <option
          v-for="lang in languages"
          :key="lang.value.join('|')"
          :value="lang.value">
          {{ lang.label }}
        </option>
      </select>
      <select
        v-model="urgency"
        name="urgency">
        <option
          disabled
          selected>Choose an urgency</option>
        <option
          v-for="urgency in urgencies"
          :key="urgency.value.join('|')"
          :value="urgency.value">
          {{ urgency.label }}
        </option>
      </select>
    </form>
    <main ref="documents">
      <intersect
        :root-margin="'0px 0px 50px 0px'"
        @enter="loadAfter">
        <div class="loading after">
          <p v-show="loadingAfter">Loading...</p>
        </div>
      </intersect>
      <intersect
        v-for="doc in documents"
        :key="doc"
        :threshold="[0, 0.5, 1]"
        @enter="enter(doc)"
        @leave="leave(doc)">
        <document
          :visible="inViewport[doc] === true"
          :doc-id="doc" />
      </intersect>
      <intersect
        :root-margin="'50px 0px 0px 0px'"
        @enter="loadBefore">
        <div class="loading before">
          <p v-show="loadingBefore">Loading...</p>
        </div>
      </intersect>
    </main>
  </section>
</template>

<script>
import Intersect from 'vue-intersect'
import Document from '@/components/Document'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Column',
  components: { Document, Intersect },
  props: {
    columnId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      languages: [
        {
          label: 'All languages',
          value: ['fr', 'en', 'es', 'de', 'pt', 'ar']
        },
        {
          label: 'English',
          value: ['en']
        },
        {
          label: 'French',
          value: ['fr']
        },
        {
          label: 'German',
          value: ['de']
        },
        {
          label: 'Spanish',
          value: ['es']
        },
        {
          label: 'Portuguese',
          value: ['pt']
        },
        {
          label: 'Arabic',
          value: ['ar']
        }
      ],
      urgencies: [
        {
          label: 'Flashs',
          value: [1]
        },
        {
          label: 'Alertes',
          value: [1, 2]
        },
        {
          label: 'Urgents',
          value: [1, 2, 3]
        },
        {
          label: 'Dépêches',
          value: [1, 2, 3, 4]
        },
        {
          label: 'All urgencies',
          value: [1, 2, 3, 4, 5]
        }
      ],
      dateRanges: [
        {
          label: '1 hour',
          value: 'now-1h'
        },
        {
          label: '1 day',
          value: 'now-1d'
        },
        {
          label: '1 month',
          value: 'now-1M'
        },
        {
          label: '1 year',
          value: 'now-12M'
        },
        {
          label: 'Since 2012',
          value: '2012-01-01'
        }
      ],
      inViewport: {},
      loadingBefore: false,
      loadingAfter: false
    }
  },
  computed: {
    ...mapState({
      column (state) {
        return state.columns[this.columnId]
      }
    }),
    documents () {
      return this.column.documentsIds
    },
    params () {
      return this.column.params
    },
    paramsOpen: {
      get () {
        return this.column.paramsOpen
      },
      set (value) {
        this.setParamsOpen({ indexCol: this.columnId, value })
      }
    },
    product: {
      get () {
        return this.params.products
      },
      set (products) {
        this.updateParams({ products }, true)
      }
    },
    lang: {
      get () {
        return this.params.langs
      },
      set (langs) {
        this.updateParams({ langs }, true)
      }
    },
    urgency: {
      get () {
        return this.params.urgencies
      },
      set (urgencies) {
        this.updateParams({ urgencies }, true)
      }
    },
    queryString: {
      get () {
        return this.params.queryString
      },
      set (queryString) {
        this.updateParams({ queryString }, true)
      }
    }
  },
  methods: {
    ...mapMutations([
      'setParamsOpen',
      'updateColumnParams',
      'moveColumn',
      'closeColumn',
      'resetColumn'
    ]),
    ...mapActions([
      'refreshColumn',
      'saveColumns'
    ]),
    async updateParams (newParams, reset = true) {
      const params = Object.assign({}, this.params, newParams)
      if (reset === true) {
        this.resetColumn({ indexCol: this.columnId })
      }
      this.updateColumnParams({ indexCol: this.columnId, params })
      if (reset === false) {
        this.refresh()
      }
    },
    async refresh () {
      await this.refreshColumn({ indexCol: this.columnId })
    },
    async loadBefore () {
      if (this.processing) return false
      this.loadingBefore = true
      await this.refreshColumn({ indexCol: this.columnId, more: 'before' })
      this.loadingBefore = false
    },
    async loadAfter () {
      if (this.processing) return false
      this.loadingAfter = true
      await this.refreshColumn({ indexCol: this.columnId, more: 'after' })
      this.loadingAfter = false
    },
    toggleParamsOpen () {
      this.paramsOpen = !this.paramsOpen
    },
    move (dir) {
      this.moveColumn({ indexCol: this.columnId, dir })
      this.saveColumns()
    },
    close () {
      this.closeColumn({ indexCol: this.columnId })
      this.saveColumns()
    },
    enter (docId) {
      this.$set(this.inViewport, docId, true)
    },
    leave (docId) {
      this.$delete(this.inViewport, docId, false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@afp/toolkit-styles/scss/variables.scss";

.column {
  background-color: white;
  min-width: 310px;
  max-width: 310px;
  margin-right: 5px;
  display: flex;
  flex-direction: column;

  button {
    &:not(.danger) {
      background-color: transparent;
      color: #575e62;
    }
    &.success {
      background: none;
      background-color: #575e62;
      color: white;
    }

    &.margin-left-auto {
      margin-left: auto;
    }
    &.margin-right-auto {
      margin-right: auto;
    }
  }

  header {
    background-color: #F5F8FA;
    min-height: 50px;
    max-height: 50px;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 12px;

    h1 {
      flex: 1;
      font-size: 1.3rem;
      outline: none;

      input {
        outline: none;
        border: none;
        padding: 0;
        background: transparent;
      }
    }
  }

  form {
    display: flex;
    flex-wrap: wrap;
    min-height: 90px;
    .actions {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      padding: 4px;
    }
    .search {
      width: 100%;
    }
    select {
      width: 50%;
    }
  }

  h2.error {
    text-align: center;
    padding: 5px;
  }

  main {
    overflow-y: scroll;
    overscroll-behavior-y: contain;

    .loading {
      p {
        text-align: center;
        font-size: 35px;
        padding: 5px 12px;
      }
    }
  }
}
</style>
