import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export const state = () => ({
  userInfo: {},
  idcardImg: [],
  userType: 0, // 用户类型0：普通用户；1：管理员
  reCreated: false, // 代理层级刷新状态
  isSuccessConnect: false // socket连接状态
})

export const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data
  },
  setIdcardImg(state, data) {
    state.idcardImg = data
  },
  setUserType(state, data) {
    state.userType = data
  },
  setReCreated(state, data) {
    state.reCreated = data
  },
  LOGOUT(state) {
    // localStorage.clear();
    state.userInfo = {}
    state.idcardImg = []
    state.reCreated = false
  },

  // newIsSuccessConnect(state, value) {
  //   state.isSuccessConnect = value
  // }
}

export const getters = {
  userInfo(state) {
    return state.userInfo
  },
  // getIsSuccessConnect: state => {
  //   return state.isSuccessConnect
  // }
}
