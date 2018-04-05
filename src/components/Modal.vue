<template>
  <transition :name="transition">
    <div
      :class="layout"
      class="modal-mask"
      @click="$emit('close')">
      <div
        class="modal-container"
        @click.stop="">
        <div class="actions">
          <slot name="actions">
            <button
              @click="$emit('close')">
              <i class="UI-icon UI-close-alt" />
            </button>
          </slot>
        </div>
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
    z-index: 100;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    max-height: 100%;
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

      .modal-footer {
        margin-top: auto;
      }

      .actions {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 200;
        padding: 6px 8px;
      }
    }

    &.media {
      background-color: rgba(0, 0, 0, .5);

      .modal-container {
        // margin: 20px 30px;
        background-color: #231f20;
        color: white;
        width: 100%;

        .modal-header {
          padding: 0;
        }

        .modal-body {
          flex: 1;
        }

        .actions {
          button {
            color: white;

            &:hover {
              border: 1px solid white;
            }
          }
        }
      }

      &.photo {
        .modal-container {
          display: block;
          position: relative;

          .modal-header {
            height: 100%;
          }

          .modal-body {
            position: absolute;
            width: 600px;
            top: 50%;
            right: 0px;
            transform: translateY(-50%);
          }

          .modal-footer {
            display: none;
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

        .modal-body {
          overflow-y: auto;
          overscroll-behavior-y: contain;
        }
      }
    }

    &.login, &.credits {
      align-items: flex-start;

      .modal-container {
        height: auto;
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
