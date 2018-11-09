import afpNews from '@/plugins/api'
import { storageKeys, userStore } from '@/plugins/database'

export const initCredentials = async store => {
  await Promise.all(
    [storageKeys.client, storageKeys.clientId, storageKeys.clientSecret, storageKeys.token].map(key => userStore.getItem(key))
  ).then(([client, clientId, clientSecret, token]) => {
    if (client) store.commit('setClient', client)
    if (clientId) store.commit('setClientId', clientId)
    if (clientSecret) store.commit('setClientSecret', clientSecret)

    afpNews.apiKey = store.state.credentials

    if (token) {
      store.commit('setToken', token)
      afpNews.token = token
    }
  })
}

export const persistCredentials = store => {
  store.subscribe(({ type, payload }, state) => {
    switch (type) {
      case 'setToken':
        if (payload.authType === 'credentials') {
          afpNews.token = payload
          userStore.setItem(storageKeys.token, payload)
        } else {
          userStore.removeItem(storageKeys.token)
        }
        break
      case 'unsetToken':
        afpNews.resetToken()
        userStore.removeItem(storageKeys.token)
        break
      case 'setClient':
        afpNews.apiKey = state.credentials
        userStore.setItem(storageKeys.client, payload)
        break
      case 'setClientId':
        afpNews.apiKey = state.credentials
        userStore.setItem(storageKeys.clientId, payload)
        break
      case 'setClientSecret':
        afpNews.apiKey = state.credentials
        userStore.setItem(storageKeys.clientSecret, payload)
        break
      case 'resetClientCredentials':
        afpNews.apiKey = state.credentials
        userStore.setItem(storageKeys.client, state.credentials.client)
        userStore.setItem(storageKeys.clientId, state.credentials.clientId)
        userStore.setItem(storageKeys.clientSecret, state.credentials.clientSecret)
        break
      default:
    }
  })
}
