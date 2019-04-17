import { Documents, Column, Locale } from '@/types'

export default class State {
  public columns: Column[]
  public documents: Documents
  public authType: 'credentials' | 'anonymous' | 'unknown'
  public isOnline: boolean
  public displayInstallApp: boolean
  public locale: Locale

  constructor () {
    this.columns = []
    this.documents = new Map()
    this.authType = 'unknown'
    this.isOnline = true
    this.displayInstallApp = false
    this.locale = process.env.VUE_APP_I18N_LOCALE === 'fr' ? 'fr' : 'en'
  }
}
