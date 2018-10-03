<template>
  <v-tour
    id="tour"
    :steps="steps"
    :callbacks="callbacks"
    name="help" />
</template>

<script>
import Vue from 'vue'
import VueTour from 'vue-tour'
import { mapActions } from 'vuex'

import 'vue-tour/dist/vue-tour.css'

Vue.use(VueTour)

export default {
  name: 'Tour',
  data () {
    return {
      steps: [
        {
          target: '[data-v-step="search"]',
          content: this.$t('tour.search')
        },
        {
          target: '[data-v-step="products"]',
          content: this.$t('tour.products')
        },
        {
          target: '[data-v-step="languages"]',
          content: this.$t('tour.languages')
        },
        {
          target: '[data-v-step="urgencies"]',
          content: this.$t('tour.urgencies')
        },
        {
          target: '[data-v-step="date-picker"]',
          content: this.$t('tour.date-picker')
        },
        {
          target: '[data-v-step="new"]',
          content: this.$t('tour.new')
        },
        {
          target: '[data-v-step="auto-refresh"]',
          content: this.$t('tour.auto-refresh')
        },
        {
          target: '[data-v-step="authenticate"]',
          content: this.$t('tour.authenticate')
        }
      ],
      callbacks: {
        onStop: this.onStop
      }
    }
  },
  mounted () {
    this.$tours['help'].start()
  },
  methods: {
    ...mapActions([
      'setWantTour'
    ]),
    onStop () {
      this.setWantTour(false)
      this.$router.push({ name: 'deck' })
    }
  }
}
</script>

<style lang="scss">
  #tour div {
    z-index: 1000;
  }
</style>
