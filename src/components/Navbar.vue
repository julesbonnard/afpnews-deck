<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item"
        href="#"
      >
        <img
          alt="AFP Deck"
          src="@/assets/img/afpdeck_logo.png"
          width="42"
          height="42"
        >
      </a>

      <a
        role="button"
        :class="{
          'is-active': showMobileMenu
        }"
        class="navbar-burger burger"
        aria-hidden="true"
        @click="showMobileMenu = !showMobileMenu"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      :class="{
        'is-active': showMobileMenu
      }"
      class="navbar-menu"
    >
      <div
        class="navbar-end"
      >
        <router-link
          key="about"
          :to="{ name: 'about' }"
          class="navbar-item"
          name="about"
          aria-label="about"
        >
          <icon-base
            icon-name="about"
            :width="24"
            :height="24"
          >
            <icon-about />
          </icon-base>
          {{ $t("about.name") }}
        </router-link>

        <a
          class="navbar-item"
          aria-label="Log out"
          @click.prevent="logoutHandler"
        >
          <icon-base
            icon-name="logout"
          >
            <icon-logout />
          </icon-base>
          {{ $t("auth.logout") }}
        </a>

        <div class="navbar-item has-dropdown is-hoverable">
          <span
            class="navbar-link"
            aria-hidden="true"
          >
            {{ locale | capitalize }}
          </span>

          <div class="navbar-dropdown is-right">
            <a
              :class="{
                'is-language': locale == 'fr',
              }"
              class="navbar-item"
              aria-label="change language to french"
              @click="changeLocale('fr')"
            >
              FR
            </a>
            <a
              :class="{
                'is-language': locale == 'en',
              }"
              class="navbar-item"
              aria-label="change language to english"
              @click="changeLocale('en')"
            >
              EN
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import IconBase from '@/components/IconBase'
import IconAbout from '@/components/icons/IconAbout'
import IconLogout from '@/components/icons/IconLogout'

export default {
  name: 'Navbar',
  filters: {
    capitalize (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  components: {
    IconBase,
    IconAbout,
    IconLogout
  },
  data () {
    return{
      showMobileMenu: false
    }
  },
  computed: {
    ...mapState([
      'locale'
    ]),
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapActions([
      'changeLocale',
      'logout'
    ]),
    logoutHandler () {
      this.$toasted.show(this.$t('auth.not-authenticated.toast').toString(), {
        position: 'bottom-center',
        duration: 1500,
        type: 'info'
      })
      this.logout()
      this.$router.go()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

@import "bulma/sass/utilities/initial-variables";
@import "bulma/sass/utilities/functions";

$primary: $secondary-color;

@import "bulma/sass/utilities/derived-variables";
@import "bulma/sass/utilities/mixins";
@import "bulma/sass/utilities/controls";
@import "bulma/sass/utilities/extends";

$navbar-height : 2.8rem;
$navbar-background-color: transparent;
$navbar-item-color: $light;
$navbar-item-hover-color: $light;
$navbar-item-hover-background-color: $primary-color;
$navbar-item-active-color: $primary-color;
$navbar-item-active-background-color: $primary-color;
$navbar-dropdown-background-color: $primary-color;
$navbar-dropdown-border-top: 2px solid $primary-color;
$navbar-dropdown-arrow: $light;
$navbar-dropdown-item-hover-color: $light;
$navbar-dropdown-item-hover-background-color: $dark;
$navbar-breakpoint: 640px;
$navbar-item-img-max-height: 2.6rem;

@import "bulma/sass/components/navbar";

.navbar {
  .navbar-brand {
    padding-top: 4px;
    @media print {
      display: flex;
      justify-content: center;
      align-items: center;
      a.navbar-item {
        line-height: normal;
      }
    }
  }

  .burger {
    background-color: black;
    @media print {
      display: none;
    }
  }

  .navbar-menu {
    @media print {
      display: none;
    }
    @include breakpoint(mobile) {
      padding: 0px;
    }

    .navbar-end {
      background: $dark;

      @include breakpoint(mobile) {
        background-color: black;

        > a.navbar-item:hover, > a.navbar-item.is-active, > a.navbar-item:focus-within {
          background-color: rgba($dark, 0.05);
        }
      }
      .navbar-item {
        text-transform: uppercase;
        text-decoration: none;
        padding: 0.5rem 1.75rem;

        svg {
          margin-right: 5px;
        }

        @include breakpoint(mobile) {
          padding-top: 1rem;
          padding-bottom: 1rem;
          color: $light;
        }

        &.has-dropdown.is-hoverable {
            &:hover {
              background: $primary-color;
            }
            .is-language{
              text-decoration: underline !important;
              font-weight: 800;
            }
            &::before {
              content: '';
              position: absolute;
              width: 1px;
              height: 50%;
              background: $white;
              top: 50%;
              left: 0;
              transform: translateY(-50%);

              @include breakpoint(mobile) {
                display: none;
              }
            }

            @include breakpoint(mobile) {
              padding: 0;
              .navbar-link {
                display: none;
              }
              .navbar-dropdown {
                display: flex;
                background: $dark;
                .navbar-item {
                  &:hover {
                    background: rgba($light, 0.05);
                  }
                }
              }
            }
        }
      }
    }
  }
}
@media print {
  .navbar {
    display: none;
  }
}
</style>