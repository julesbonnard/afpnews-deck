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
          :key="`doc-${index}`"
          class="vue-recyclist-item"
        >
          <slot
            :data="item.data"
            name="item"
          />
        </div>
        <div
          v-for="(_, index) in tombstone"
          v-show="isLoading"
          :key="`tombstone-${index}`"
          class="vue-recyclist-tombstone"
        >
          <slot name="tombstone" />
        </div>
      </div>
      <intersect
        :root-margin="`${offset}px`"
        @enter="$emit('load-bottom')"
      >
        <div
          v-show="!noMore"
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
    },
    tombstone () {
      return new Array(this.size)
    },
    items () {
      return this.list.map(this.renderItem)
    }
  },
  watch: {
    displayed (value) {
      if (value) {
        this.$emit('load-top')
      }
    }
  },
  methods: {
    ...mapMutations([
      'updateColumnDisplayed'
    ]),
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
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  contain: strict;
  
  .vue-recyclist-items {
    position: relative;
    .vue-recyclist-item {
      width: 100%;
      content-visibility: 'auto';
      contain-intrinsic-size: '290px';
    }
    .vue-recyclist-tombstone {
      width: 100%;
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
.night-mode {
  .vue-recyclist-nomore {
    color: #aaa;
  }
}
</style>
