import router from '@/router'
import store from '@/store'

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && store.state.authType !== 'credentials') {
    return next({
      name: 'login',
      query: {
        redirect: to.path !== '/' ? to.path : undefined
      },
      replace: true
    })
  }
  next()
})
