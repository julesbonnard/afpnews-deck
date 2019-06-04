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

<script lang="ts">
import Vue from 'vue'
import Column from '@/components/Column.vue'
import AddColumn from '@/components/AddColumn.vue'
import SideBar from '@/components/SideBar.vue'
import autoRefreshVisibility from '@/mixins/autoRefreshVisibility'
import { mapState, mapActions } from 'vuex'

export default Vue.extend({
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
      'authType',
      'columns'
    ])
  },
  watch: {
    authType (newVal, oldVal) {
      if (newVal !== 'credentials' && oldVal === 'credentials') {
        this.$router.push({
          name: 'login',
          query: {
            redirect: this.$route.path
          }
        })
      }
    }
  }
})
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
