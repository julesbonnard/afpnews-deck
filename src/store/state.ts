import { Documents, Column, Locale } from '@/types'

export default class State {
  public columns: Column[]
  public documents: Documents
  public viewed: Array<string>
  public authType: 'credentials' | 'anonymous' | 'unknown'
  public isOnline: boolean
  public wantTour: boolean
  public displayInstallApp: boolean
  public locale: Locale

  constructor () {
    this.columns = []
    this.documents = new Map()
    this.viewed = []
    this.authType = 'unknown'
    this.isOnline = true
    this.wantTour = true
    this.displayInstallApp = false
    this.locale = process.env.VUE_APP_I18N_LOCALE === 'fr' ? 'fr' : 'en'
  }
}
