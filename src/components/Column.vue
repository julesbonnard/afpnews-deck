<template>
  <section class="column">
    <header>
      <div
        v-if="paramsOpen || $route.name === 'tour'"
        class="actions"
      >
        <button
          name="move-left"
          aria-label="Move column to left"
          class="btn btn-icon"
          @click="move('left')"
        >
          <i class="UI-icon UI-navigate-left" />
        </button>
        <button
          name="move-right"
          class="btn btn-icon margin-right-auto"
          aria-label="Move column to right"
          @click="move('right')"
        >
          <i class="UI-icon UI-navigate-right" />
        </button>
        <button
          name="close-params"
          class="btn btn-icon"
          aria-label="Close column params"
          @click="closeParams"
        >
          <i class="UI-icon UI-collapse" />
        </button>
      </div>
      <div class="form-group inpt-icon">
        <input
          ref="search"
          v-model.trim="currentQuery"
          :placeholder="$t('column.search')"
          :aria-label="$t('column.search')"
          :type="paramsOpen === true ? 'search' : 'text'"
          class="search inpt inpt-large"
          autocomplete="off"
          name="query"
          @change="query = currentQuery"
          @focus="paramsOpen === false ? paramsOpen = true : null"
        >
        <button
          v-if="paramsOpen === false"
          name="expand"
          class="btn btn-icon"
          aria-label="Open column params"
          @click="paramsOpen = true"
        >
          <i class="UI-icon UI-expand icon-small" />
        </button>
      </div>
      <transition-group
        name="curtain"
        tabindex="-1"
        tag="div"
        class="form"
      >
        <select
          v-if="paramsOpen || $route.name === 'tour'"
          key="product"
          v-model="product"
          name="product"
          aria-label="Select a product"
          class="slct slct-large"
        >
          <option
            v-for="{ label, value, disabled } in products"
            :key="value.join('|')"
            :value="value"
            :disabled="disabled"
          >
            {{ label }}
          </option>
        </select>
        <select
          v-if="paramsOpen || $route.name === 'tour'"
          v-show="languages.length > 1 || $route.name === 'tour'"
          key="lang"
          v-model="lang"
          name="lang"
          class="slct slct-large"
          aria-label="Select a language"
        >
          <option
            v-for="{ label, value, disabled } in languages"
            :key="value.join('|')"
            :value="value"
            :disabled="disabled"
          >
            {{ label }}
          </option>
        </select>
        <select
          v-if="paramsOpen || $route.name === 'tour'"
          v-show="urgencies.length > 1 || $route.name === 'tour'"
          key="urgency"
          v-model="urgency"
          name="urgency"
          class="slct slct-large"
          aria-label="Select an urgency"
        >
          <option
            v-for="{ label, value, disabled } in urgencies"
            :key="value.join('|')"
            :value="value"
            :disabled="disabled"
          >
            {{ label }}
          </option>
        </select>
        <input
          v-if="paramsOpen || $route.name === 'tour'"
          key="datepicker"
          v-model="dateTo"
          :placeholder="$t('column.until')"
          type="date"
          aria-label="Select a date"
          name="date-picker"
          class="inpt inpt-large"
        >
        <button
          v-if="paramsOpen || $route.name === 'tour'"
          key="close"
          name="close"
          class="btn btn-large danger"
          aria-label="Delete the column"
          @click="close"
        >
          {{ $t('column.delete') }}
        </button>
      </transition-group>
    </header>
    <recyclist
      ref="recyclist"
      :list="documents"
      :size="10"
      :offset="200"
      :is-loading="$wait.is(`column.refreshing.${column.id}`)"
      :no-more="noMore"
      class="documents"
      @load-top="loadAfter"
      @load-bottom="loadBefore"
    >
      <template v-slot:tombstone>
        <content-placeholders
          :animated="true"
          :rounded="true"
          :centered="false"
          class="tombstone"
        >
          <content-placeholders-heading :img="false" />
          <content-placeholders-img />
          <content-placeholders-text :lines="2" />
        </content-placeholders>
      </template>
      <template v-slot:item="{ data }">
        <div
          v-if="data.includes('documents-gap')"
          class="documents-gap"
        >
          <p>
            {{ $t('column.documents-gap', { count: parseInt(data.split('|')[2]) }) }}
            <router-link
              to="/"
              @click.native="reset"
            >
              {{ $t('column.refresh') }}
            </router-link>
          </p>
        </div>
        <card
          v-else
          :doc-id="data"
          :index-col="columnId"
        />
      </template>
      <template v-slot:nomore>
        <span>{{ $t('column.no-result') }}</span>
      </template>
    </recyclist>
  </section>
</template>

<script>
import Recyclist from '@/components/Recyclist'
import { ContentPlaceholders, ContentPlaceholdersHeading, ContentPlaceholdersImg, ContentPlaceholdersText } from 'vue-content-placeholders'
import Card from '@/components/Card'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import autoRefreshTimer from '@/mixins/autoRefreshTimer'

export default {
  name: 'Column',
  components: { Card, Recyclist, ContentPlaceholders, ContentPlaceholdersHeading, ContentPlaceholdersImg, ContentPlaceholdersText },
  mixins: [ autoRefreshTimer ],
  props: {
    columnId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      paramsOpen: false,
      noMore: false,
      currentQuery: ''
    }
  },
  computed: {
    ...mapGetters([
      'getColumnByIndex',
      'getDocumentsIdsByColumnId',
      'isAuthenticated'
    ]),
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
        if (products.length === 1) {
          if (products[0] === 'photo') {
            return this.updateParams({ products, langs: ['en'], urgencies: [] })
          }
          if (products[0] === 'news') {
            return this.updateParams({ products, urgencies: [1, 2, 3, 4] })
          }
        }
        this.updateParams({ products, urgencies: [] })
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
          value: [],
          disabled: !this.isAuthenticated
        },
        {
          label: this.$t('products.news'),
          value: ['news'],
          disabled: !this.isAuthenticated
        },
        {
          label: this.$t('products.multimedia'),
          value: ['multimedia'],
          disabled: false
        },
        {
          label: this.$t('products.photo'),
          value: ['photo'],
          disabled: !this.isAuthenticated
        },
        {
          label: this.$t('products.video'),
          value: ['sidtv', 'parismode', 'afptvweb', 'afptv1st'],
          disabled: !this.isAuthenticated
        },
        {
          label: this.$t('products.infographie'),
          value: ['infographie'],
          disabled: !this.isAuthenticated
        },
        {
          label: this.$t('products.videographie'),
          value: ['videographie'],
          disabled: !this.isAuthenticated
        }
      ]
    },
    languages () {
      if (this.product.length === 1 && this.product[0] === 'photo') {
        return [
          {
            label: this.$t('languages.en'),
            value: ['en'],
            disabled: false
          }
        ]
      }
      return [
        {
          label: this.$t('languages.all'),
          value: [],
          disabled: false
        },
        {
          label: this.$t('languages.en'),
          value: ['en'],
          disabled: false
        },
        {
          label: this.$t('languages.fr'),
          value: ['fr'],
          disabled: false
        },
        {
          label: this.$t('languages.de'),
          value: ['de'],
          disabled: false
        },
        {
          label: this.$t('languages.es'),
          value: ['es'],
          disabled: false
        },
        {
          label: this.$t('languages.pt'),
          value: ['pt'],
          disabled: false
        },
        {
          label: this.$t('languages.ar'),
          value: ['ar'],
          disabled: false
        },
        {
          label: this.$t('languages.zh-tw'),
          value: ['zh-tw'],
          disabled: false
        },
        {
          label: this.$t('languages.zh-cn'),
          value: ['zh-cn'],
          disabled: false
        }
      ]
    },
    urgencies () {
      if (this.product[0] === 'photo') {
        return [
          {
            label: this.$t('urgencies.all-photos'),
            value: [],
            disabled: !this.isAuthenticated
          },
          {
            label: this.$tc('urgencies.topshots', 2),
            value: [1],
            disabled: !this.isAuthenticated
          }
        ]
      }
      if (this.product[0] === 'news') {
        return [
          {
            label: this.$tc('urgencies.depeches', 2),
            value: [1, 2, 3, 4],
            disabled: !this.isAuthenticated
          },
          {
            label: this.$tc('urgencies.flash', 2),
            value: [1],
            disabled: !this.isAuthenticated
          },
          {
            label: this.$tc('urgencies.alertes', 2),
            value: [1, 2],
            disabled: !this.isAuthenticated
          },
          {
            label: this.$tc('urgencies.urgents', 2),
            value: [1, 2, 3],
            disabled: !this.isAuthenticated
          }
        ]
      }
      return [
        {
          label: this.$t('urgencies.all'),
          value: [],
          disabled: !this.isAuthenticated
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
    },
    currentQuery (newVal, oldVal) {
      if (newVal === '' && oldVal !== '') {
        this.query = newVal
      }
    }
  },
  mounted () {
    this.currentQuery = this.query
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
      this.noMore = false
      this.resetColumn({ indexCol: this.columnId })
      this.$refs.recyclist.reset()
    },
    async loadBefore () {
      const moreDocuments = await this.refreshColumn({ indexCol: this.columnId, more: 'before' })
      if (moreDocuments === false) {
        this.noMore = true
      }
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
  min-width: $column-size;
  width: $column-size;
  height: 100%;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;

  button {
    &.margin-left-auto {
      margin-left: auto;
    }
    &.margin-right-auto {
      margin-right: auto;
    }
  }

  header {
    position: relative;
    padding: 0px 17px 0px 12px;
    margin-top: 4px;

    .actions {
      display: flex;
    }

    input[type="date"]{
      font-size: 16px;
      text-indent: 6px;
      &:before {
        color: grey;
        font-size: 12px;
        padding-left: 8px;
        content: attr(placeholder);
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

    .documents-gap {
      padding: 12px;
      text-align: center;
    }
  }
}

.curtain-enter {
  opacity: 0;
  transform: translateY(-30px);
}
.curtain-enter-active {
  transition: opacity 0.5s, transform 0.5s;
}
.curtain-enter-to {
  opacity: 1;
  transform: translateY(0px);
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
