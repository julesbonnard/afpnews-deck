<template>
  <main>
    <navbar />
    <shortcuts />
    <transition-group
      v-if="isAuthenticated"
      id="columns"
      name="list"
      tag="div"
    >
      <column
        v-for="(column, i) in columns"
        :key="`column-${column.id}`"
        :column-id="i"
        :column-type="column.type"
      />
      <add-column key="add-column" />
    </transition-group>
    <router-view />
  </main>
</template>

<script>
import Column from '@/components/Column.vue'
import AddColumn from '@/components/AddColumn.vue'
import Navbar from '@/components/Navbar.vue'
import Shortcuts from '@/components/Shortcuts.vue'
import autoRefreshVisibility from '@/mixins/autoRefreshVisibility'
import autoRefreshTimer from '@/mixins/autoRefreshTimer'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Deck',
  metaInfo: {
    titleTemplate: titleChunk => titleChunk ? `${titleChunk} | AFP Stories` : 'AFP Stories'
  },
  components: {
    Column,
    AddColumn,
    Navbar,
    Shortcuts
  },
  mixins: [
    autoRefreshVisibility,
    autoRefreshTimer
  ],
  computed: {
    ...mapState([
      'authType',
      'columns'
    ]),
    ...mapGetters([
    'isAuthenticated'
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
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

main {
  @media screen {
    background-color: $background-color;
    display: flex;
    height: 100%;
    flex-direction: column;

    #columns {
      -webkit-overflow-scrolling: touch;
      touch-action: auto;
      flex-grow: 1;
      padding-left: 2rem;
      padding-right: 2rem;
      display: flex;
      user-select: none;
      scroll-snap-type: x mandatory;
      overflow-x: scroll;
      overflow-y: hidden;
    }
  }
  @media print {
    #columns {
      display: none;
    }
  }
}

// .list-leave-to {
//   transform: translate(0%, -100%);
// }
.list-leave-active, .list-move {
  transition: transform 0.5s;
}
</style>
