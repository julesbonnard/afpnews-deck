export default {
  columns: [],
  credentials: {
    client: null,
    clientId: null,
    clientSecret: null
  },
  clients: [],
  documents: {},
  authType: 'unknown',
  connectivity: {
    isConnected: true
  },
  wantTour: true,
  autoRefresh: false,
  locale: process.env.VUE_APP_I18N_LOCALE || 'en'
}
