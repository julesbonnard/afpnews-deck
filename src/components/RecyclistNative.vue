<template>
  <intersect
    @enter="displayed = true"
    @leave="displayed = false"
  >
    <div class="vue-recyclist">
      <div
        ref="list"
        class="vue-recyclist-items"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="vue-recyclist-item"
        >
          <slot
            v-if="!item.data"
            name="tombstone"
          />
          <slot
            v-else
            :data="item.data"
            name="item"
          />
        </div>
      </div>
      <intersect
        :root-margin="`${offset}px`"
        @enter="loadMoreItems"
      >
        <div
          v-show="!isLoading && !noMore && displayed"
          class="scroll-bottom-detection"
        >
          Loading...
        </div>
      </intersect>
      <div
        v-if="!isLoading && noMore"
        class="vue-recyclist-nomore"
      >
        <slot name="nomore">
          <div>End of list</div>
        </slot>
      </div>
    </div>
  </intersect>
</template>

<script>
import Intersect from 'vue-intersect'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'RecyclistNative',
  components: { Intersect },
  props: {
    list: {
      type: Array,
      required: true
    },
    size: {
      type: Number,
      default: 20 // The number of items added each time.
    },
    offset: {
      type: Number,
      default: 200 // The number of pixels of additional length to allow scrolling to.
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    noMore: {
      type: Boolean,
      default: false
    },
    columnId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      items: [] // Wrapped full list items
    }
  },
  computed: {
    ...mapGetters([
      'getColumnByIndex'
    ]),
    displayed: {
      get () {
        return this.getColumnByIndex(this.columnId).displayed
      },
      set (displayed) {
        this.updateColumnDisplayed({ indexCol: this.columnId, displayed })
      }
    }
  },
  watch: {
    // start (newVal, oldVal) {
    //   if (newVal === 0 && oldVal > newVal) {
    //     this.$emit('load-top')
    //   }
    // },
    list () {
      this.loadList()
    },
    displayed (newVal) {
      if (newVal) {
        this.loadList()
      }
    }
  },
  mounted () {
    if (this.list.length > 0 && this.displayed) {
      this.loadList()
    }
  },
  methods: {
    ...mapMutations([
      'updateColumnDisplayed'
    ]),
    async reset () {
      this.items = []
      this.loadMoreItems()
    },
    async loadList () {
      this.items = this.list.map(this.renderItem)
    },
    async loadMoreItems () {
      if (this.noMore) return false
      const end = this.items.length + this.size
      for (let i = this.items.length; i < end; i++) {
        this.setItem(i, null)
      }
      this.$emit('load-bottom')
    },
    setItem (index, data) {
      this.$set(this.items, index, this.renderItem(data))
    },
    renderItem (data) {
      return {
        data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
$duration: 500ms;
.vue-recyclist {
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  contain: strict;
  -webkit-overflow-scrolling: touch;
  
  .vue-recyclist-items {
    position: relative;
    .vue-recyclist-item {
      width: 100%;
    }
    .vue-recyclist-pool {
      .vue-recyclist-item {
        content-visibility: 'auto';
        contain-intrinsic-size: '290px';
      }
    }
  }
  .vue-recyclist-nomore {
    overflow: hidden;
    margin: 10px auto;
    height: 20px;
    text-align: center;
  }
  /* width */
  &::-webkit-scrollbar {
    width: 0.3em;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: darken($background-color, 5);
    border-radius: 4px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: darken($background-color, 15);
  }
}
</style>
