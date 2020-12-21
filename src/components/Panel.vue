<template>
  <transition
    name="panel"
    appear
  >
    <div class="panel-mask">
      <div class="panel-wrapper">
        <div
          v-on-clickaway="close"
          class="panel-container"
        >
          <div class="actions">
            <slot name="actions" />
          </div>
          <div class="panel-header">
            <slot name="header" />
          </div>

          <div class="panel-body">
            <slot name="body" />
          </div>

          <div class="panel-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'Panel',
  mixins: [ clickaway ],
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@/assets/scss/variables.scss";
  .panel-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;

    @include breakpoint(mobile) {
      position: relative;
      display: block;
      background-color: transparent;
    }
  }

  .panel-wrapper{
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    background: $white;
    margin-top:  5.4rem;
    max-width: 555px;

    @include breakpoint(mobile) {
      position: relative;
      display: block;
      margin-top: 0px;
    }

    .panel-container{
      padding: 2rem;
      
      @include breakpoint(mobile) {
        .actions {
          display: none;
        }
      }
    }
  }

/*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */
  .panel-enter-active, .panel-leave-active {
    transition: .4s;
  }
  .panel-enter, .panel-leave-to {
    opacity: 0;
  }
</style>
