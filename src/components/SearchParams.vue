<template>
  <header class="search-params">
    <div class="header">
      <div class="field">
        <div class="control has-icons-left has-icons-right">
          <select
            v-if="column.type === 'topic'"
            v-model="topics"
            :disabled="!directSelect"
            class="select is-large is-fullwidth"
          >
            <option
              v-for="{ label, value } in topicsByLang"
              :key="value ? value.join('|') : 'null'"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
          <search-input
            v-if="column.type === 'search'"
            :type="paramsOpen === true ? 'search' : 'text'"
            :initial-query="params.query"
            class="input is-large is-fullwidth"
            @submit="onQueryChange"
          />
          <span class="icon is-left">
            <icon-base
              v-if="column.type === 'search'"
              icon-name="search"
            >
              <icon-search />
            </icon-base>
            <icon-base
              v-if="column.type === 'topic'"
              icon-name="topic"
            >
              <icon-topic />
            </icon-base>
          </span>
          <span
            class="icon is-right"
            @click="toggleFilters"
          >
            <icon-base icon-name="filters">
              <icon-filters />
            </icon-base>
          </span>
        </div>
      </div>
    </div>

    <transition-group
      name="curtain"
      tabindex="-1"
      tag="div"
      class="filters"
    >
      <div
        v-if="paramsOpen"
        key="languages"
        class="field"
      >
        <div class="control has-icons-left">
          <div class="select is-large is-fullwidth">
            <select v-model="lang">
              <option
                v-for="{ label, value } in languages"
                :key="value"
                :value="value"
              >
                {{ label }}
              </option>
            </select>
          </div>
          <span class="icon is-large is-left">
            <icon-base
              icon-name="languages"
              width="22"
              height="22"
            >
              <icon-languages />
            </icon-base>
          </span>
        </div>
      </div>

      <div
        v-if="paramsOpen"
        key="products"
        class="field"
      >
        <select
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
      </div>
      
      <div
        v-if="paramsOpen"
        key="urgencies"
        class="field"
      >
        <select
          v-show="urgencies.length > 1"
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
      </div>

      <div
        v-if="paramsOpen && column.type === 'topic' && !directSelect"
        key="topics"
        class="field"
      >
        <div class="control has-icons-left">
          <div class="select is-large is-fullwidth">
            <select v-model="topics">
              <option
                v-for="{ label, value } in topicsByLang"
                :key="value ? value.join('|') : 'null'"
                :value="value"
              >
                {{ label }}
              </option>
            </select>
          </div>
          <span class="icon is-large is-left">
            <icon-base
              icon-name="topic"
              width="22"
              height="22"
            >
              <icon-topic />
            </icon-base>
          </span>
        </div>
      </div>

      <div
        v-if="paramsOpen"
        key="close"
        class="field"
      >
        <button
          key="close"
          name="close"
          class="button close is-large is-fullwidth"
          aria-label="Delete the column"
          @click="$emit('close')"
        >
          <span class="icon is-large is-left">
            <icon-base icon-name="delete">
              <icon-delete />
            </icon-base>
          </span>
          <span>{{ $t('column.delete') }}</span>
        </button>
      </div>

      <div
        v-if="paramsOpen"
        key="move-column"
        class="field move-column"
      >
        <button
          name="move-left"
          aria-label="Move column to left"
          class="btn btn-icon"
          @click="$emit('move', 'left')"
        >
          <span>
            <icon-base icon-name="move-left">
              <icon-move-left />
            </icon-base>
          </span>
        </button>

        <button
          name="move-right"
          class="btn btn-icon"
          aria-label="Move column to right"
          @click="$emit('move', 'right')"
        >
          <span>
            <icon-base icon-name="move-right">
              <icon-move-right />
            </icon-base>
          </span>
        </button>
      </div>
    </transition-group>
  </header>
</template>

<script>
import topicsConfig from '@/config/topics.json'
import SearchInput from '@/components/SearchInput'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import IconBase from '@/components/IconBase'
import IconTopic from '@/components/icons/IconTopic'
import IconSearch from '@/components/icons/IconSearch'
import IconFilters from '@/components/icons/IconFilters'
import IconLanguages from '@/components/icons/IconLanguages'
import IconMoveLeft from '@/components/icons/IconMoveLeft'
import IconMoveRight from '@/components/icons/IconMoveRight'
import IconDelete from '@/components/icons/IconDelete'

export default {
  name: 'SearchParams',
  components: {
    SearchInput,
    IconBase,
    IconTopic,
    IconSearch,
    IconFilters,
    IconLanguages,
    IconMoveLeft,
    IconMoveRight,
    IconDelete
  },
  props: {
    columnId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      directSelect: false,
      paramsOpen: false
    }
  },
  computed: {
    ...mapGetters([
      'getColumnByIndex',
      'isAuthenticated'
    ]),
    column () {
      return this.getColumnByIndex(this.columnId)
    },
    params () {
      return this.column.params
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
    product: {
      get () {
        return this.params.products
      },
      set (products) {
        if (products.length === 1) {
          if (products[0] === 'photo') {
            return this.updateParams({ products, langs: ['en'], urgencies: [], topics: [] })
          }
          if (products[0] === 'news') {
            return this.updateParams({ products, urgencies: [1, 2, 3, 4], topics: [] })
          }
        }
        this.updateParams({ products, urgencies: [], topics: [] })
      }
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
          value: null
        },
        {
          label: this.$t('languages.en'),
          value: 'en'
        },
        {
          label: this.$t('languages.fr'),
          value: 'fr'
        },
        {
          label: this.$t('languages.de'),
          value: 'de'
        },
        {
          label: this.$t('languages.es'),
          value: 'es'
        },
        {
          label: this.$t('languages.pt'),
          value: 'pt'
        },
        {
          label: this.$t('languages.ar'),
          value: 'ar'
        },
        {
          label: this.$t('languages.zh-tw'),
          value: 'zh-tw'
        },
        {
          label: this.$t('languages.zh-cn'),
          value: 'zh-cn'
        }
      ]
    },
    lang: {
      get () {
        return this.params.langs[0] || null
      },
      set (lang) {
        this.updateParams({ langs: lang ? [lang] : [], topics: [] })
      }
    },
    topicsByLang () {
      return topicsConfig[this.lang]
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
    topics: {
      get () {
        return this.params.topics
      },
      set (topics) {
        this.updateParams({ topics })
      }
    },
    query () {
      return this.params.query
    },
    dateTo: {
      get () {
        return this.params.dateTo
      },
      set (dateTo) {
        this.updateParams({ dateTo })
      }
    },
    topicName () {
      if (this.column.type === 'topic' && this.topics.length > 0) {
        return this.topicsByLang.find(i => i.value.includes(this.topics[0])).label
      }
      return this.$t('topics.all')
    }
  },
  methods: {
    ...mapMutations([
      'updateColumnParams',
      'openColumnSettings',
      'closeColumnSettings'
    ]),
    ...mapActions([
      'refreshColumn'
    ]),
    updateParams (newParams) {
      const params = {
        ...this.params,
        ...newParams
      }
      this.updateColumnParams({ indexCol: this.columnId, params })
      this.$emit('reset')
    },
    onQueryChange (query) {
      this.$ga.event('search', 'set query', query)
      this.updateParams({ query })
    },
    toggleFilters () {
      this.paramsOpen = this.paramsOpen ? false : true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

@import "bulma/sass/utilities/initial-variables";

$size-large: 1.2rem;

@import "bulma/sass/utilities/functions";
@import "bulma/sass/utilities/derived-variables";
@import "bulma/sass/utilities/mixins";
@import "bulma/sass/utilities/controls";
@import "bulma/sass/utilities/extends";
@import "bulma/sass/elements/icon";
@import "bulma/sass/elements/button";
@import "bulma/sass/form/_all";

header {
  padding: 0px 17px 0px 12px;

  .header {
    select {
      padding-left: 50px;
      appearance: none;
      font-weight: 600;
      color: #4a4a4a;
      background-color: $light;
      padding-right: 30px;
      overflow:hidden; 
      white-space:nowrap; 
      text-overflow:ellipsis;
      &:disabled {
        opacity: 1;
      }
    }

    .input, .select {
      border-color: #dbdbdb;
      box-shadow: none;
    }

    .icon.is-right {
      pointer-events: all !important;
      cursor: pointer;
    }

    .icon svg {
      width: 24px;
      height: 24px;
      color: $dark;
    }
  }

  .filters {
    background-color: $light;
    outline: none;

    .field {
      margin-bottom: 0;

      .control {
        .select {
          height: 52px;
          select {
            color: $secondary-color;
            border-radius: 0;
            font-weight: 400;
            font-size: 1rem;
            height: 100%;
            border-top: 0px;
          }
          &::after {
            right: 1.125em;
            width: 0.5rem;
            height: 0.5rem;
            border: 2px solid transparent;
            border-right: 0px;
            border-top: 0px;
            margin-top: -0.4rem;
            border-color: $grey_neutral_5;
          }
        }
      }
      .button.close {
        height: 52px;
        border-radius: 0;
        font-size: 1rem;
        color: $danger-color;
        border-top: 0px;
        &.is-fullwidth {
          justify-content: flex-start;
        }
        .icon {
          margin-left: calc(-0.4em);
          margin-right: 0.4em;
          svg {
            color: $danger-color;
          }
        }
      }

      .icon {
        svg {
          color: $grey_neutral_5;
        }
      }
      &.move-column {
        height: 52px;
        display: flex;
        border: 1px solid #dbdbdb;
        border-top: 0px;
        border-radius: 0;
        padding-left: 5px;

        svg {
          height: 22px;
          color: #757575;
        }
      }
    }
  }
}
</style>