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
    <vue-recyclist
      :list="documents"
      :tombstone = "true"
      :size="20"
      :nomore="column.documentsCount === 0"
      :loadmore="loadBefore"
      :spinner="column.processing"
      class="documents">
      <template
        slot="tombstone"
        slot-scope="props">
        <article class="tombstone">
          <p class="published"><span>Lorem ipsum</span></p>
          <h1><span>Lorem Ipsum</span></h1>
          <p class="lead"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris in massa vel orci eleifend eleifend.</span></p>
        </article>
      </template>
      <template
        slot="item"
        slot-scope="props">
        <document
          v-if="typeof props.data === 'string'"
          :doc-id="props.data" />
      </template>
      <div slot="spinner">Loading...</div>
      <div slot="nomore">No More Data</div>
    </vue-recyclist>
  </section>
</template>

<script>
import VueRecyclist from 'vue-recyclist'
import Document from '@/components/Document'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Column',
  components: { Document, VueRecyclist },
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
      ]
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
      'refreshColumn'
    ]),
    async updateParams (newParams, reset = true) {
      const params = Object.assign({}, this.params, newParams)
      if (reset === true) {
        this.resetColumn({ indexCol: this.columnId })
      }
      this.updateColumnParams({ indexCol: this.columnId, params })
      if (reset === false) {
        return this.refresh()
      }
      return true
    },
    refresh () {
      return this.refreshColumn({ indexCol: this.columnId })
    },
    loadBefore () {
      if (this.processing) return false
      return this.refreshColumn({ indexCol: this.columnId, more: 'before' })
    },
    loadAfter () {
      if (this.processing) return false
      return this.refreshColumn({ indexCol: this.columnId, more: 'after' })
    },
    toggleParamsOpen () {
      this.paramsOpen = !this.paramsOpen
    },
    move (dir) {
      this.moveColumn({ indexCol: this.columnId, dir })
    },
    close () {
      this.closeColumn({ indexCol: this.columnId })
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

  .documents {
    overflow-y: scroll;
    overscroll-behavior-y: contain;

    .tombstone {
      width: 100%;
      border-top: 1px solid #E1E8ED;
      border-bottom: 1px solid #E1E8ED;
      padding: 5px 12px;

      span {
        color: transparent;
        background-image:
          repeating-linear-gradient(
            -45deg,
            #E1E8ED,
            #E1E8ED 11px,
            #F5F8FA 10px,
            #F5F8FA 20px /* determines size */
          );
        animation: move .5s linear infinite;
      }

      h1 {
        font-size: 1rem;
        margin-top: 10px;
        margin-bottom: 12px;
      }

      p.published {
        font-size: 0.7rem;
        margin-bottom: 0px;
        margin-top: 5px;
      }

      p.lead {
        display: block;
        display: -webkit-box;
        margin-top: 0px;
        margin-bottom: 0px;
        max-height: 62px;
        overflow: hidden;
      }
    }

    // .loading {
    //   p {
    //     text-align: center;
    //     font-size: 35px;
    //     padding: 5px 12px;
    //   }
    // }
  }
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 28px 0;
  }
}
</style>
