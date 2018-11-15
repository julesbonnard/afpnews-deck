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
          v-if="+!item.loaded"
          name="tombstone" />
        <slot
          v-else
          :data="item.data"
          name="item" />
      </div>

      <!--get tombstone and item heights from these invisible doms-->
      <div class="vue-recyclist-pool">
        <div
          v-for="(item, index) in items"
          v-if="!item.tomb && !item.gotHeight"
          :key="index"
          :ref="`item${index}`"
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
    fetchBottom: {
      type: Function,
      required: true // The function of loading more items to the end of the list.
    },
    fetchTop: {
      type: Function,
      required: true // The function of loading more items to the beginning of the list.
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [], // Wrapped full list items
      height: 0, // Full list height
      start: 0, // Visible items start index
      loadings: 0,
      noMore: false,
      containerHeight: 0,
      tombHeight: 0
    }
  },
  computed: {
    visibleItems () {
      return this.items.slice(Math.max(0, this.start - this.size), Math.min(this.items.length, this.start + this.size))
    }
  },
  watch: {
    start (newVal, oldVal) {
      if (newVal === 0 && oldVal > newVal) {
        this.loadTop()
      }
    },
    async list (newVal, oldVal) {
      if (newVal.length === 0) {
        return
      }
      if (newVal[0] !== oldVal[0]) {
        if (newVal.length > oldVal.length && oldVal.length > 0) {
          const newItems = []
          newVal.some((d, index) => {
            newItems.push(this.renderItem(index, d, null))
            return oldVal.find(e => e === d) !== null
          })

          this.items = [...newItems, ...this.items].map((d, index) => ({
            ...d,
            index
          }))

          await this.$nextTick()
          for (let i = 0; i < newItems.length; i++) {
            this.updateItemHeight(i)
          }

          this.updateItemTop()
          this.updateIndex()
        } else {
          this.height = this.start = this.$el.scrollTop = 0
          this.items = newVal.map((d, index) => this.renderItem(index, d, null))
          await this.$nextTick()
          for (let i = 0; i < newVal.length; i++) {
            this.updateItemHeight(i)
          }

          this.updateItemTop()
          this.updateIndex()

          if (this.items.length < this.size) {
            this.loadMoreItems()
          }
        }
      }
    }
  },
  async mounted () {
    this.$el.addEventListener('scroll', this.onScroll, { capture: true, passive: true })
    this.tombHeight = this.$refs.tomb && this.$refs.tomb.offsetHeight
    this.containerHeight = (this.$el && this.$el.offsetHeight) || 0
    if (this.list.length === 0) {
      this.loadMoreItems()
    } else {
      this.items = this.list.map((d, index) => this.renderItem(index, d, null))
      await this.$nextTick()
      for (let i = 0; i < this.list.length; i++) {
        this.updateItemHeight(i)
      }

      this.updateItemTop()
      this.updateIndex()

      if (this.items.length < this.size) {
        this.loadMoreItems()
      }
    }
  },
  destroyed () {
    this.$el.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    init () {
      this.reset()
      this.loadMoreItems()
    },
    reset () {
      this.noMore = false
      this.items = []
      this.height = this.start = this.$el.scrollTop = 0
    },
    async loadMoreItems () {
      if (this.noMore === true) {
        return false
      }
      // Increment the loadings counter
      const loadingIndex = this.loadings++

      // Insert temporary elements
      let loads = []
      let end = this.items.length + this.size
      for (let i = this.items.length; i < end; i++) {
        this.setItem(i, null, loadingIndex)
        loads.push(i)
      }

      await this.$nextTick()
      this.updateItemTop()

      // Load elements
      this.loadBottom(loadingIndex)
    },
    setItem (index, data, loadingIndex) {
      this.$set(this.items, index, this.renderItem(index, data, loadingIndex))
    },
    renderItem (index, data, loadingIndex) {
      return {
        index,
        data: data || {},
        height: this.tombHeight,
        tomb: !data,
        loaded: !!data,
        loadingIndex,
        gotHeight: false
      }
    },
    updateItemTop () {
      // loop all items to update item top and list height
      let height = 0
      for (let i = 0; i < this.items.length; i++) {
        let pre = this.items[i - 1]
        this.items[i].top = pre ? pre.top + pre.height : 0
        height += this.items[i].height
      }
      this.height = height
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
    async loadBottom (loadingIndex) {
      const newDocsFound = await this.fetchBottom()
      if (newDocsFound === false) {
        this.noMore = true
      }
      const newItems = this.items.filter(item => item.loadingIndex === loadingIndex)
      newItems.forEach(item => {
        this.setItem(item.index, this.list[item.index], loadingIndex)
      })
      await this.$nextTick()
      newItems.forEach(item => {
        this.updateItemHeight(item.index)
      })
      this.items = this.items.filter(item => {
        if (item.loadingIndex === loadingIndex && item.loaded === false) return false
        return true
      })
      this.updateItemTop()
    },
    updateItemHeight (index) {
      // update item height
      let cur = this.items[index]
      let dom = this.$refs[`item${index}`]
      if (dom && dom[0]) {
        cur.height = dom[0].offsetHeight
        cur.gotHeight = true
      }
    },
    async loadTop () {
      await this.fetchTop()
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
