import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import wsClient from './lib/wsClinet' // websocket
import {
  BASE_URL
} from './config'


import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'

// ui按需引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
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
  // if (sessionStorage.getItem("token")) {
  //   next();
  // } else {
  //   if (to.path === '/login') {
  //     next();
  //   } else {
  //     if (to.path === '/registered') {
  //       next();
  //     } else {
  //       if (to.path === '/RegisterSuccess') {
  //         next()
  //       } else {
  //         next({
  //           path: '/login'
  //         })
  //       }
  //     }
  //   }
  // }
});

const webSocket = new wsClient(store);
let loadinginstace

let socketInit = () => {
  store.state.chainInfo = {}
  store.state.averageInfo = {}
  store.state.apiCount = 0
  store.state.showChain = []
  webSocket.startUp("ws://" + BASE_URL + "/v1.0/wsConn").then(() => {
    console.log('连接成功了~~~');
    if (loadinginstace) {
      loadinginstace.close()
    }

    // 订阅
    return webSocket.sendSubscribe('block', {}).then(() => {

      return webSocket.sendRequest('chainInfo', {}).then((result) => {
        if (result && result.data != null) {
          store.commit('inintTPS')

          let obj = {};
          let ban_obj = {};
          _.each(result.data, item => {
            item.average = 0.0
            item.tps = 0.0
            item.recently = 0
            obj[item.type + item.chainKey] = item;

            ban_obj[item.type + item.chainKey] = {
              tps: 0.0,
              average: 0.0,
              num: 0
            }
          });
          store.commit('updateBalance', ban_obj)
          store.commit('inintChain', obj)
        }
      }).catch((err) => {})
    }).catch((err) => {})

  }).catch((err) => {
    if (!loadinginstace) {
      loadinginstace = ElementUI.Loading.service({
        lock: true,
        text: '连接失败！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    return null;
  }).finally(() => {});
}

webSocket.on('onClose', () => {
  if (!loadinginstace) {
    loadinginstace = ElementUI.Loading.service({
      lock: true,
      text: '连接失败！',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  // 重连
  let timeS = 15
  let timeStop = setInterval(() => {
    timeS--;
    if (timeS > 0) {} else {
      socketInit();
      clearInterval(timeStop); //清除定时器
    }
  }, 1000)
})

socketInit();
Vue.prototype.webSocket = webSocket;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');