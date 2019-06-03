import daynight from 'daynight/dist/index.es'

export default {
  name: 'DayNight',
  data () {
    return {
      useLightTheme: true
    }
  },
  mounted () {
    this.checkDayNight()
  },
  methods: {
    checkDayNight () {
      try {
        const result = daynight()
        if (result.error) {
          throw new Error(result.error)
        }
        this.useLightTheme = result.light
      } catch (err) {
        console.error(err)
        const hours = new Date().getHours()
        this.useLightTheme = hours > 6 && hours < 20
      }
    }
  }
}
