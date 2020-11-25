<template>
  <header class="search-params">
    <div class="header" key="header">
      <span class="icon">
        <svg v-if="columnType === 'search'" viewBox="0 0 300 300"><title>search-blue</title><path class="cls-1" d="M124.134,217.654a93.091,93.091,0,0,0,54-17.162L238.6,269.385h30.565l-74.2-84.185a93.518,93.518,0,1,0-70.829,32.454Zm0-164.039a70.52,70.52,0,1,1-70.519,70.519A70.6,70.6,0,0,1,124.134,53.615Z"/></svg>
        <svg v-if="columnType === 'topic'" viewBox="0 0 500 500"><title>rubrique</title><path class="cls-1" d="M477.05,445.08H243.64l116.71-184.7Zm-164.63-37.9h95.85l-47.92-75.85Z"/><path class="cls-1" d="M210.37,447.48H37.4v-173h173ZM75.29,409.58h97.18V312.41H75.29Z"/><path class="cls-1" d="M273,227.44A86.49,86.49,0,1,1,359.44,141,86.59,86.59,0,0,1,273,227.44Zm0-135.07A48.59,48.59,0,1,0,321.55,141,48.64,48.64,0,0,0,273,92.37Z"/></svg>
      </span>
      <span v-if="columnType === 'topic'" class="column-title">{{topicName  || $t('topics.all')}}</span>
      <search-input class="search-input" v-if="columnType === 'search'"
        :type="paramsOpen === true ? 'search' : 'text'"
        :initial-query="params.query"
        @submit="onQueryChange"
        key="search"
      />
      <span class="settings" @click="toggleFilters">
        <svg viewBox="0 0 300 300"><title>filter-blue</title><path class="cls-1" d="M109.547,47.059a49.378,49.378,0,0,0-47.878,37.57H30.824v23H61.563a49.286,49.286,0,0,0,96.021-.234H269.315v-23H157.37A49.38,49.38,0,0,0,109.547,47.059Zm0,74.6a25.3,25.3,0,1,1,25.3-25.3A25.328,25.328,0,0,1,109.547,121.657Z"/><path class="cls-1" d="M176.7,252.941a49.38,49.38,0,0,0,47.875-37.557h44.372v-23H224.681a49.287,49.287,0,0,0-95.973,0H30.685v23H128.82A49.378,49.378,0,0,0,176.7,252.941Zm0-74.6a25.3,25.3,0,1,1-25.3,25.3A25.328,25.328,0,0,1,176.7,178.343Z"/></svg>
      </span>
    </div>

    <transition-group
      name="curtain"
      tabindex="-1"
      tag="div"
      class="filters"
      v-if="paramsOpen"
    >

      <div
        v-show="languages.length > 1"
        key="lang"
        name="lang"
        class="field"
        aria-label="Select a language"
      >
        <div class="control has-icons-left">
          <div class="select is-fullwidth">
            <select v-model="lang">
              <option
                v-for="{ label, value, disabled } in languages"
                :key="value.join('|')"
                :value="value"
                :disabled="disabled"
              >
                {{ label }}
              </option>
            </select>
          </div>
          <div class="icon is-small is-left">
            <svg viewBox="0 0 300 300"><title>pin-blue</title><path class="cls-1" d="M76.938,38.423v-.011h-23V262.144h23V161.5H244.264L191.842,97.413l54.409-58.99ZM195.735,138.5H76.938V61.423h116.81L161.387,96.509Z"/></svg>
          </div>
        </div>
      </div>

      <div         
        v-if="columnType === 'topic'"
        v-show="topics.length > 1"
        key="topic"
        name="topic"
        class="field"
        aria-label="Select a topic"
      >
        <div class="control has-icons-left">
          <div class="select is-fullwidth">
            <select v-model="topic">
            <option
              v-for="{ label, value } in topics.filter(d => !d.disabled)"
              :key="value.join('|')"
              :value="value"
            >
              {{ label }}
            </option>
            </select>
          </div>
          <div class="icon is-small is-left">
            <svg viewBox="0 0 500 500"><title>rubrique</title><path class="cls-1" d="M477.05,445.08H243.64l116.71-184.7Zm-164.63-37.9h95.85l-47.92-75.85Z"/><path class="cls-1" d="M210.37,447.48H37.4v-173h173ZM75.29,409.58h97.18V312.41H75.29Z"/><path class="cls-1" d="M273,227.44A86.49,86.49,0,1,1,359.44,141,86.59,86.59,0,0,1,273,227.44Zm0-135.07A48.59,48.59,0,1,0,321.55,141,48.64,48.64,0,0,0,273,92.37Z"/></svg>
          </div>
        </div>
      </div>

      <button 
        v-if="paramsOpen"
        key="close"
        name="close"
        class="button is-fullwidth"
        aria-label="Delete the column"
        @click="$emit('close')"
      >
        <span class="icon">
          <svg viewBox="0 0 300 300"><title>delete-blue</title><path class="cls-1" d="M200,269.231,223,84.615H77l23,184.616Zm-3.043-161.616L179.688,246.231H120.312L103.043,107.615Z"/><polygon class="cls-1" points="122.996 15.346 122.996 38.423 77 38.423 77 61.423 223 61.423 223 38.423 176.846 38.423 176.846 15.346 122.996 15.346"/></svg>
        </span>
        <span>{{ $t('column.delete') }}</span>
      </button>

      <div key="move-column" class="move-column">

        <button
          name="move-left"
          aria-label="Move column to left"
          class="btn btn-icon"
          @click="$emit('move', 'left')"
        >
        <svg viewBox="0 0 300 300"><title>navigateleft-blue</title><polygon class="cls-1" points="146.308 236.646 63.687 150.055 146.297 62.936 146.319 30.769 30.769 150.01 146.308 269.231 146.308 236.646"/></svg>
        </button>

        <button
          name="move-right"
          class="btn btn-icon margin-right-auto"
          aria-label="Move column to right"
          @click="$emit('move', 'right')"
        >
          <svg  viewBox="0 0 300 300"><title>navigateright-blue</title><polygon class="cls-1" points="153.78 63.354 236.402 149.945 153.791 237.064 153.77 269.231 269.319 149.99 153.78 30.769 153.78 63.354"/></svg>
        </button>

      </div>

    </transition-group>
  </header>
</template>

<script>
import topicsConfig from '@/config/topics.json'
import SearchInput from '@/components/SearchInput'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'SearchParams',
  components: {
    SearchInput
  },
  props: {
    columnId: {
      type: Number,
      required: true
    },
    columnType: {
      type: String,
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
    product: {
      get () {
        return ['multimedia']
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
      if (this.lang[0] !== undefined) {
        return topicsConfig[this.lang[0]]
      } else {
        return []
      }
    },
    topic: {
      get () {
        return this.params.topics
      },
      set (topics) {
        this.updateParams({ topics })
      }
    },
    topicName () {
      if (this.lang[0] !== undefined) {
        const currentTopic = topicsConfig[this.lang[0]].filter(i => i.value === this.topic)
        if (currentTopic.length > 0) {
          return currentTopic[0].label
        }
      }
      return undefined
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
    },
    toggleFilters () {
      this.paramsOpen = this.paramsOpen ? false : true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

$input-height : 59px;
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
  .actions {
    display: flex;
  }

  &.search-params{
    .header{
      align-items: center;
      background: $light;
      padding: 0 .5rem;
      height: 49px;
      display: flex;
      font-size: 18px;
      font-weight: 600;
      border: 1px solid #dbdbdb;
      border-radius: 0;
      svg{
        height: 22px;
        fill: $dark;
      }

      .icon{
        margin-right: 7px;
      }
      .search-input{
        background: transparent;
        outline: none;
        margin-bottom: 0;
      }

      .settings{
        justify-content: flex-end;
        margin-left: auto;
        cursor: pointer;
        transform: translateY(5px);
      }
    }

    .filters{
      &:focus {
          outline: none;
      }
      .field{
        margin-bottom: 0;
        height: $input-height;
        .control{
          height: $input-height;
          .select{
              height: $input-height;
            &:not(.is-multiple):not(.is-loading)::after {
                border-color: #757575;
                right: 1.125em;
                z-index: 4;
            }
            &:not(.is-multiple):not(.is-loading)::after, .navbar-link:not(.is-arrowless)::after {
              border-width: 2px;
            }
            select{
              color: $primary;
              font-weight: 600;
              height: $input-height;
              border-radius: 0;
            }
          }
          .icon{
            transform: translateY(9px);
            svg{
              height: 22px;
              fill: #757575;
            }
          }
        }
      }
      .button{
        height: $input-height;
        color: $danger;
        font-weight: 600;
        justify-content: left;
        border-radius: 0;
        .icon{
          svg{
            height: 22px;
            fill: $danger;
          }
        }
      }
      .move-column{
        height: $input-height;
        display: flex;
        background: $light;
        border: 1px solid #dbdbdb;
        border-radius: 0;
        padding-left: 5px;
        .btn-icon{
          padding: 5px;
          svg{
            height: 22px;
            fill: #757575;
          }
        }
      }
    }
  }
}
</style>