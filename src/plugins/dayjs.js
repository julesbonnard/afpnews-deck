import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)

const VueDayJS = {
  install (vm) {
    vm.filter('fromNow', value => {
      return dayjs(value).from(dayjs())
    })
  }
}

Vue.use(VueDayJS)

export function changeDayJsLocale (locale) {
  dayjs.locale(locale)
}
