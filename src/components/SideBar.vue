<template>
  <nav id="sidebar">
    <button
      name="search"
      aria-label="search"
      data-v-step="new"
      @click="search">
      <i class="UI-icon UI-search" />
    </button>
    <router-link
      :class="{ success: isAuthenticated, error: !isAuthenticated }"
      :to="{ name: 'login' }"
      name="authenticate"
      aria-label="authenticate"
      tag="button"
      data-v-step="authenticate">
      <i class="UI-icon UI-user-male" />
    </router-link>
    <router-link
      :to="{ name: 'about' }"
      name="about"
      aria-label="about"
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
    async search () {
      if (this.$route.name !== 'deck') {
        this.$router.push({ name: 'deck' })
      }
      this.addColumn()
      await this.$nextTick()
      document.querySelector('.column:last-child').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

#sidebar {
  width: $sidebar-size;
  z-index: 5;
  @include breakpoint(mobile) {
    display: flex;
    flex-direction: row-reverse;
    width: auto;
    height: $sidebar-size;
  }
  background-color: $primary-color;

  button {
    display: block;
    width: calc(100% - 10px);
    color: $secondary-color;
    border: 1px solid $secondary-color;
    background-color: transparent;
    padding: 10px 12px;
    margin: 5px;
  }
}

@media print {
  #sidebar {
    display: none;
  }
}
</style>
