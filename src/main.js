import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import cookie from 'js-cookie'
import RestClient from './lib/restClient' // axios
import wsClient from './lib/wsClinet' // websocket
import {
  BASE_URL
} from './config'

// import {
//   mapState,
//   mapActions
// } from "vuex"

import * as filters from './filter'
// import Clipboard from 'v-clipboard' // 剪切板
// Vue.use(Clipboard);

import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'


Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
import 'vue-awesome/icons'
import Icons from 'vue-awesome/components/Icon'
Vue.component('icon', Icons);

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

// ui按需引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import {
//   sort
// } from 'core-js/fn/array'
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
Vue.prototype.RestClient = RestClient;
Vue.prototype.Cookie = cookie;

const webSocket = new wsClient(store);

let socketInit = () => {
  store.state.chainInfo = {}
  store.state.averageInfo = {}
  store.state.apiCount = 0
  store.state.showChain = []
  webSocket.startUp("ws://" + BASE_URL + "/v1.0/wsConn").then(() => {
    console.log('连接成功了~~~');

    // 订阅
    return webSocket.sendSubscribe('block', {}).then(() => {

      webSocket.sendRequest('chainInfo', {}).then((result) => {
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
      })
    })

  }).catch((error) => {
    ElementUI.Message.warning(error)

    return P.reject(_.isString(error) ? new Error(error) : error);
  }).finally(() => {

  });
}

webSocket.on('onClose', () => {
  socketInit();
})

socketInit();
Vue.prototype.webSocket = webSocket;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');