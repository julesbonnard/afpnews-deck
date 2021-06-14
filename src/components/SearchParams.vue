<template>
  <header class="search-params">
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

    <transition-group
      name="curtain"
      tabindex="-1"
      tag="div"
      class="filters"
    >
      <div
        v-if="paramsOpen && column.type !== 'topic'"
        key="products"
        class="control"
      >
        <select
          key="product"
          v-model="product"
          name="product"
          aria-label="Select a product"
          class="select is-fullwidth"
        >
          <option
            v-for="{ label, value, disabled } in products"
            :key="value ? value.join('|') : 'null'"
            :value="value"
            :disabled="disabled"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div
        v-if="paramsOpen && !(product.length === 1 && product[0] === 'photo')"
        key="languages"
        class="control"
      >
        <select
          v-model="lang"
          class="select is-fullwidth"
        >
          <option
            v-for="{ label, value } in languages"
            :key="value || 'null'"
            :value="value"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div
        v-if="paramsOpen && column.type === 'topic' && !directSelect"
        key="topics"
        class="control has-icons-left"
      >
        <select
          v-model="topics"
          class="select"
        >
          <option
            v-for="{ label, value } in topicsByLang"
            :key="value ? value.join('|') : 'null'"
            :value="value"
          >
            {{ label }}
          </option>
        </select>
        <span class="icon is-left">
          <icon-base
            icon-name="topic"
            width="22"
            height="22"
          >
            <icon-topic />
          </icon-base>
        </span>
      </div>

      <button
        v-if="paramsOpen"
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

      <div
        v-if="paramsOpen"
        key="move-column"
        class="move-column"
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
import { mapGetters, mapMutations } from 'vuex'
import IconBase from '@/components/IconBase'
import IconTopic from '@/components/icons/IconTopic'
import IconSearch from '@/components/icons/IconSearch'
import IconFilters from '@/components/icons/IconFilters'
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
      directSelect: true,
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
          value: ['afptv', 'sidtv', 'parismode', 'afptvweb', 'afptv1st'],
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
        this.updateParams({ products })
      }
    },
    languages () {
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

  select {
    padding-left: 40px;
    appearance: none;
    font-weight: 600;
    color: #4a4a4a;
    background-color: $light;
    padding-right: 30px;
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: ellipsis;
    &:disabled {
      opacity: 1;
    }
  }

  .input, .select, .button {
    border-color: $light;
    box-shadow: none;
    border-radius: 0px
  }

  .icon.is-right {
    pointer-events: all !important;
    cursor: pointer;
  }

  .icon svg {
    width: 20px;
    height: 20px;
    color: $dark;
    position: relative;
    top: -1px;
  }

  .filters {
    background-color: $light;
    outline: none;

    .control {
      .select {
        // height: 52px;
        font-weight: 400;
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
@media screen {
  .night-mode {
    .select, .button, .input {
      background-color: #252223;
      border-color: #252223;
      color: white;
    }

    header .header .icon svg {
      color: white;
    }

    .filters {
      background-color: transparent;
    }
  }
}
</style>