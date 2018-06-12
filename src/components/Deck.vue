<template>
  <main id="deck">
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
#deck {
  position: relative;
  background-color: #E1E8ED;
  background-image: url('~@/assets/img/afp-logo.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 250px auto;
  display: flex;
  overflow-x: auto;
}
</style>
