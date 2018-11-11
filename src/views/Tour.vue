<template>
  <div />
</template>

<script>
import introJs from 'intro.js'
import { mapMutations } from 'vuex'

import 'intro.js/minified/introjs.min.css'

export default {
  name: 'Tour',
  metaInfo: {
    title: 'Tour'
  },
  data () {
    return {
      steps: [
        {
          element: '.column:first-child [data-intro="search"]',
          intro: this.$t('tour.search')
        },
        {
          element: '.column:first-child [data-intro="products"]',
          intro: this.$t('tour.products')
        },
        {
          element: '.column:first-child [data-intro="languages"]',
          intro: this.$t('tour.languages')
        },
        {
          element: '.column:first-child [data-intro="urgencies"]',
          intro: this.$t('tour.urgencies')
        },
        {
          element: '.column:first-child [data-intro="date-picker"]',
          intro: this.$t('tour.date-picker')
        },
        {
          element: '#sidebar [data-intro="new"]',
          intro: this.$t('tour.new')
        },
        {
          element: '#sidebar [data-intro="authenticate"]',
          intro: this.$t('tour.authenticate')
        }
      ]
    }
  },
  mounted () {
    introJs()
      .setOptions({
        steps: this.steps,
        showProgress: true
      })
      .oncomplete(this.onStop)
      .onexit(this.onStop)
      .start()
  },
  methods: {
    ...mapMutations([
      'setWantTour'
    ]),
    onStop () {
      this.setWantTour(false)
      this.$router.push({ name: 'deck' })
    }
  }
}
</script>
