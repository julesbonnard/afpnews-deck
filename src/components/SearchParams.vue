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
    topics () {
      if ((this.product[0] === 'news' || this.product[0] === 'multimedia') && this.lang[0] === 'fr') {
        return [
          {
            label: this.$t('topics.all', 'fr'),
            value: []
          },
          {
            label: this.$t('topics.a-la-une', 'fr'),
            value: ['La une'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.derniere-minute', 'fr'),
            value: ['Dernière Minute'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.documentation', 'fr'),
            value: ['Documentation'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.monde', 'fr'),
            value: ['Monde'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.afrique', 'fr'),
            value: ['Afrique'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.politique', 'fr'),
            value: ['Politique'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.elections', 'fr'),
            value: ['Elections'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.faits-divers', 'fr'),
            value: ['Faits-divers'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.economie', 'fr'),
            value: ['Economie/Finances', 'service-eco-fr']
          },
          {
            label: this.$t('topics.environnement', 'fr'),
            value: ['Environnement/Météo', 'Environnement'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.sport', 'fr'),
            value: ['Sport'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.football', 'fr'),
            value: ['Football'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.people', 'fr'),
            value: ['People'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.tech', 'fr'),
            value: ['High Tech'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.sciences', 'fr'),
            value: ['Sciences'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.insolite', 'fr'),
            value: ['Insolite'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.medias', 'fr'),
            value: ['Médias'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.sante', 'fr'),
            value: ['Médecine/Santé'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.mode-de-vie', 'fr'),
            value: ['Société/Modes de vie'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.art-de-vivre', 'fr'),
            value: ['Culture/Art de vivre'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.galerie-photos', 'fr'),
            value: ['Galerie Photos'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.galerie-photos-insolites', 'fr'),
            value: ['Galerie Photos Insolites'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.videographies', 'fr'),
            value: ['Vidéographies'],
            disabled: this.product[0] === 'news'
          },
          {
            label: this.$t('topics.videos-monde', 'fr'),
            value: ['Vidéos Monde'],
            disabled: this.product[0] === 'news'
          }
        ]
      }
      if (this.product[0] === 'multimedia' && this.lang[0] === 'en') {
        return [
          {
            label: this.$t('topics.all', 'en'),
            value: []
          },
          {
            label: this.$t('topics.a-la-une', 'en'),
            value: ['Top Stories']
          },
          {
            label: this.$t('topics.derniere-minute', 'en'),
            value: ['Breaking News']
          },
          {
            label: this.$t('topics.documentation', 'en'),
            value: ['Doc']
          },
          {
            label: this.$t('topics.monde', 'en'),
            value: ['International News']
          },
          {
            label: this.$t('topics.us-news', 'en'),
            value: ['US News']
          },
          {
            label: this.$t('topics.us-politics'),
            value: ['US Politics']
          },
          {
            label: this.$t('topics.us-sports'),
            value: ['US Sports']
          },
          {
            label: this.$t('topics.uk-news'),
            value: ['UK News']
          },
          {
            label: this.$t('topics.middle-east', 'en'),
            value: ['Middle East']
          },
          {
            label: this.$t('topics.south-asia-news', 'en'),
            value: ['South Asia News']
          },
          {
            label: this.$t('topics.asia-business', 'en'),
            value: ['Asia Business']
          },
          {
            label: this.$t('topics.business-tech', 'en'),
            value: ['Business and Tech']
          },
          {
            label: this.$t('topics.science-environment', 'en'),
            value: ['Science-Environment']
          },
          {
            label: this.$t('topics.offbeat', 'en'),
            value: ['Offbeat']
          },
          {
            label: this.$t('topics.health-lifestyle', 'en'),
            value: ['Health and Lifestyle']
          },
          {
            label: this.$t('topics.sport', 'en'),
            value: ['Sports']
          },
          {
            label: this.$t('topics.cricket', 'en'),
            value: ['Cricket']
          },
          {
            label: this.$t('topics.football', 'en'),
            value: ['Football']
          },
          {
            label: this.$t('topics.olympics', 'en'),
            value: ['Olympics']
          },
          {
            label: this.$t('topics.people', 'en'),
            value: ['People and Entertainment']
          },
          {
            label: this.$t('topics.lifestyle', 'en'),
            value: ['Lifestyle']
          },
          {
            label: this.$t('topics.photo-gallery', 'en'),
            value: ['Photo Gallery']
          },
          {
            label: this.$t('topics.videographics', 'en'),
            value: ['Videographics']
          },
          {
            label: this.$t('topics.video-gallery', 'en'),
            value: ['Video Gallery Complete']
          }
        ]
      }
      return [
        {
          label: this.$t('topics.all'),
          value: []
        }
      ]
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
