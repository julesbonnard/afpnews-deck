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
@import "~@afp/toolkit-styles/scss/variables.scss";
@import "@/assets/scss/variables.scss";

main {
  position: relative;
  flex: 1;
  background-color: $background-color;
  background-image: url('~@/assets/img/afp-logo.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 250px auto;
  overflow-x: auto;
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
