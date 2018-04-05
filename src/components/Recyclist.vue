<template>
  <div class="vue-recyclist vue-recyclist-scrollable">
    <div
      ref="list"
      :style="{ height: `${height}px` }"
      class="vue-recyclist-items">
      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        :style="{ transform: `translate3d(0,${item.top}px,0)` }"
        class="vue-recyclist-item">
        <div
          :style="{ opacity: +!item.loaded }"
          class="vue-recyclist-transition">
          <slot name="tombstone" />
        </div>
        <div
          :style="{ opacity: +item.loaded }"
          class="vue-recyclist-transition">
          <slot
            :data="item.data"
            :index="index"
            name="item" />
        </div>
      </div>

      <!--get tombstone and item heights from these invisible doms-->
      <div class="vue-recyclist-pool">
        <div
          v-for="(item, index) in items"
          v-if="!item.tomb && !item.gotHeight"
          :key="index"
          :ref="`item${index}`"
          class="vue-recyclist-item vue-recyclist-invisible">
          <slot
            :data="item.data"
            name="item" />
        </div>
        <div
          ref="tomb"
          class="vue-recyclist-item vue-recyclist-invisible">
          <slot name="tombstone" />
        </div>
      </div>
    </div>

    <div
      :style="{ visibility: isLoading ? 'visible' : 'hidden' }"
      class="vue-recyclist-loading">
      <slot name="spinner">
        <div class="vue-recyclist-loading-content">
          Loading...
        </div>
      </slot>
    </div>

    <div
      v-show="!isLoading"
      class="vue-recyclist-nomore">
      <slot name="nomore">
        <div>End of list</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
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
    loadMore: {
      type: Function,
      required: true // The function of loading more items.
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      name: 'Recyclist',
      items: [], // Wrapped full list items
      height: 0, // Full list height
      start: 0, // Visible items start index
      loadings: 0
    }
  },
  computed: {
    visibleItems () {
      return this.items.slice(Math.max(0, this.start - this.size), Math.min(this.items.length, this.start + this.size))
    },
    containerHeight () {
      return (this.$el && this.$el.offsetHeight) || 0
    },
    tombHeight () {
      return this.$refs.tomb && this.$refs.tomb.offsetHeight
    }
  },
  mounted () {
    this.$el.addEventListener('scroll', this.onScroll)
    this.init()
  },
  destroyed () {
    this.$el.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    init () {
      this.reset()
      this.loadItems()
    },
    reset () {
      this.items = []
      this.height = this.start = 0
      this.$el.scrollTop = 0
    },
    async addLoading (loadingIndex) {
      try {
        await this.loadMore()
        const newItems = this.items.filter(item => item.loadingIndex === loadingIndex)
        newItems.forEach(item => {
          this.setItem(item.index, this.list[item.index], loadingIndex)
        })
        await this.$nextTick()
        newItems.forEach(item => {
          this.updateItemHeight(item.index)
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.items = this.items.filter(item => item.loaded === true)
        this.updateItemTop()
      }
    },
    async loadItems () {
      const loadingIndex = this.loadings++
      let loads = []
      let end = this.items.length + this.size
      for (let i = this.items.length; i < end; i++) {
        this.setItem(i, null, loadingIndex)
        // update newly added items position
        loads.push(i)
      }
      // update items top and full list height
      await this.$nextTick()
      this.updateItemTop(loadingIndex)

      this.addLoading(loadingIndex)
    },
    setItem (index, data, loadingIndex) {
      this.$set(this.items, index, {
        index,
        data: data || {},
        height: this.tombHeight,
        top: -1000,
        tomb: !data,
        loaded: !!data,
        loadingIndex,
        gotHeight: false
      })
    },
    updateItemHeight (index) {
      // update item height
      let cur = this.items[index]
      let dom = this.$refs[`item${index}`]
      if (dom) {
        cur.height = dom[0].offsetHeight
        cur.gotHeight = true
      }
    },
    updateItemTop () {
      // loop all items to update item top and list height
      this.height = 0
      for (let i = 0; i < this.items.length; i++) {
        let pre = this.items[i - 1]
        this.items[i].top = pre ? pre.top + pre.height : 0
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
    onScroll () {
      if (this.$el.scrollTop + this.$el.offsetHeight > this.height - this.offset) {
        this.loadItems()
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
    &.vue-recyclist-scrollable {
      -webkit-overflow-scrolling: touch;
    }
    .vue-recyclist-items {
      position: relative;
      margin: 0;
      padding: 0;
      min-height: 100%;
      .vue-recyclist-invisible {
        top: -1000px;
        visibility: hidden;
      }
      .vue-recyclist-item {
        position: absolute;
        width: 100%;
        .vue-recyclist-transition {
          position: absolute;
          opacity: 0;
          transition-property: opacity;
          transition-duration: $duration;
        }
      }
    }
    .vue-recyclist-loading {
      overflow: hidden;
      .vue-recyclist-loading-content {
        width: 100%;
        text-align: center;
        .spinner {
          margin: 10px auto;
          width: 20px;
          height: 20px;
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
