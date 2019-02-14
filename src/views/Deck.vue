<template>
  <main>
    <transition-group
      id="columns"
      name="list"
      tag="div"
    >
      <column
        v-for="(column, i) in columns"
        :key="`column-${column.id}`"
        :column-id="i"
      />
      <add-column key="add-column" />
    </transition-group>
    <side-bar />
    <router-view />
  </main>
</template>

<script>
import Column from '@/components/Column'
import AddColumn from '@/components/AddColumn'
import SideBar from '@/components/SideBar'
import autoRefreshVisibility from '@/mixins/autoRefreshVisibility'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Deck',
  metaInfo: {
    titleTemplate: titleChunk => titleChunk ? `${titleChunk} | AFP Deck` : 'AFP Deck'
  },
  components: {
    Column,
    AddColumn,
    SideBar
  },
  mixins: [
    autoRefreshVisibility
  ],
  computed: {
    ...mapState([
      'columns'
    ])
  },
  mounted () {
    this.refreshAllColumns()
  },
  methods: {
    ...mapActions([
      'refreshAllColumns'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

main {
  @media screen {
    background-color: $background-color;
    height: 100%;

    #columns {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      touch-action: auto;
      height: 100%;
      display: flex;
      user-select: none;
      scroll-snap-type: x mandatory;
    }
  }
  @media print {
    #columns {
      display: none;
    }
  }
}

.list-leave-to {
  transform: translate(0%, -100%);
}
.list-leave-active, .list-move {
  transition: transform 0.5s;
}
</style>
