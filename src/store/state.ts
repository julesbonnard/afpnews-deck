import { Documents, Column, Connectivity, Locale } from '@/types'

export default class State {
  public columns: Column[]
  public documents: Documents
  public viewed: Array<string>
  public authType: 'credentials' | 'anonymous' | 'unknown'
  public connectivity: Connectivity
  public wantTour: boolean
  public displayInstallApp: boolean
  public locale: Locale

  constructor () {
    this.columns = []
    this.documents = {}
    this.viewed = []
    this.authType = 'unknown'
    this.connectivity = {
      isConnected: true
    }
    this.wantTour = true
    this.displayInstallApp = false
    this.locale = process.env.VUE_APP_I18N_LOCALE === 'fr' ? 'fr' : 'en'
  }
}
