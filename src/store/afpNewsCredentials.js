import afpNews from '@/plugins/api'

export default async store => {
  store.subscribe(({ type, payload }, state) => {
    switch (type) {
      case 'setToken':
        afpNews.token = payload
        break
      case 'resetToken':
        afpNews.resetToken()
        break
      case 'setClientCredentials':
        // falls through
      case 'updateClient':
        // falls through
      case 'updateClientId':
        // falls through
      case 'updateClientSecret':
        // falls through
      case 'resetClientCredentials':
        afpNews.credentials = state.credentials
        break
      default:
    }
  })
}
