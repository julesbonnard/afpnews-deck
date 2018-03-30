<template>
  <transition :name="transition">
    <div
      :class="layout"
      class="modal-mask"
      @click="$emit('close')">
      <div
        class="modal-container"
        @click.stop="">
        <button
          class="close"
          @click="$emit('close')">
          <i class="UI-icon UI-close-alt" />
        </button>
        <div class="modal-header">
          <slot name="header">
            default header
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            default footer
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    layout: {
      type: String,
      default () {
        return 'document'
      }
    },
    transition: {
      type: String,
      default () {
        return 'fade'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;

    .modal-container {
      transition: all .3s ease;
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);

      .modal-header, .modal-footer {
        padding-left: 30px;
        padding-right: 30px;
      }

      .modal-body {
        flex: 1;
      }

      .close {
        position: absolute;
        top: 8px;
        right: 8px;
        float: right;
        background-color: transparent;
        color: #231f20;
        padding: 6px 8px;
        border: 1px solid transparent;

        &:hover {
          background-color: transparent;
          border: 1px solid #231f20;
        }
      }
    }

    &.media {
      background-color: rgba(0, 0, 0, .5);
      height: 100%;

      .modal-container {
        margin: 20px 30px;
        width: 100vw;
        background-color: #231f20;
        color: white;

        .close {
          color: white;

          &:hover {
            border: 1px solid white;
          }
        }
      }
    }

    &.document, &.login, &.credits {
      left: 52px;
      background-color: transparent;
      height: 100%;
      min-width: 300px;
      width: calc(100% - 52px);

      .modal-container {
        max-width: 600px;
        background-color: white;
      }
    }

    &.login, &.credits {
      align-items: flex-start;

      .modal-container {
        height: auto;
      }
    }

    &.document {
      .modal-container {
        .modal-body {
          overflow-y: scroll;
          overscroll-behavior-y: contain;
        }
      }
    }
  }

  .slide-enter .modal-container,
  .slide-leave-active .modal-container {
    transform: translateX(-100%);
  }

  .fade-enter .modal-container,
  .fade-leave-active .modal-container {
    opacity: 0;
  }
</style>
