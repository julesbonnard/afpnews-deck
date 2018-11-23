<!-- Inspired by vue-recyclist from xtongs (https://github.com/xtongs/vue-recyclist) -->
<template>
  <div class="vue-recyclist">
    <div
      ref="list"
      :style="{ height: `${height}px` }"
      class="vue-recyclist-items">
      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        :style="{
          transform: `translate3d(0,${item.top}px,0)`
        }"
        class="vue-recyclist-item">
        <slot
          v-if="isLoading && !item.data"
          name="tombstone" />
        <slot
          v-else
          :data="item.data"
          name="item" />
      </div>

      <!--get tombstone and item heights from these invisible doms-->
      <div class="vue-recyclist-pool">
        <div
          v-for="(item, index) in poolItems"
          :key="index"
          :ref="item.data.type || item.data"
          class="vue-recyclist-item">
          <slot
            :data="item.data"
            name="item" />
        </div>
        <div
          v-if="tombHeight === 0"
          ref="tomb"
          class="vue-recyclist-item">
          <slot name="tombstone" />
        </div>
      </div>
    </div>

    <div
      v-if="!isLoading && noMore"
      class="vue-recyclist-nomore">
      <slot name="nomore">
        <div>End of list</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Recyclist',
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
    }
  },
  data () {
    return {
      items: [], // Wrapped full list items
      height: 0, // Full list height
      heights: {},
      start: 0, // Visible items start index
      containerHeight: 0,
      tombHeight: 0
    }
  },
  computed: {
    visibleItems () {
      return this.items.slice(Math.max(0, this.start - this.size), Math.min(this.items.length, this.start + this.size))
    },
    poolItems () {
      return this.items.filter(d => d.data && d.gotHeight === false)
    }
  },
  watch: {
    start (newVal, oldVal) {
      if (newVal === 0 && oldVal > newVal) {
        this.$emit('loadTop')
      }
    },
    list () {
      this.loadList()
    }
  },
  async mounted () {
    this.$el.addEventListener('scroll', this.onScroll, { capture: true, passive: true })
    this.tombHeight = this.$refs.tomb && this.$refs.tomb.offsetHeight
    this.containerHeight = (this.$el && this.$el.offsetHeight) || 0
    if (this.list.length > 0) {
      this.loadList()
    } else {
      this.loadMoreItems()
    }
  },
  destroyed () {
    this.$el.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    async reset () {
      this.items = []
      this.height = this.start = this.$el.scrollTop = 0
      this.heights = {}
      await this.$nextTick()
      this.loadMoreItems()
    },
    async loadList () {
      this.items = this.list.map(this.renderItem)

      await this.$nextTick()

      for (let i = 0; i < this.items.length; i++) {
        this.updateItemHeight(i)
      }

      this.updateItemTop()
    },
    async loadMoreItems () {
      if (this.noMore) return false
      let end = this.items.length + this.size
      for (let i = this.items.length; i < end; i++) {
        this.setItem(i, null)
      }

      this.updateItemTop()

      // Load elements
      this.$emit('load-bottom')
    },
    setItem (index, data) {
      this.$set(this.items, index, this.renderItem(data))
    },
    renderItem (data) {
      return {
        data,
        top: 0,
        height: this.heights[data] || this.tombHeight,
        gotHeight: this.heights[data] !== undefined
      }
    },
    updateItemTop () {
      // loop all items to update item top and list height
      this.height = 0
      for (let i = 0; i < this.items.length; i++) {
        let pre = this.items[i - 1]
        this.$set(this.items[i], 'top', pre ? pre.top + pre.height : 0)
        this.height += this.items[i].height
      }
      this.updateIndex()
    },
    updateIndex () {
      // update visible items start index
      let top = this.$el.scrollTop
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].top > top) {
          this.start = Math.max(0, i - 1)
          break
        }
      }
    },
    async updateItemHeight (index) {
      // update item height
      let cur = this.items[index]
      let dom = this.$refs[(cur.data && cur.data.type) || cur.data]
      if (dom && dom[0]) {
        this.$set(this.items[index], 'height', dom[0].offsetHeight)
        this.$set(this.items[index], 'gotHeight', true)
        this.$set(this.heights, (cur.data && cur.data.type) || cur.data, cur.height)
      }
    },
    onScroll () {
      if (this.$el.scrollTop + this.$el.offsetHeight > this.height - this.offset) {
        this.loadMoreItems()
      }
      this.updateIndex()
    }
  }
}
</script>

<style lang="scss" scoped>
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
      position: absolute;
      width: 100%;
      button {
        margin-bottom: 12px;
      }
    }
    .vue-recyclist-pool {
      .vue-recyclist-item {
        visibility: hidden;
      }
    }
  }
  .vue-recyclist-nomore {
    overflow: hidden;
    margin: 10px auto;
    height: 20px;
    text-align: center;
  }
}
</style>
