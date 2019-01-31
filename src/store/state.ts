export default () => ({
  columns: [],
  credentials: {
    client: '',
    clientId: '',
    clientSecret: ''
  },
  documents: {},
  viewed: [],
  authType: 'unknown',
  connectivity: {
    isConnected: true
  },
  wantTour: true,
  displayInstallApp: false,
  locale: process.env.VUE_APP_I18N_LOCALE || 'en'
})
