import { Documents, Column, Locale } from '@/types'
import { Lang } from 'afpnews-api/dist/types'

export default class State {
  public columns: Column[]
  public documents: Documents
  public authType: 'credentials' | 'anonymous' | 'unknown'
  public isOnline: boolean
  public locale: Locale
  public defaultLang: Lang | null

  constructor () {
    this.columns = []
    this.documents = new Map()
    this.authType = 'unknown'
    this.isOnline = true
    this.locale = process.env.VUE_APP_I18N_LOCALE === 'fr' ? 'fr' : 'en'
    this.defaultLang = null
  }
}
