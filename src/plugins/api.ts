import AfpNews from 'afpnews-api'
import store from '@/store'
import { Token } from 'afpnews-api/dist/typings/@types/index.d'

const afpNews = new AfpNews({
  customAuthUrl: 'https://3o3qoiah2e.execute-api.eu-central-1.amazonaws.com/afpdeck'
})

afpNews.on('setToken', (token: Token) => store.commit('setToken', token))

export default afpNews
