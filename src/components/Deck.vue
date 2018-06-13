<template>
  <main>
    <column
      v-for="(column, i) in columns"
      :key="`column-${i}`"
      :column-id="i" />
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
  display: flex;
  overflow-x: auto;
  background-color: $background-color;
  background-image: url('~@/assets/img/afp-logo.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 250px auto;
}
</style>
