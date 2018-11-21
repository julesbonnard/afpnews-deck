<template>
  <nav id="sidebar">
    <button
      name="new-column"
      aria-label="Add new column"
      class="btn btn-large btn-icon"
      @click="search">
      <i class="UI-icon UI-search" />
    </button>
    <router-link
      :class="{ success: isAuthenticated, danger: !isAuthenticated }"
      :to="{ name: 'login' }"
      name="authenticate"
      aria-label="Authenticate"
      tag="button"
      class="btn btn-large btn-icon">
      <i class="UI-icon UI-user-male" />
    </router-link>
    <router-link
      :to="{ name: 'about' }"
      name="about"
      aria-label="about"
      class="btn btn-large btn-icon"
      tag="button">
      <i class="UI-icon UI-heart" />
    </router-link>
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SideBar',
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapMutations([
      'addColumn'
    ]),
    search () {
      if (this.$route.name !== 'deck') {
        this.$router.push({ name: 'deck' })
      }
      this.addColumn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

#sidebar {
  width: $sidebar-size;
  z-index: 5;
  background-color: $background-color;
  padding-left: 12px;

  @include breakpoint(mobile) {
    display: flex;
    flex-direction: row-reverse;
    width: auto;
    height: $sidebar-size;
    padding-left: 0px;
  }
}

@media print {
  #sidebar {
    display: none;
  }
}
</style>
