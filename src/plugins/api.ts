import AfpNews from 'afpnews-api'
import store from '@/store'

const afpNews = new AfpNews({
  baseUrl: 'https://afp-apicore-prod.afp.com',
  customAuthUrl: 'https://3o3qoiah2e.execute-api.eu-central-1.amazonaws.com/ondeck',
  saveToken: token => {
    if (token) {
      store.commit('setToken', token)
    }
  }
})

export default afpNews
