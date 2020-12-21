<template>
  <div class="vue-recyclist">
    <div
      ref="list"
      :style="{ height: `${height}px` }"
      class="vue-recyclist-items"
    >
      <div
        v-for="(item, index) in visibleItems"
        v-show="height > 0"
        :key="index"
        :style="{
          transform: `translate3d(0,${item.top}px,0)`
        }"
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

      <!--get tombstone and item heights from these invisible doms-->
      <div class="vue-recyclist-pool">
        <div
          v-for="(item, index) in poolItems"
          :key="index"
          :ref="item.data"
          class="vue-recyclist-item"
        >
          <slot
            :data="item.data"
            name="item"
          />
        </div>
        <div
          v-if="tombHeight === 0"
          ref="tomb"
          class="vue-recyclist-item"
        >
          <slot name="tombstone" />
        </div>
      </div>
    </div>

    <div
      v-if="!isLoading && noMore"
      class="vue-recyclist-nomore"
    >
      <slot name="nomore">
        <div>End of list</div>
      </slot>
    </div>
  </div>
</template>

<script>
// import waitForFonts from '@/plugins/waitForFonts'

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
        this.$emit('load-top')
      }
    },
    list () {
      this.loadList()
    },
    noMore (newVal) {
      if (newVal === true) {
        this.items = this.items.filter(d => d.data)
        this.updateItemTop()
      }
    }
  },
  mounted () {
    this.$el.addEventListener('scroll', this.onScroll, { capture: true, passive: true })
    this.tombHeight = this.$refs.tomb && this.$refs.tomb.offsetHeight
    this.containerHeight = this.$el && this.$el.offsetHeight
    if (this.list.length > 0) {
      this.loadList()
      if (this.list.length < this.size) {
        this.loadMoreItems()
      }
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
      await this.$nextTick()
      this.loadMoreItems()
    },
    async loadList () {
      this.items = this.list.map(this.renderItem)

      // await waitForFonts()
      await this.$nextTick()

      for (let i = 0; i < this.items.length; i++) {
        this.updateItemHeight(i)
      }

      this.updateItemTop()
    },
    async loadMoreItems () {
      if (this.noMore) return false
      const end = this.items.length + this.size
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
        height: this.tombHeight,
        gotHeight: false
      }
    },
    updateItemTop () {
      // loop all items to update item top and list height
      this.height = 0
      for (let i = 0; i < this.items.length; i++) {
        const pre = this.items[i - 1]
        this.$set(this.items[i], 'top', pre ? pre.top + pre.height : 0)
        this.height += this.items[i].height
      }
      this.updateIndex()
    },
    updateIndex () {
      // update visible items start index
      const top = this.$el.scrollTop
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].top > top) {
          this.start = Math.max(0, i - 1)
          break
        }
      }
    },
    updateItemHeight (index) {
      // update item height
      const cur = this.items[index]
      if (!cur.data) return
      const [el] = this.$refs[cur.data]
      if (el) {
        this.$set(this.items[index], 'height', el.offsetHeight)
        this.$set(this.items[index], 'gotHeight', el.offsetHeight > 0)
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
