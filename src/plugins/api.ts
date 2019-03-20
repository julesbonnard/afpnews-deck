import AfpNews from 'afpnews-api'
import store from '@/store'

const afpNews = new AfpNews({
  customAuthUrl: 'https://3o3qoiah2e.execute-api.eu-central-1.amazonaws.com/afpdeck',
  saveToken: token => store.commit('setToken', token)
})

export default afpNews
