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
          <button
            @click="$emit('close')">
            <i class="UI-icon UI-close-alt" />
          </button>
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
    display: flex;
    z-index: 100;
    top: 0;
    width: 100%;
    height: 100%;
    @media screen and (max-width: 640px) {
      height: calc(100% - 50px);
    }
    overflow: hidden;

    .modal-container {
      position: relative;
      display: flex;
      transition: all .3s ease;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);

      .actions {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 101;
      }

      .modal-header, .modal-footer {
        padding-left: 30px;
        padding-right: 30px;
      }

      .modal-footer {
        margin-top: auto;
      }
    }

    &.media {
      .modal-container {
        width: 100%;
        background-color: #231f20;

        .modal-header {
          padding: 0;
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
          justify-content: space-between;
          align-items: stretch;

          .modal-header {
            display: flex;
            align-items: center;
          }

          .modal-body {
            display: flex;
            align-items: flex-end;
            width: 50%;
          }

          .modal-footer {
            display: none;
          }
        }
      }

      &.video {
        .modal-container {
          justify-content: space-between;
          flex-direction: column;

          .modal-body {
            overflow-y: auto;
            overscroll-behavior: contain;
          }

          .modal-footer {
            display: none;
          }
        }
      }
    }

    &.document, &.login, &.credits {
      left: 52px;
      width: calc(100% - 52px);
      @media screen and (max-width: 640px) {
        left: 0px;
        width: 100%;
      }

      .modal-container {
        flex-direction: column;
        max-width: 600px;
        background-color: white;
        height: 100%;

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
        padding: 12px;
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
