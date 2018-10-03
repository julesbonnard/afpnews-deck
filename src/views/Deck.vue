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
import { mapState } from 'vuex'

export default {
  name: 'Deck',
  beforeRouteUpdate (to, from, next) {
    if (to.name !== 'tour' && from && from.name === 'login' && this.$store.state.wantTour === true) {
      return next({ name: 'tour' })
    }
    next()
  },
  components: {
    Column
  },
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
  flex: 1;
  background-color: $background-color;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: auto;
  #columns {
    height: 100%;
    display: flex;
  }
}

.list-leave-to {
  transform: translate(0% ,-100%);
}
.list-leave-active, .list-move {
  transition: transform 0.5s;
}
</style>
