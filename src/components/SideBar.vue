<template>
  <transition-group
    id="sidebar"
    name="appear"
    tag="nav"
    appear>
    <button
      key="new-column"
      name="new-column"
      aria-label="Add new column"
      class="btn btn-circle btn-icon"
      @click="search">
      <i class="UI-icon UI-plus" />
    </button>
    <router-link
      v-if="!isAuthenticated"
      key="authenticate"
      :to="{ name: 'login' }"
      name="authenticate"
      aria-label="Authenticate"
      tag="button"
      class="btn btn-icon btn-circle danger">
      <i class="UI-icon UI-user-male" />
    </router-link>
    <router-link
      key="about"
      :to="{ name: 'about' }"
      name="about"
      aria-label="about"
      class="btn btn-circle btn-icon"
      tag="button">
      <i class="UI-icon UI-heart icon-small" />
    </router-link>
  </transition-group>
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
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  z-index: 4;
  position: absolute;
  bottom: 16px;
  right: 24px;

  button {
    margin: 4px;
    i.UI-icon.UI-plus {
      top: -3px;
    }
    i.UI-icon {
      left: 1px;
    }
  }
}

.appear-enter, .appear-leave-to {
  opacity: 0;
  transform: scale(0);
}
.appear-enter-active, .appear-leave-active {
  transition: transform 0.2s;
}
.appear-enter-to, .appear-leave {
  opacity: 1;
  transform: scale(1);
}

@media print {
  #sidebar {
    display: none;
  }
}
</style>
