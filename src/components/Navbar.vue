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
                    A propos
                </router-link>

                <a class="navbar-item">
                    Feedback
                </a>

                <a class="navbar-item">
                    Se déconnecter
                </a>

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
import { mapActions } from 'vuex'

export default {
    name: 'Navbar',
    methods: {
        ...mapActions([
        'changeLocale'
        ]),
        changeLanguage (newLanguage) {
            this.changeLocale(newLanguage)
        }
    },
    computed: {
        currentUILanguage () {
            return this.$store.state.locale
        }
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