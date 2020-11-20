<template>
  <main>
    <navbar/>
    <shortcuts/>
    <transition-group
      id="columns"
      name="list"
      tag="div"
      v-if="isAuthenticated"
    >
      <column
        v-for="(column, i) in columns"
        :key="`column-${column.id}`"
        :column-id="i"
        :columnType="column.type"
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
import Navbar from '@/components/Navbar.vue'
import Shortcuts from '@/components/Shortcuts.vue'
import AddColumn from '@/components/AddColumn.vue'
import SideBar from '@/components/SideBar.vue'
import autoRefreshVisibility from '@/mixins/autoRefreshVisibility'
import autoRefreshTimer from '@/mixins/autoRefreshTimer'
import { mapState, mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'Deck',
  metaInfo: {
    titleTemplate: titleChunk => titleChunk ? `${titleChunk} | AFP Deck` : 'AFP Deck'
  },
  components: {
    Column,
    AddColumn,
    SideBar,
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
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

main {
  padding-top: 4rem;

  @media screen {
    background-color: $background-color;
    height: 100%;
    overflow-x: scroll;
    overflow-y: hidden;

    #columns {
      -webkit-overflow-scrolling: touch;
      touch-action: auto;
      height: 100%;
      padding-left: 2rem;
      padding-right: 2rem;
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

@media screen {
  .night-mode main {
    @media screen {
      background-color: $background-color-night;
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
