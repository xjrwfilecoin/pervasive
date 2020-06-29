import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export const state = () => ({
  strict: false,
  websock: null, // websorket实例
  urlbody: {},
  eventlist: null, //onmessage 返回的数据
  chainlist: null, //chainlist 返回的数据
  blocklist: null, //blocklist 返回的数据
  blockinfo: null,
  allblocklist: null,
  cmdbody: null
})

export const mutations = {
  WEBSOCKET_INIT(state, url) {
    try {
      state.websock = new WebSocket(url); // 创建Web Socket 连接
    } catch (e) {
      // 出错时重新连接
      // reconnect(wsCfg.url);
    }
  },
  UPDATE_URL(state, data) {
    state.urlbody = data;
  },
  //将接收到的数据赋值
  WEBSOCKET_REIVE(state, data) {
    state.eventlist = JSON.parse(data).body;
  },
  // chainList赋值
  WEBSOCKET_CHAIN(state, data) {
    state.chainlist = JSON.parse(data).body
  },
  // blockList赋值
  WEBSOCKET_BLOCK(state, data) {
    state.blocklist = JSON.parse(data).body
  },
  // blockList赋值
  WEBSOCKET_BLOCK_LIST(state, data) {
    state.allblocklist = Object.assign([], data)
  },
  // blockinfo赋值
  WEBSOCKET_BLOCK_INFO(state, data) {
    state.blockinfo = JSON.parse(data).body
  },
  // cmd交易命令
  WEBSOCKET_BLOCK_CMD(state, data) {
    state.cmdbody = JSON.parse(data)
  }
}

export const actions = {
  WEBSOCKET_INIT({
    commit
  }, url) {
    commit('WEBSOCKET_INIT', url);
    if (this.state.websock && this.state.websock != null) {
      this.state.websock.onopen = function () {
        console.log("连接成功啦~~~~~~~~~~~~~~~~~~~~~~~~~~！");
      };
      this.state.websock.οnerrοr = function (e) { //错误
        console.log("ws错误!");
        console.log(e);
      };
      //websocket与后端链接的数据，为异步链接的方式！
      this.state.websock.onmessage = function (callBack) {
        console.log('************',callBack.data)
        if (callBack.data) {
          //后端返回的数据，在mutations内进行修改
          if (JSON.parse(callBack.data).uri == 'chainInfo') {
            commit('WEBSOCKET_CHAIN', callBack.data);
          } else if (JSON.parse(callBack.data).uri == 'blockInfo') {
            commit('WEBSOCKET_BLOCK_INFO', callBack.data);
          } else if (JSON.parse(callBack.data).uri == 'cmd') {
            commit('WEBSOCKET_BLOCK_CMD', callBack.data);
          } else {
            commit('WEBSOCKET_REIVE', callBack.data);
            if (JSON.parse(callBack.data).event == 'block') {
              commit('WEBSOCKET_BLOCK', callBack.data);
            }
          }
        }
      };
    }
  },
  //更新前端传值
  WEBSOCKET_REIVE({
    dispatch,
    commit
  }, data) {
    commit('UPDATE_URL', data)
    dispatch('SEND_INFO', {
      dispatch
    })
  },
  //发送消息
  SEND_INFO({
    dispatch
  }) {
    if (!this.state.websock) {
      setTimeout(() => {
        dispatch('SEND_INFO', {
          dispatch
        })
      }, 2000)
    } else {
      if (this.state.websock.readyState === 1) {
        let _msg = JSON.stringify(this.state.urlbody);
        this.state.websock.send(_msg);
      } else if (this.state.websock.readyState === this.state.websock.CONNECTING) {
        setTimeout(function () {
          dispatch('SEND_INFO', {
            dispatch
          })
        }, 2000)
      }
    }
  },
  WEBSOCKET_BLOCK_LIST({
    commit
  }, data) {
    commit('WEBSOCKET_BLOCK_LIST', data)
  },
}

export const getters = {
  allblocklist(state) {
    return state.allblocklist;
  },
  cmdbody(state) {
    return state.cmdbody;
  },
  blockinfo(state) {
    return state.blockinfo;
  },
  chainlist(state) {
    return state.chainlist;
  },
  blocklist(state) {
    return state.blocklist;
  },
  eventlist(state) {
    return state.eventlist;
  },
  websock(state) {
    return state.websock;
  },
}
