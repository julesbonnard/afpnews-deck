import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import 'dayjs/locale/fr'
import { Locale } from '@/types'

dayjs.extend(relativeTime)
dayjs.extend(calendar)

const VueDayJS = {
  install (vm: typeof Vue) {
    vm.filter('calendar', (value: Date, now: Date, format: { sameDay: string, nextDay: string, nextWeek: string, lastDay: string, lastWeek: string, sameElse: string }) => {
      return dayjs(value).calendar(dayjs(now), format)
    })
    vm.filter('calendarRelative', (value: Date, reference: Date, now: Date, format: { onlyHour: string, sameDay: string, nextDay: string, nextWeek: string, lastDay: string, lastWeek: string, sameElse: string }) => {
      if (dayjs(value).isSame(dayjs(reference), 'day')) {
        return dayjs(value).format(format.onlyHour)
      }
      return dayjs(value).calendar(dayjs(now), format)
    })
    vm.filter('fromNow', (value: Date, now: Date) => {
      return dayjs(value).from(dayjs(now))
    })
  }
}

Vue.use(VueDayJS)

export function changeDayJsLocale (locale: Locale): void {
  dayjs.locale(locale)
}
