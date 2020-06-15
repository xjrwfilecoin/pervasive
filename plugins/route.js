export default ({
  app,
  store
}) => {
  app.router.beforeEach((to, from, next) => {

    if (to.matched.length === 0) { //如果未匹配到路由
      if (store.state.token) {
        from.name ? next({
          name: from.name
        }) : next('/databoard'); //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
      } else {
        from.name ? next({
          name: from.name
        }) : next('/databoard'); //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
      }
    } else {
      next(); //如果匹配到正确跳转
    }
  })
}
