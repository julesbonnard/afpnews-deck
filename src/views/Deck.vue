<template>
  <main>
    <transition-group
      id="columns"
      name="list"
      tag="div">
      <column
        v-for="(column, i) in columns"
        :key="`column-${column.id}`"
        :column-id="i" />
    </transition-group>
    <router-view />
  </main>
</template>

<script>
import Column from '@/components/Column'
import autoRefresh from '@/mixins/autoRefresh'
import { mapState } from 'vuex'

export default {
  name: 'Deck',
  metaInfo: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | AFP Deck` : 'AFP Deck'
    }
  },
  components: {
    Column
  },
  mixins: [
    autoRefresh
  ],
  computed: {
    ...mapState([
      'columns'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

main {
  @media screen {
    flex: 1;
    background-color: $background-color;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    touch-action: auto;
    height: 100%;
    #columns {
      height: 100%;
      display: flex;
      user-select: none;
    }
  }
  @media print {
    #columns {
      display: none;
    }
  }
}

.list-leave-to {
  transform: translate(0% ,-100%);
}
.list-leave-active, .list-move {
  transition: transform 0.5s;
}
</style>
