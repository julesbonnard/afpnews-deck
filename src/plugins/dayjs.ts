import Vue from 'vue'
import dayjs, { ConfigType, OptionType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import { Locale } from '@/types'

dayjs.extend(relativeTime)

declare module 'dayjs' {
  function dayjs(config?: ConfigType, option?: OptionType): Dayjs
  interface Dayjs {
    from(compared: ConfigType, withoutSuffix?: boolean): string
  }
}

const VueDayJS = {
  install (vm: typeof Vue) {
    vm.filter('fromNow', (value: Date) => {
      return dayjs(value).from(dayjs())
    })
  }
}

Vue.use(VueDayJS)

export function changeDayJsLocale (locale: Locale): void {
  dayjs.locale(locale)
}
