<template>
  <div
    v-on-clickaway="close"
    class="add-column"
  >
    <div
      :class="{
        'is-active': isActive
      }"
      class="dropdown"
      @click="isActive = !isActive"
    >
      <div class="dropdown-trigger">
        <button
          class="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu2"
        >
          <icon-base
            icon-name="plus"
            :width="15"
            :height="15"
          >
            <icon-plus />
          </icon-base>
          <span>{{ $t('deck.add-column') }}</span>
        </button>
      </div>
      <div
        id="dropdown-menu2"
        class="dropdown-menu"
        role="menu"
      >
        <div class="dropdown-content">
          <a
            class="dropdown-item"
            @click="search('search')"
          >
            <p>
              <icon-base
                icon-name="search"
                :width="15"
                :height="15"
              >
                <icon-search />
              </icon-base>
              {{ $t('deck.add-column-search-title') }}
            </p>
            <p>{{ $t('deck.add-column-search-desc') }}</p>
          </a>
          <hr class="dropdown-divider">
          <a
            class="dropdown-item"
            @click="search('topic')"
          >
            <p>
              <icon-base
                icon-name="topic"
                :width="15"
                :height="15"
              >
                <icon-topic />
              </icon-base>
              {{ $t('deck.add-column-topic-title') }}
            </p>
            <p>{{ $t('deck.add-column-topic-desc') }}</p>
          </a>
        </div>
      </div>
    </div>
    <button
      class="btn btn-circle btn-icon mobile-button"
      @click="newColumn"
    >
      <icon-base
        icon-name="plus"
        :width="15"
        :height="15"
      >
        <icon-plus />
      </icon-base>
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { directive as onClickaway } from 'vue-clickaway'
import IconBase from '@/components/IconBase'
import IconPlus from '@/components/icons/IconPlus'
import IconSearch from '@/components/icons/IconSearch'
import IconTopic from '@/components/icons/IconTopic'

export default {
  name: 'AddColumn',
  directives: {
    onClickaway
  },
  components: {
    IconBase,
    IconPlus,
    IconSearch,
    IconTopic
  },
  data () {
    return {
      isActive: false
    }
  },
  computed: {
    ...mapState([
      'locale',
      'defaultLang'
    ])
  },
  methods: {
    ...mapMutations([
      'addColumn'
    ]),

    search (type) {
      if (this.$route.name !== 'deck') this.$router.push({ name: 'deck' })
      this.addColumn({
        type,
        params: {
          langs: this.defaultLang ? [this.defaultLang] : [this.locale],
          products: type === 'topic' ? ['multimedia'] : []
        }
      })
    },

    close () {
      this.isActive = false
    },

    newColumn () {
      this.$el.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
      this.isActive = true
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/scss/variables.scss";

  @import "bulma/sass/utilities/initial-variables";

  $size-large: 1.2rem;

  @import "bulma/sass/utilities/functions";
  @import "bulma/sass/utilities/derived-variables";
  @import "bulma/sass/utilities/mixins";
  @import "bulma/sass/utilities/controls";
  @import "bulma/sass/elements/icon";
  @import "bulma/sass/elements/button";
  @import "bulma/sass/form/_all";
  @import "bulma/sass/components/dropdown";

  .add-column{
    min-width: 310px;
    scroll-snap-align: start;
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
        min-width: 280px;
        min-width: 280px;
        width: 280px;
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
      display: block;
      position: absolute !important;
      bottom: 29px;
      right: 24px;
      margin: 4px;
      background: $dark !important;
      svg {
        transform: scale(1);
      }
      &:before{
        background: rgba($primary-color, 0.7) !important;
      }
      &:after{
        box-shadow: none !important;
      }
    }
  }

</style>
