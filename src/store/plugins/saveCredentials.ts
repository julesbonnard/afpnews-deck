import afpNews from '@/plugins/api'
import { storageKeys, userStore } from '@/plugins/database'
import { Store } from 'vuex'
import State from '@/store/state'
import { Token } from 'afpnews-api/dist/types'

export const initCredentials = async (store: Store<State>): Promise<void> => {
  const token = await userStore.getItem(storageKeys.token)

  if (token) {
    afpNews.token = token as Token
    store.commit('setToken', token)
  }
}

export const persistCredentials = (store: Store<State>): void => {
  store.subscribe(({ type, payload }: { type: string, payload: unknown }) => {
    switch (type) {
      case 'setToken':
        if ((payload as Token).authType === 'credentials') {
          userStore.setItem(storageKeys.token, payload)
        } else {
          userStore.removeItem(storageKeys.token)
        }
        break
      case 'unsetToken':
        afpNews.resetToken()
        userStore.removeItem(storageKeys.token)
        break
      default:
    }
  })
}
