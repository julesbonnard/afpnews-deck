import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import { Locale } from '@/types'

dayjs.extend(relativeTime)

const VueDayJS = {
  install (vm: typeof Vue) {
    vm.filter('fromNow', (value: Date, now: Date) => {
      return dayjs(value).from(dayjs(now))
    })
  }
}

Vue.use(VueDayJS)

export function changeDayJsLocale (locale: Locale): void {
  dayjs.locale(locale)
}
