<template>
  <header>
    <div
      v-if="paramsOpen"
      class="actions"
    >
      <button
        name="move-left"
        aria-label="Move column to left"
        class="btn btn-icon"
        @click="$emit('move', 'left')"
      >
        <i class="UI-icon UI-navigate-left" />
      </button>
      <button
        name="move-right"
        class="btn btn-icon margin-right-auto"
        aria-label="Move column to right"
        @click="$emit('move', 'right')"
      >
        <i class="UI-icon UI-navigate-right" />
      </button>
      <button
        name="close-params"
        class="btn btn-icon"
        aria-label="Close column params"
        @click="paramsOpen = false"
      >
        <i class="UI-icon UI-collapse" />
      </button>
    </div>
    <div class="form-group inpt-icon">
      <search-input
        :type="paramsOpen === true ? 'search' : 'text'"
        :initial-query="params.query"
        @submit="onQueryChange"
      />
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
        v-if="paramsOpen"
        v-show="languages.length > 1"
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
        v-if="paramsOpen"
        v-show="topics.length > 1"
        key="topic"
        v-model="topic"
        name="topic"
        class="slct slct-large"
        aria-label="Select a topic"
      >
        <option
          v-for="{ label, value } in topics.filter(d => !d.disabled)"
          :key="value.join('|')"
          :value="value"
        >
          {{ label }}
        </option>
      </select>
      <!-- <input
        v-if="paramsOpen"
        key="datepicker"
        v-model="dateTo"
        :placeholder="$t('column.until')"
        type="date"
        aria-label="Select a date"
        name="date-picker"
        class="inpt inpt-large"
      > -->
      <button
        v-if="paramsOpen"
        key="close"
        name="close"
        class="btn btn-large danger"
        aria-label="Delete the column"
        @click="$emit('close')"
      >
        {{ $t('column.delete') }}
      </button>
    </transition-group>
  </header>
</template>

<script>
import SearchInput from '@/components/SearchInput'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import config from '@/config/topics'

export default {
  name: 'SearchParams',
  components: {
    SearchInput
  },
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
      'isAuthenticated'
    ]),
    column () {
      return this.getColumnByIndex(this.columnId)
    },
    params () {
      return this.column.params
    },
    languages () {
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
    lang: {
      get () {
        return this.params.langs
      },
      set (langs) {
        this.updateParams({ langs, topics: [] })
      }
    },
    topics () {
      return config[this.lang[0]]
    },
    topic: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
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

  // input[type="date"]{
  //   font-size: 16px;
  //   text-indent: 6px;
  //   &:before {
  //     color: grey;
  //     font-size: 12px;
  //     margin-left: 8px;
  //     content: attr(placeholder);
  //   }
  // }
}
</style>
