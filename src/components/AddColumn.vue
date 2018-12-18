<template>
  <div class="btn-container">
    <button
      id="new-column"
      name="new-column"
      aria-label="Add new column"
      class="btn"
      @click="search">
      <i class="UI-icon UI-plus" /> {{ $t('deck.add-column') }}
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'AddColumn',

  methods: {
    ...mapMutations([
      'addColumn'
    ]),

    search () {
      if (this.$route.name !== 'deck') this.$router.push({ name: 'deck' })
      this.addColumn()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/colors.scss";
  @import "@/assets/scss/variables.scss";

  .btn-container {
    padding: 4px 12px;

    button {
      @media print {
        display: none;
      }
      @include breakpoint(mobile) {
        display: none;
      }
      display: inline-flex;
      align-items: center;

      flex-shrink: 0;

      padding: 0 20px;

      width: 281px;
      height: 48px;

      background-color: rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease;

      font-size: 0.9rem;
      font-weight: normal;

      text-shadow: none;

      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }

      i.UI-icon.UI-plus {
        font-size: 1.2rem;
        position: relative;
        top: -1.5px;
        margin-right: 3px;
      }
    }
  }
</style>
