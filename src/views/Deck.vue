<template>
  <main>
    <navbar />
    <transition-group
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
import autoRefreshVisibility from '@/mixins/autoRefreshVisibility'
import autoRefreshTimer from '@/mixins/autoRefreshTimer'
import { mapState } from 'vuex'

export default {
  name: 'Deck',
  metaInfo: {
    titleTemplate: titleChunk => titleChunk ? `${titleChunk} | AFP Deck` : 'AFP Deck'
  },
  components: {
    Column,
    AddColumn,
    Navbar
  },
  mixins: [
    autoRefreshVisibility,
    autoRefreshTimer
  ],
  computed: {
    ...mapState([
      'authType',
      'columns'
    ])
  },
  watch: {
    authType (newVal) {
      if (newVal !== 'credentials') {
        this.$router.replace({
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
      margin-top: 12px;
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

@media screen {
  .night-mode main {
    @media screen {
      background-color: $background-color-night;
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
