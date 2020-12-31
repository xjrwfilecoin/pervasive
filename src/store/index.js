import Vue from 'vue'
import Vuex, {
    Store
} from 'vuex'
import _ from 'lodash'

import {
    Loading,
    Message
} from "element-ui";

Vue.use(Vuex);

const initState = {

    apiCount: 0, // 请求计数
    loadingInstance: null, // loading实例

    wsState: '',

    // chainInfo链整体情况
    chainInfo: {},
    averageInfo: {},
    newblock: {},
    // chainTree: [],

    // blockInfo基本信息
    blockInfo: {
        type: '', //[b|r|s], 链类型
        chainKey: '', // 链编号
        nodeId: '', // 节点id
        height: 0, //当前区块高度
        father: '', //父区块hash
        hash: '', //区块hash
        vrf: '', //VRF
        time: new Date(), //当前产生时间
        interval: 0, //出块间隔
        trans: 0, //交易数量
        size: 0, //区块大小
    },

    cmdbody: null,

};

const getters = {};

export default new Vuex.Store({
    state: _.clone(initState),

    mutations: {
        /* 打开Loading */
        startLoading(state, msg) {
            state.loadingInstance = Loading.service({
                lock: true,
                text: msg ? msg : "数据加载中...",
                spinner: 'el-icon-loading',
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        /* 关闭loading */
        closeLoading(state) {
            state.loadingInstance.close();
        },
        /* 更新请求线程池 */
        updateApiCount(state, handle) {
            if (handle == "add") {
                state.apiCount++;
                this.commit("startLoading");
            } else {
                state.apiCount--;
                if (state.apiCount <= 0) {
                    this.commit("closeLoading");
                }
            }
        },

        // 平均时间记录
        updateBalance(state, data) {
            state.averageInfo = data
        },

        // block记录
        updateBlock(state, data) {
            state.newblock = data
        },

        // 初始chainInfo
        inintChain(state, data) {
            state.chainInfo = data
        },

        updateState(state, data) {
            _.mapKeys(data, function (value, key) {
                if (_.isPlainObject(value)) {
                    state[key] = _.extend(state[key], value)
                } else {
                    state[key] = value
                }
            });

            let chainInfo = _.clone(state.chainInfo)
            let newblock = _.clone(state.newblock)
            let aInfo = _.clone(state.averageInfo)

            _.mapValues(newblock, (item) => {
                // 平均时间
                if (chainInfo[item.type + item.chainKey].interval != 0 && aInfo[item.type + item.chainKey].average == 0) {
                    chainInfo[item.type + item.chainKey].average = chainInfo[item.type + item.chainKey].interval
                } else if (chainInfo[item.type + item.chainKey].interval != 0 && aInfo[item.type + item.chainKey].average != 0) {
                    chainInfo[item.type + item.chainKey].average = parseFloat((aInfo[item.type + item.chainKey].average * aInfo[item.type + item.chainKey].num + item.interval) / (aInfo[item.type + item.chainKey].num + 1))
                }
                aInfo[item.type + item.chainKey].num++
                aInfo[item.type + item.chainKey].average = chainInfo[item.type + item.chainKey].average
            })
            state.averageInfo = aInfo
            state.chainInfo = chainInfo
        },

        // wsState赋值
        ws_State(state, data) {
            state.wsState = JSON.parse(data).body
        },

    },

    actions: {}
})