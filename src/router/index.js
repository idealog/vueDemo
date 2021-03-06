import Vue from 'vue'
import Router from 'vue-router'
import router from './router'
import network from './network'
Vue.use(Router)

let Routers = new Router({
  routes: router,
  mode: 'hash',
  scrollBehavior(to, from, savedPosition) {
    //console.log(savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  }
})

Routers.addRoutes(network)

Routers.beforeEach((to, from, next) => {
  if (from.query.openid) {
    to.query.openid = from.query.openid;
  }

  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default Routers
