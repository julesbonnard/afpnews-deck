<template>
  <div />
</template>

<script>
import introJs from 'intro.js'
import { mapMutations } from 'vuex'

import 'intro.js/minified/introjs.min.css'

const isMobile = window.matchMedia('(max-width: 640px)').matches

export default {
  name: 'Tour',
  metaInfo: {
    title: 'Tour'
  },
  data () {
    return {
      steps: [
        {
          element: '.column:first-child [name="query"]',
          intro: this.$t('tour.search')
        },
        {
          element: '.column:first-child [name="product"]',
          intro: this.$t('tour.products')
        },
        {
          element: '.column:first-child [name="lang"]',
          intro: this.$t('tour.languages')
        },
        {
          element: '.column:first-child [name="urgency"]',
          intro: this.$t('tour.urgencies')
        },
        {
          element: '.column:first-child [name="date-picker"]',
          intro: this.$t('tour.date-picker')
        },
        {
          element: isMobile ? '#sidebar button[name="new-column"]' : '#new-column',
          intro: this.$t('tour.new')
        },
        {
          element: '#sidebar [name="authenticate"]',
          intro: this.$t('tour.authenticate')
        }
      ]
    }
  },
  async mounted () {
    console.log('test', isMobile)
    await this.$nextTick()
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
