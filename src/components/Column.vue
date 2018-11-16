<template>
  <section class="column">
    <header>
      <div
        v-if="paramsOpen || $route.name === 'tour'"
        class="actions">
        <button
          name="move-left"
          @click="move('left')">
          <i class="UI-icon UI-navigate-left" />
        </button>
        <button
          name="move-right"
          class="margin-right-auto"
          @click="move('right')">
          <i class="UI-icon UI-navigate-right" />
        </button>
        <button
          name="close-params"
          class="close-params"
          @click="closeParams">
          <i class="UI-icon UI-collapse" />
        </button>
      </div>
      <div class="form-group">
        <input
          ref="search"
          v-model.lazy="query"
          :placeholder="$t('column.search')"
          class="search"
          data-intro="search"
          type="text"
          name="query"
          aria-label="query"
          autocomplete="off"
          @focus="paramsOpen = true">
        <button
          v-show="query.length > 0 && paramsOpen === true"
          name="clear-search"
          class="clear-search"
          @click="query = ''">
          <i class="UI-icon UI-delete" />
        </button>
        <button
          v-show="paramsOpen === false"
          name="expand"
          class="expand-params"
          @click="paramsOpen = true">
          <i class="UI-icon UI-expand" />
        </button>
      </div>
      <form
        v-if="paramsOpen || $route.name === 'tour'"
        tabindex="-1"
        @submit.stop.prevent=""
        @keydown.enter.stop.prevent="reset">
        <select
          v-model="product"
          name="product"
          data-intro="products">
          <option
            disabled
            selected>{{ $t('column.product') }}</option>
          <option
            v-for="product in products"
            :key="product.value.join('|')"
            :value="product.value">
            {{ product.label }}
          </option>
        </select>
        <select
          v-show="languages.length > 1"
          v-model="lang"
          name="lang"
          data-intro="languages">
          <option
            disabled
            selected>{{ $t('column.lang') }}</option>
          <option
            v-for="lang in languages"
            :key="lang.value.join('|')"
            :value="lang.value">
            {{ lang.label }}
          </option>
        </select>
        <select
          v-show="urgencies.length > 1"
          v-model="urgency"
          name="urgency"
          data-intro="urgencies">
          <option
            disabled
            selected>{{ $t('column.urgency') }}</option>
          <option
            v-for="urgency in urgencies"
            :key="urgency.value.join('|')"
            :value="urgency.value">
            {{ urgency.label }}
          </option>
        </select>
        <datepicker
          v-model="dateTo"
          :inline="false"
          :monday-first="true"
          :clear-button="true"
          :typeable="true"
          :use-utc="true"
          :disabled-dates="{ from: new Date(), to: new Date(2013, 6, 16) }"
          :placeholder="$t('column.until')"
          :language="datePickerTranslate"
          data-intro="date-picker" />
        <button
          name="close"
          class="danger"
          @click="close">
          {{ $t('column.delete') }}
        </button>
      </form>
      <div
        :class="{
          waiting: $wait.is(`column.refreshing.${column.id}`)
        }"
        class="loading-indicator">
        <div class="bar-horizontal" />
      </div>
    </header>
    <recyclist
      ref="recyclist"
      :list="documents"
      :size="10"
      :offset="200"
      :fetch-bottom="loadBefore"
      :fetch-top="loadAfter"
      :is-loading="$wait.is(`column.refreshing.${column.id}`)"
      class="documents">
      <template
        slot="tombstone"
        slot-scope="props">
        <content-placeholders
          :animated="true"
          :rounded="true"
          :centered="false"
          class="tombstone">
          <content-placeholders-heading :img="false" />
          <content-placeholders-img />
          <content-placeholders-text :lines="2" />
        </content-placeholders>
      </template>
      <template
        slot="item"
        slot-scope="props">
        <card
          v-if="typeof props.data === 'string'"
          :doc-id="props.data"
          :index-col="columnId" />
      </template>
      <div slot="nomore">{{ $t('column.no-result') }}</div>
    </recyclist>
  </section>
</template>

<script>
import Recyclist from '@/components/Recyclist'
import { ContentPlaceholders, ContentPlaceholdersHeading, ContentPlaceholdersImg, ContentPlaceholdersText } from 'vue-content-placeholders'
import Card from '@/components/Card'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Datepicker from 'vuejs-datepicker'
import { en, fr } from 'vuejs-datepicker/dist/locale'

const datePickerTranslations = { en, fr }

export default {
  name: 'Column',
  components: { Card, Recyclist, Datepicker, ContentPlaceholders, ContentPlaceholdersHeading, ContentPlaceholdersImg, ContentPlaceholdersText },
  props: {
    columnId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      paramsOpen: false
    }
  },
  computed: {
    ...mapGetters([
      'getColumnByIndex',
      'getDocumentsIdsByColumnId'
    ]),
    datePickerTranslate () {
      return datePickerTranslations[this.$i18n.locale] || datePickerTranslations[this.$i18n.fallbackLocale]
    },
    column () {
      return this.getColumnByIndex(this.columnId)
    },
    documents () {
      return this.getDocumentsIdsByColumnId(this.columnId)
    },
    params () {
      return this.column.params
    },
    product: {
      get () {
        return this.params.products
      },
      set (products) {
        if (!products[1]) {
          if (products[0] === 'photo') {
            this.updateParams({ products, langs: ['en'], urgencies: [1, 2, 3, 4, 5] })
            return true
          } else if (products[0] === 'news') {
            this.updateParams({ products, urgencies: [1, 2, 3, 4] })
            return true
          }
        }
        this.updateParams({ products, urgencies: [1, 2, 3, 4, 5] })
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
    products () {
      return [
        {
          label: this.$t('products.all'),
          value: []
        },
        {
          label: this.$t('products.news'),
          value: ['news']
        },
        {
          label: this.$t('products.multimedia'),
          value: ['multimedia']
        },
        {
          label: this.$t('products.photo'),
          value: ['photo']
        },
        {
          label: this.$t('products.video'),
          value: ['sidtv', 'parismode', 'afptvweb', 'afptv1st']
        },
        {
          label: this.$t('products.infographie'),
          value: ['infographie']
        },
        {
          label: this.$t('products.videographie'),
          value: ['videographie']
        }
      ]
    },
    languages () {
      if (this.product.length === 1 && this.product[0] === 'photo') {
        return [
          {
            label: this.$t('languages.en'),
            value: ['en']
          }
        ]
      }
      return [
        {
          label: this.$t('languages.all'),
          value: ['fr', 'en', 'es', 'de', 'pt', 'ar', 'zh-tw', 'zh-cn']
        },
        {
          label: this.$t('languages.en'),
          value: ['en']
        },
        {
          label: this.$t('languages.fr'),
          value: ['fr']
        },
        {
          label: this.$t('languages.de'),
          value: ['de']
        },
        {
          label: this.$t('languages.es'),
          value: ['es']
        },
        {
          label: this.$t('languages.pt'),
          value: ['pt']
        },
        {
          label: this.$t('languages.ar'),
          value: ['ar']
        },
        {
          label: this.$t('languages.zh-tw'),
          value: ['zh-tw']
        },
        {
          label: this.$t('languages.zh-cn'),
          value: ['zh-cn']
        }
      ]
    },
    urgencies () {
      if (this.product.length > 1) {
        return [
          {
            label: this.$t('urgencies.all'),
            value: [1, 2, 3, 4, 5]
          }
        ]
      }
      if (this.product[0] === 'photo') {
        return [
          {
            label: this.$t('urgencies.all-photos'),
            value: [1, 2, 3, 4, 5]
          },
          {
            label: this.$tc('urgencies.topshots', 2),
            value: [1]
          }
        ]
      }
      if (this.product[0] === 'news') {
        return [
          {
            label: this.$tc('urgencies.depeches', 2),
            value: [1, 2, 3, 4]
          },
          {
            label: this.$tc('urgencies.flash', 2),
            value: [1]
          },
          {
            label: this.$tc('urgencies.alertes', 2),
            value: [1, 2]
          },
          {
            label: this.$tc('urgencies.urgents', 2),
            value: [1, 2, 3]
          }
        ]
      }
      return [
        {
          label: this.$t('urgencies.all'),
          value: [1, 2, 3, 4, 5]
        }
      ]
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
        this.$ga.event('search', 'set query', query)
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
  watch: {
    async paramsOpen (val) {
      if (val === true) {
        await this.$nextTick()
        this.$refs.search.focus()
      }
    }
  },
  methods: {
    ...mapMutations([
      'updateColumnParams',
      'resetColumn',
      'moveColumn',
      'closeColumn',
      'openColumnSettings',
      'closeColumnSettings'
    ]),
    ...mapActions([
      'refreshColumn'
    ]),
    closeParams () {
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
@import "@/assets/scss/variables.scss";

.column {
  // background-color: white;
  min-width: $column-size;
  width: $column-size;
  margin-right: 5px;
  display: flex;
  flex-direction: column;

  select, input, button {
    height: 48px;
    margin-bottom: 4px;
  }
  button {
    width: 48px;
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    i {
      font-size: 24px;
    }
    &.margin-left-auto {
      margin-left: auto;
    }
    &.margin-right-auto {
      margin-right: auto;
    }
  }

  header {
    // display: flex;
    // flex-wrap: wrap;
    position: relative;
    padding: 0px 17px 0px 12px;
    margin-top: 4px;
    background-color: $background-color;

    .actions {
      width: 100%;
      display: flex;

      .close-params {
        i {
          font-size: 16px;
        }
      }
    }

    .form-group {
      position: relative;
      // flex: 1;
      width: 100%;
      z-index: 3;
      margin-bottom: 4px;

      input.search {
        height: 48px;
        width: 100%;
        padding: 5px 12px;
        font-size: 1.1rem;
        @include breakpoint(mobile) {
          font-size: 1rem;
        }
        outline: none;
        border: none;
        background-color: white;
        border-radius: 4px;
        color: black;
        margin: 0px;
      }
      button.clear-search, button.expand-params {
        background-color: transparent;
        position: absolute;
        i {
          font-size: 16px;
        }
        right: 0px;
      }
    }
  }

  form {
    outline: none;
    select, input {
      background-color: white;
      width: 100%;
      border: none;
      border-top: 1px solid $background-color;
      text-indent: 4px;
    }

    button[name="close"] {
      width: 100%;
      background-color: $danger-color;;
      line-height: 48px;
      text-align: left;
      color: white;
      font-weight: 600;
      text-shadow: 0 1px 1 rgba(black, 0.20);
      border-radius: 4px;
      padding: 0 16px;
      margin-bottom: 12px;
    }

    /deep/ .vdp-datepicker {
      @import "~vue-content-placeholders/dist/vue-content-placeholders.css";
      width: 100%;
      // height: 48px;
      margin-bottom: 24px;
      input {
        width: 100%;
        height: 100%;
        border: none;
        height: 48px;
        border-radius: 4px;
        padding: 5px 12px;
        border-top: 1px solid $background-color;
      }
      .vdp-datepicker__clear-button {
        position: absolute;
        top: 6px;
        right: 6px;
      }
    }
  }

  .loading-indicator {
    width: 100%;
    height: 4px;
    overflow: hidden;
    .bar-horizontal {
      width: 0;
      height: 100%;
      background-color: $secondary-color;
    }
    &.waiting {
      .bar-horizontal {
        animation-name: spinner;
        animation-duration: 750ms;
        animation-timing-function: ease-in-out;
        animation-play-state: running;
        animation-direction: alternate-reverse;
        animation-iteration-count: infinite;
      }
    }
  }

  h2.error {
    text-align: center;
    padding: 5px;
  }

  .documents {
    flex: 1;
    padding: 4px 12px 12px 12px;

    .tombstone {
      padding: 12px;
      user-select: none;
    }
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

@keyframes spinner {
  0% {
    width: 0;
  }
  50% {
    width: 100%;
    margin-right: 50%;
  }
  100% {
    width: 0;
    margin-right: 100%;
  }
}
</style>
