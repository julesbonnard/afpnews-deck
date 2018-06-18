<template>
  <section class="column">
    <header
      v-on-clickaway="clickAway">
      <input
        v-model.lazy="query"
        autofocus
        class="search"
        type="text"
        name="query"
        placeholder="Search..."
        @focus="paramsOpen = true">
      <form
        v-if="paramsOpen"
        tabindex="-1"
        @submit.stop.prevent=""
        @keydown.enter.stop.prevent="reset">
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
            @click="reset">
            <i class="UI-icon UI-refresh" />
          </button>
          <button
            class="danger"
            @click="close">
            <i class="UI-icon UI-close-alt" />
          </button>
        </div>
        <select
          v-model="product"
          name="product">
          <option
            disabled
            selected>Choose a product</option>
          <option
            v-for="product in products"
            :key="product.value.join('|')"
            :value="product.value">
            {{ product.label }}
          </option>
        </select>
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
        <datepicker
          v-model="dateTo"
          :monday-first="true"
          :clear-button="true"
          :typeable="true"
          :use-utc="true"
          :disabled-dates="{ from: new Date(), to: new Date(2012, 0, 1) }"
          placeholder="Until" />
      </form>
    </header>
    <transition
      name="curtain-transform"
      mode="out-in">
      <div
        v-show="column.processing"
        class="loading-indicator">
        Loading...
      </div>
    </transition>
    <recyclist
      ref="recyclist"
      :list="documents"
      :offset="200"
      :fetch-bottom="loadBefore"
      :fetch-top="loadAfter"
      :is-loading="column.processing"
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
        <card
          v-if="typeof props.data === 'string'"
          :doc-id="props.data"
          :index-col="columnId" />
      </template>
      <div slot="nomore">No results</div>
    </recyclist>
  </section>
</template>

<script>
import Recyclist from '@/components/Recyclist'
import Card from '@/components/Card'
import { mapState, mapMutations, mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'Column',
  components: { Card, Recyclist, Datepicker },
  mixins: [ clickaway ],
  props: {
    columnId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      paramsOpen: false,
      products: [
        {
          label: 'All products',
          value: ['news', 'multimedia', 'photo', 'infographie', 'sid', 'videographie', 'livereport', 'sidtv', 'parismode']
        },
        {
          label: 'News',
          value: ['news']
        },
        {
          label: 'Multimedia',
          value: ['multimedia']
        },
        {
          label: 'Photo',
          value: ['photo']
        },
        {
          label: 'Graphics',
          value: ['infographie']
        },
        {
          label: 'Videographics',
          value: ['videographie']
        },
        {
          label: 'Live report',
          value: ['livereport']
        },
        {
          label: 'Paris mode',
          value: ['parismode']
        }
      ],
      languages: [
        {
          label: 'All languages',
          value: ['fr', 'en', 'es', 'de', 'pt', 'ar', 'zh-tw', 'zh-cn']
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
        },
        {
          label: 'Traditional chinese',
          value: ['zh-tw']
        },
        {
          label: 'Simplified chinese',
          value: ['zh-cn']
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
    product: {
      get () {
        return this.params.products
      },
      set (products) {
        this.updateParams({ products })
      }
    },
    lang: {
      get () {
        return this.params.langs
      },
      set (langs) {
        this.updateParams({ langs })
      }
    },
    urgency: {
      get () {
        return this.params.urgencies
      },
      set (urgencies) {
        this.updateParams({ urgencies })
      }
    },
    query: {
      get () {
        return this.params.query
      },
      set (query) {
        this.updateParams({ query })
      }
    },
    dateTo: {
      get () {
        return this.params.dateTo
      },
      set (dateTo) {
        this.updateParams({ dateTo })
      }
    }
  },
  methods: {
    ...mapMutations([
      'updateColumnParams',
      'resetColumn'
    ]),
    ...mapActions([
      'moveColumn',
      'closeColumn',
      'refreshColumn'
    ]),
    clickAway () {
      this.paramsOpen = false
    },
    updateParams (newParams) {
      const params = Object.assign({}, this.params, newParams)
      this.updateColumnParams({ indexCol: this.columnId, params })
      this.reset()
    },
    reset () {
      this.resetColumn({ indexCol: this.columnId })
      this.$refs.recyclist.init()
    },
    loadBefore () {
      return this.refreshColumn({ indexCol: this.columnId, more: 'before' })
    },
    loadAfter () {
      return this.refreshColumn({ indexCol: this.columnId, more: 'after' })
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
@import "@/assets/scss/variables.scss";

.column {
  background-color: white;
  min-width: $column-size;
  width: $column-size;
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
    z-index: 3;
    display: flex;
    flex-wrap: wrap;

    input.search {
      width: 100%;
      height: $sidebar-size;
      padding: 5px 12px;
      flex: 1;
      font-size: 1.3rem;
      @include breakpoint(mobile) {
        font-size: 1rem;
      }
      outline: none;
      border: none;
      background-color: lighten($background-color, 5);
    }
  }

  form {
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    .actions {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      padding: 4px;
    }
    .search {
      width: 100%;
    }
    select, input {
      background-color: white;
      width: 50%;
      border: none;
      border-top: 1px solid $background-color;
    }
  }

  .loading-indicator {
    z-index: 2;
    background-color: $secondary-color;
    color: white;
    font-size: 12px;
    padding: 12px 0px;
    text-align: center;
    margin-top: -37px;
  }

  h2.error {
    text-align: center;
    padding: 5px;
  }

  .documents {
    flex: 1;

    .tombstone {
      width: 100%;
      border-top: 1px solid darken($background-color, 3);
      border-bottom: 1px solid darken($background-color, 3);
      padding: 5px 12px;

      span {
        color: transparent;
        background-image:
          repeating-linear-gradient(
            -45deg,
            darken($background-color, 3),
            darken($background-color, 3) 11px,
            $background-color 10px,
            $background-color 20px /* determines size */
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
  }
}

.curtain-transform-enter-active, .curtain-transform-leave-active {
  transition: transform 100ms ease-in-out;
}
.curtain-transform-enter, .curtain-transform-leave-to {
  transform: translateY(0%);
}
.curtain-transform-enter-to {
  transform: translateY(100%);
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

<style lang="scss">
@import "@/assets/scss/variables.scss";
.vdp-datepicker {
  width: 50%;
  input {
    width: 100%;
    border: none;
    border-top: 1px solid $background-color;
  }
  .vdp-datepicker__clear-button {
    position: absolute;
    top: 6px;
    right: 6px;
  }
}
</style>
