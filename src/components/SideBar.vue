<template>
  <transition-group
    id="sidebar"
    name="appear"
    tag="nav"
    appear
  >
    <button
      key="new-column"
      name="new-column"
      aria-label="Add new column"
      class="btn btn-circle btn-icon"
      @click="search"
    >
      <i class="UI-icon UI-plus" />
    </button>
    <router-link
      v-if="!isAuthenticated"
      key="authenticate"
      :to="{ name: 'login' }"
      name="authenticate"
      aria-label="Authenticate"
      tag="button"
      class="btn btn-icon btn-circle danger"
    >
      <i class="UI-icon UI-user-male" />
    </router-link>
    <router-link
      key="about"
      :to="{ name: 'about' }"
      name="about"
      aria-label="about"
      class="btn btn-circle btn-icon"
      tag="button"
    >
      <i class="UI-icon UI-heart icon-small" />
    </router-link>
    <button
      key="language"
      name="language"
      aria-label="Change language"
      class="btn btn-circle btn-icon"
      @click="changeLanguage"
    >
      <i class="UI-icon UI-flag icon-small info" />
    </button>
  </transition-group>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

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
    ...mapActions([
      'changeLocale'
    ]),
    search () {
      if (this.$route.name !== 'deck') {
        this.$router.push({ name: 'deck' })
      }
      this.addColumn()
    },
    changeLanguage () {
      if (this.$store.state.locale === 'en') {
        this.changeLocale('fr')
      } else {
        this.changeLocale('en')
      }
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
  position: absolute;
  bottom: 29px;
  right: 24px;

  button {
    margin: 4px;
    i.UI-icon.UI-plus {
      top: -3px;
    }
    i.UI-icon {
      left: 1px;
    }
    &[name="new-column"] {
      display: none;
      @include breakpoint(mobile) {
        display: block;
      }
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
