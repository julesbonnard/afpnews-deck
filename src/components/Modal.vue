<template>
  <transition :name="transition">
    <div
      :class="layout"
      class="modal-mask"
      @click="$emit('close')">
      <div
        v-hammer:swipe.horizontal="swipe"
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

        <div
          ref="body"
          class="modal-body">
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
import { mapState, mapActions, mapMutations } from 'vuex'

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
  },
  computed: {
    ...mapState([
      'currentDocumentId'
    ])
  },
  watch: {
    currentDocumentId () {
      this.$refs.body.scrollTop = 0
    }
  },
  mounted () {
    this.initKeyHandler()
  },
  beforeDestroy () {
    this.removeKeyHandler()
  },
  methods: {
    ...mapActions([
      'previousDocument',
      'nextDocument'
    ]),
    ...mapMutations([
      'resetCurrentDocument'
    ]),
    initKeyHandler () {
      if (['login', 'credits'].includes(this.layout) === false) {
        window.addEventListener('keydown', this.onKeyPress)
      }
    },
    removeKeyHandler () {
      if (['login', 'credits'].includes(this.layout) === false) {
        window.removeEventListener('keydown', this.onKeyPress)
      }
    },
    onKeyPress (e) {
      if (e.key === 'ArrowDown') {
        this.previousDocument()
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        this.nextDocument()
        e.preventDefault()
      } else if (e.key === 'Escape') {
        this.resetCurrentDocument()
        e.preventDefault()
      }
    },
    swipe (e) {
      if (['login', 'credits'].includes(this.layout)) {
        return false
      }
      if (e.direction === 2) {
        this.previousDocument()
      } else if (e.direction === 4) {
        this.nextDocument()
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

      .modal-body {
        touch-action: pan-y;
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
          @media screen and (max-width: 640px) {
            flex-direction: column;
          }

          .modal-footer {
            display: none;
          }

          .modal-body {
            display: flex;
            align-items: flex-end;
            width: 50%;
            @media screen and (max-width: 640px) {
              width: 100%;
              display: block;
              max-height: 70%;
              overflow-y: auto;
              overscroll-behavior-y: contain;
            }
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

    &.document {
      .modal-container {
        .modal-footer, .modal-header {
          display: none;
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

  .slide-enter-active, .slide-leave-active {
    transition: transform .3s ease-in-out;
    .modal-container {
      transition: transform .3s ease-in-out;
    }
  }

  .slide-enter,
  .slide-leave-to {
    .modal-container {
      transform: translateX(-100%);
    }
  }

  .slide-enter-to,
  .slide-leave {
    .modal-container {
      transform: translateX(0%);
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease-in-out;
    .modal-container {
      transition: opacity .3s ease-in-out;
    }
  }

  .fade-enter,
  .fade-leave-to {
    .modal-container {
      opacity: 0;
    }
  }

  .fade-enter-to,
  .fade-leave {
    .modal-container {
      transform: 1;
    }
  }
</style>
