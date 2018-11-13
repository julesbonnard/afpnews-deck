<template>
  <section class="column">
    <header
      v-on-clickaway="clickAway">
      <input
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
      <form
        v-if="paramsOpen || $route.name === 'tour'"
        tabindex="-1"
        @submit.stop.prevent=""
        @keydown.enter.stop.prevent="reset">
        <div class="actions">
          <button
            name="move-left"
            @click="move('left')">
            <i class="UI-icon UI-slide-left" />
          </button>
          <button
            name="move-right"
            class="margin-right-auto"
            @click="move('right')">
            <i class="UI-icon UI-slide-right" />
          </button>
          <button
            :class="{ processing: $wait.is(`column.refreshing.${column.id}`), danger: column.error }"
            name="refresh"
            class="margin-left-auto"
            @click="reset">
            <i class="UI-icon UI-refresh" />
          </button>
          <button
            name="close"
            class="danger"
            @click="close">
            <i class="UI-icon UI-close-alt" />
          </button>
        </div>
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
          :monday-first="true"
          :clear-button="true"
          :typeable="true"
          :use-utc="true"
          :disabled-dates="{ from: new Date(), to: new Date(2013, 6, 16) }"
          :placeholder="$t('column.until')"
          :language="datePickerTranslate"
          data-intro="date-picker" />
      </form>
    </header>
    <div
      :class="{
        waiting: $wait.is(`column.refreshing.${column.id}`)
      }"
      class="loading-indicator">
      {{ $t('loading') }}
    </div>
    <recyclist
      ref="recyclist"
      :list="documents"
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
import { mixin as clickaway } from 'vue-clickaway'
import Datepicker from 'vuejs-datepicker'
import { en, fr } from 'vuejs-datepicker/dist/locale'

const datePickerTranslations = { en, fr }

export default {
  name: 'Column',
  components: { Card, Recyclist, Datepicker, ContentPlaceholders, ContentPlaceholdersHeading, ContentPlaceholdersImg, ContentPlaceholdersText },
  mixins: [ clickaway ],
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
      if (this.product.length === 0 && this.product[0] === 'photo') {
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
          },
          {
            label: this.$tc('urgencies.depeches', 2),
            value: [1, 2, 3, 4]
          },
          {
            label: this.$t('urgencies.all'),
            value: [1, 2, 3, 4, 5]
          }
        ]
      }
      if (this.product[0] === 'photo') {
        return [
          {
            label: this.$tc('urgencies.topshots', 2),
            value: [1]
          },
          {
            label: this.$t('urgencies.all-photos'),
            value: [1, 2, 3, 4, 5]
          }
        ]
      }
      if (this.product[0] === 'news') {
        return [
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
          },
          {
            label: this.$tc('urgencies.depeches', 2),
            value: [1, 2, 3, 4]
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
  methods: {
    ...mapMutations([
      'updateColumnParams',
      'resetColumn',
      'moveColumn',
      'closeColumn'
    ]),
    ...mapActions([
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
    position: relative;

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
    button.clear-search {
      background-color: transparent;
      position: absolute;
      right: 0px;
      line-height: $sidebar-size;
      padding: 0px;
      padding: 0px 14px 0px 6px;
      background-color: lighten($background-color, 5);
    }
  }

  form {
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    outline: none;
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
    transition: transform 100ms ease-in-out;
    transform: translateY(0%);
    &.waiting {
      transform: translateY(100%);
    }
  }

  h2.error {
    text-align: center;
    padding: 5px;
  }

  .documents {
    flex: 1;

    .tombstone {
      width: 310px;
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
</style>

<style lang="scss">
@import "~vue-content-placeholders/dist/vue-content-placeholders.css";
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
