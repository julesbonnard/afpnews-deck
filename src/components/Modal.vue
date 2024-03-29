<template>
  <transition name="modal">
    <div
      :style="{
        backgroundImage
      }"
      class="modal-mask"
    >
      <div class="modal-wrapper">
        <div
          v-on-clickaway="close"
          class="modal-container"
        >
          <div class="actions">
            <slot name="actions" />
          </div>
          <div class="modal-header">
            <slot name="header" />
          </div>

          <div class="modal-body">
            <slot name="body" />
          </div>

          <div class="modal-footer">
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
  name: 'Modal',
  mixins: [ clickaway ],
  props: {
    backgroundImage: {
      type: String,
      default: null
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/variables.scss";


  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;

    @media screen and (max-width: 800px) {
      &:before{
        content: '';
        position: absolute;
        background: rgba($dark, .6);
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
      }
    }
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 400px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    max-height: 100%;
    position: relative;

    @media screen and (max-width: 800px) {
      margin-left: auto !important;
      margin-right: auto !important;
      width: 100%;
      max-width: 400px;
      // background: transparent;
      box-shadow: none !important;
    }
  }

  .actions {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }

  .modal-header {
    position: relative;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  .on-left{
    .modal-container{
      margin-left: 200px;
    }
  }

  .header-out{
    .modal-header{
      position: absolute;
      top: -70px;
      transform: translateX(50%);
      left: 0;
      width: 200px;
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

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .night-mode {
    .modal-container {
      background-color: $font-color;
      color: white;
    }
  }
</style>
