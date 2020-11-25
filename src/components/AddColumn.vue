<template>
  <div class="addColumn"  v-on-clickaway="close">
    <div id="addColumn" class="dropdown" @click="triggerDropdown">
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu2">
          <span class="icon">
            <svg id="PICTOGRAMMES" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><title>plus-blue</title><polygon class="cls-1" points="138.5 246.16 161.5 246.16 161.5 161.5 246.159 161.5 246.159 138.5 161.5 138.5 161.5 53.84 138.5 53.84 138.5 138.5 53.841 138.5 53.841 161.5 138.5 161.5 138.5 246.16"/></svg>
          </span>
          <span>Ajouter une colonne</span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu2" role="menu">
        <div class="dropdown-content">
          <a class="dropdown-item" @click="search('search')">
            <p>
              <svg id="PICTOGRAMMES" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><title>search-blue</title><path class="cls-1" d="M124.134,217.654a93.091,93.091,0,0,0,54-17.162L238.6,269.385h30.565l-74.2-84.185a93.518,93.518,0,1,0-70.829,32.454Zm0-164.039a70.52,70.52,0,1,1-70.519,70.519A70.6,70.6,0,0,1,124.134,53.615Z"/></svg>
              Rechercher
            </p>
            <p>Réaliser une recherche sur le catalogue de l’AFP</p>
          </a>
          <hr class="dropdown-divider">
          <a class="dropdown-item" @click="search('topic')">
            <p>
              <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><title>rubrique</title><path class="cls-1" d="M477.05,445.08H243.64l116.71-184.7Zm-164.63-37.9h95.85l-47.92-75.85Z"/><path class="cls-1" d="M210.37,447.48H37.4v-173h173ZM75.29,409.58h97.18V312.41H75.29Z"/><path class="cls-1" d="M273,227.44A86.49,86.49,0,1,1,359.44,141,86.59,86.59,0,0,1,273,227.44Zm0-135.07A48.59,48.59,0,1,0,321.55,141,48.64,48.64,0,0,0,273,92.37Z"/></svg>
              Choisir une rubrique
            </p>
            <p>Choisir une rubrique parmi la liste proposée</p>
          </a>
        </div>
      </div>
    </div>
    <button class="btn btn-circle btn-icon mobile-button" @click="triggerDropdown">
      <i class="UI-icon UI-plus" />
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { directive as onClickaway } from 'vue-clickaway'

export default {
  name: 'AddColumn',
  directives: {
    onClickaway
  },
  methods: {
    ...mapMutations([
      'addColumn'
    ]),

    search (type) {
      if (this.$route.name !== 'deck') this.$router.push({ name: 'deck' })
      const column = {type}
      this.addColumn(column)
    },
    triggerDropdown () {
      const dropdown = document.getElementById('addColumn')
      dropdown.classList.toggle('is-active')
    },
    close () {
      const dropdown = document.getElementById('addColumn')
      dropdown.classList.remove('is-active')
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/scss/colors.scss";
  @import "@/assets/scss/variables.scss";
  .addColumn{
    .dropdown{
      &.is-active{
        .button{
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
      }
      .dropdown-trigger{
        .button{
          background: #F5F6F6;
          width: 280px;
          height: 49px;
          justify-content: left;
          outline: none;
          &:focus{
            border-color: transparent;
          }
          &:focus:not(:active){
            box-shadow: none;
          }
        }
      }
      .icon{
        svg{
          height: 15px;
        }
      }
    }
    .dropdown-menu{
      padding-top: 0px;
      .dropdown-content{
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
      hr{
        width: 50%;
        transform: translateX(50%);
      }
      .dropdown-item{
        max-width: 280px;
        p{
          font-size: 12px;
        }
        p:first-child{
          font-size: 18px;
          svg{
            height: 15px;
          }
        }
      }
    }
    .mobile-button{
      display: none;
      position: absolute !important;
      bottom: 29px;
      right: 24px;
      margin: 4px;
      background: $dark !important;

      @media screen and (max-width: 800px) {
        display: block;
      }

      &:before{
        background: $dark-hovered !important;
      }
      &:after{
        box-shadow: none !important;
      }
    }
  }

</style>
