<template>
    <nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="#">
                <img src="@/assets/img/afp_logo.png">
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu">
            <div class="navbar-end">
                <router-link class="navbar-item" key="about" :to="{ name: 'about' }" name="about" aria-label="about">
                    {{ $t('about.name') }}
                </router-link>

                <a class="navbar-item">
                    Feedback
                </a>

                <a v-if="isAuthenticated" class="navbar-item"  aria-label="Log out" @click.prevent="logoutHandler">
                    {{ $t('auth.logout') }}
                </a>
                
                <router-link v-if="!isAuthenticated" key="authenticate" :to="{ name: 'login' }" name="authenticate" aria-label="Authenticate" class="navbar-item" >
                    {{ $t('auth.login') }}
                </router-link>

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                    {{currentUILanguage | capitalize}}
                    </a>

                    <div class="navbar-dropdown is-right">
                        <a @click="changeLanguage('fr')" class="navbar-item">
                            FR
                        </a>
                        <a @click="changeLanguage('en')" class="navbar-item">
                            EN
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'Navbar',
    methods: {
        ...mapActions([
        'changeLocale', 'logout'
        ]),
        changeLanguage (newLanguage) {
            this.changeLocale(newLanguage)
        },
        logoutHandler () {
            this.$toasted.show(this.$t('auth.not-authenticated.toast').toString(), {
                position: 'bottom-center',
                duration: 1500,
                type: 'info'
            })
            this.logout()
        }
    },
    computed: {
        currentUILanguage () {
            return this.$store.state.locale
        },
        ...mapGetters([
        'isAuthenticated'
        ])
    },
    filters: {
        capitalize (value) {
            if (!value) return ''
            value = value.toString()
            return value.toUpperCase()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
    .navbar{
        .navbar-brand{
            .navbar-item{
                img{
                    max-height: none;
                    width: 115px;
                }
                &:hover{
                    background: $primary-hovered;
                }
            }
        }

        .navbar-end{
            background: $dark;
            .navbar-item{
                text-transform: uppercase;

                &:hover{
                    background-color: $dark-hovered !important;
                }

                &.is-hoverable{
                    &:hover{
                        .navbar-link{
                            background: $dark-hovered !important;
                        }
                    }
                }

                .navbar-dropdown{
                    background: $dark-hovered;
                    border: $dark-hovered;
                    a{
                        color: white;

                        &:hover{
                            background: $dark !important;
                        }
                    }
                }
            }
        }
    }
</style>