import { State } from '@/types'

export default (): State => ({
  columns: [],
  documents: {},
  viewed: [],
  authType: 'unknown',
  connectivity: {
    isConnected: true
  },
  wantTour: true,
  displayInstallApp: false,
  locale: process.env.VUE_APP_I18N_LOCALE === 'fr' ? 'fr' : 'en'
})
