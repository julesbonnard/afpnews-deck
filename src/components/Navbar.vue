<template>
    <nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="#">
                <img src="@/assets/img/afp_logo.png">
            </a>

            <a @click="showMobileMenu = showMobileMenu ? false : true " role="button" :class="{'navbar-burger burger':true, 'is-active': showMobileMenu}" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div :class="{'navbar-menu':true, 'is-active': showMobileMenu}">
            <div class="navbar-end" @click='showMobileMenu = false'>
                <router-link class="navbar-item" key="about" :to="{ name: 'about' }" name="about" aria-label="about">
                    <svg id="PICTOGRAMMES" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs></defs><title>help-blue</title><path class="cls-1" d="M150,30.769A119.231,119.231,0,1,0,269.231,150,119.232,119.232,0,0,0,150,30.769Zm0,215.462A96.231,96.231,0,1,1,246.231,150,96.34,96.34,0,0,1,150,246.231Z"/><rect class="cls-1" x="138.488" y="192.393" width="23" height="22.992"/><path class="cls-1" d="M150,76.962c-25.329,0-42.347,15.41-42.347,38.346h23c0-12.684,10.521-15.346,19.347-15.346,9.343,0,19.347,5.9,19.347,14.692,0,10.511-4.035,13.623-11.359,19.275-8.238,6.354-19.519,15.058-19.519,35.3h23c0-8.938,3.532-11.663,10.568-17.091,8.571-6.613,20.31-15.669,20.31-37.485C192.347,93.871,173.35,76.962,150,76.962Z"/></svg>
                    {{ $t('about.name') }}
                </router-link>

                <a v-if="isAuthenticated" class="navbar-item"  aria-label="Log out" @click.prevent="logoutHandler">
                    <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs></defs><title>Log-out</title><polygon class="cls-1" points="313.72 345.03 388.74 265.92 167.23 265.92 167.23 233.21 388.5 233.21 313.72 154.82 313.72 108.06 451 249.71 313.72 391.37 313.72 345.03"/><polygon class="cls-1" points="282.81 450.95 57.24 450.95 57.24 48.48 282.81 48.48 282.81 86.38 95.14 86.38 95.14 413.05 282.81 413.05 282.81 450.95"/></svg>
                    {{ $t('auth.logout') }}
                </a>
                
                <router-link v-if="!isAuthenticated" key="authenticate" :to="{ name: 'login' }" name="authenticate" aria-label="Authenticate" class="navbar-item" >
                    <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs></defs><polygon class="cls-1" points="180.1 350.04 259.02 266.82 53.37 266.82 53.37 232.4 258.77 232.4 180.1 149.95 180.1 100.75 324.51 249.76 180.1 398.78 180.1 350.04"/><polygon class="cls-1" points="440.93 451 215.35 451 215.35 413.1 403.03 413.1 403.03 86.43 215.35 86.43 215.35 48.53 440.93 48.53 440.93 451"/></svg>
                    {{ $t('auth.login') }}
                </router-link>

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                    {{currentUILanguage | capitalize}}
                    </a>

                    <div class="navbar-dropdown is-right">
                        <a @click="changeLanguage('fr')" :class="{'navbar-item': true, 'is-language': currentUILanguage == 'fr'}">
                            FR
                        </a>
                        <a @click="changeLanguage('en')" :class="{'navbar-item': true, 'is-language': currentUILanguage == 'en'}">
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
    data () {
        return{
            showMobileMenu: false
        }
    },
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
                    padding-left: 20px;
                    max-height: none;
                    width: 70%;
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
                padding: 0.5rem 1.75rem;

                svg{
                    fill: $light;
                    height: 24px;
                    margin-right: 5px;
                }

                &:hover{
                    background-color: $dark-hovered !important;
                }

                &.is-hoverable{
                    &:hover{
                        .navbar-link{
                            background: $dark-hovered !important;
                        }
                    }

                    &::after{
                        content: '';
                        position: absolute;
                        width: 1px;
                        height: 50%;
                        background: $white;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                    }
                }

                .navbar-dropdown{
                    background: $dark-hovered;
                    border: $dark-hovered;
                    .is-language{
                        text-decoration: underline !important;
                        font-weight: 800;
                    }

                    a{
                        color: white;

                        &:hover{
                            background: $dark !important;
                        }
                    }
                }
            }
        }

        @media screen and (max-width: 1024px) {
            .navbar-menu{
                padding: 0;

                .navbar-end{
                    background: $primary;
                    .navbar-item{
                        padding-top: 1rem;
                        padding-bottom: 1rem;
                        color: $light;
                        svg{
                            transform: translateY(5px);
                        }
                        &:hover{
                            background: $primary-hovered !important;
                        }

                        &.has-dropdown{
                            padding: 0;
                            .navbar-link{
                                display: none;
                            }

                            &::after{
                                content: '';
                                position: absolute;
                                width: 0px;
                                height: 0px;
                            }

                            .navbar-dropdown{
                                background: $dark !important;
                                .navbar-item{
                                    &:hover{
                                        background: $dark-hovered !important;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
        }
    }
</style>