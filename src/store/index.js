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

import {
    reDate
} from '@/lib/moment.js'

const initState = {

    apiCount: 0, // 请求计数
    loadingInstance: null, // loading实例

    wsState: '',

    // chainInfo链整体情况
    chainInfo: {},
    showChain: [],
    averageInfo: {},
    newblock: {},

    // tps
    tpsLine: [],

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
            state.chainInfo = data;
            this.commit('getTree')
        },

        // 构建树chain
        getTree(state) {
            let collapses = JSON.parse(sessionStorage.getItem('collapses'))
            let chainInfo = _.clone(state.chainInfo);
            let showChain = {}
            let shards = []

            _.mapValues(chainInfo, (item) => {
                item.id = item.type + item.chainKey
                item.name = item.type + item.chainKey
                item.tps = 0.0
                item.recently = parseInt(item.recently + 1)
                item.open = false

                switch (item.type) {
                    case 'B':
                        item.pid = 0
                        item.color = '#0099cc'
                        item.children = []
                        if (collapses.indexOf('B') > -1) {
                            item.open = true
                        }
                        showChain[item.name] = item
                        break;

                    case 'R':
                        item.pid = 'B'
                        item.color = '#52aac7'
                        item.children = []
                        if (collapses.indexOf(item.name) > -1) {
                            item.open = true
                        }
                        showChain[item.name] = item
                        break;

                    case 'S':
                        if (item.interval == 0) {
                            item.tps = 0.0
                        } else {
                            item.tps = parseFloat(item.trans / item.interval)
                        }

                        item.pid = 'R' + item.chainKey.substring(0, 2)
                        item.color = '#b7d0d9'
                        if (collapses.indexOf(item.pid) > -1) {
                            showChain[item.name] = item
                        }

                        shards.push(item)
                        break;
                }
            })
           
            _.each(shards, s => {
                if (showChain[s.pid]) {
                    showChain[s.pid].tps = parseFloat(showChain[s.pid].tps + s.tps)
                    showChain['B'].tps = parseFloat(showChain['B'].tps + s.tps)
                }
            })

            state.showChain = _.orderBy(showChain, ['chainKey'], ['asc'])
        },

        // 更新chainInfo
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
                if (aInfo[item.type + item.chainKey]) {
                    if (chainInfo[item.type + item.chainKey].interval != 0 && aInfo[item.type + item.chainKey].average == 0) {
                        chainInfo[item.type + item.chainKey].average = chainInfo[item.type + item.chainKey].interval
                    } else if (chainInfo[item.type + item.chainKey].interval != 0 && aInfo[item.type + item.chainKey].average != 0) {
                        chainInfo[item.type + item.chainKey].average = parseFloat((aInfo[item.type + item.chainKey].average * aInfo[item.type + item.chainKey].num + item.interval) / (aInfo[item.type + item.chainKey].num + 1))
                    }
                    aInfo[item.type + item.chainKey].num++
                    aInfo[item.type + item.chainKey].average = chainInfo[item.type + item.chainKey].average
                }
            })
            state.averageInfo = aInfo
            state.chainInfo = chainInfo
            this.commit('getTree')
        },

        // 初始化tps图表
        inintTPS(state) {
            this.commit("updateApiCount", "add");
            let times = 10
            let tpsTime = setInterval(() => {
                let tpsLine = []
                times--;
                if (times > 0) {
                    let timeS = reDate(new Date(), 'HH:mm:ss').substring(reDate(new Date(), 'HH:mm:ss').length - 1, reDate(
                        new Date(), 'HH:mm:ss').length)
                    if (timeS == '0' || timeS == '5') {
                        for (var i = 179; i >= 0; i--) {
                            let obj = {
                                name: reDate(new Date(new Date().getTime() - i * 5000), 'HH:mm:ss'),
                                value: 0
                            }
                            tpsLine.push(obj)
                        }
                        clearInterval(tpsTime); //清除定时器
                        state.tpsLine = tpsLine
                        this.commit("updateApiCount", "sub");
                    }
                }
            }, 1000)
        },

        updateTPS(state, data) {
            let tpsline = _.clone(state.tpsLine)
            if (tpsline.length >= 180) {
                tpsline.splice(0, 1);
            }
            tpsline.push({
                name: data.time,
                value: parseFloat(data.tps).toFixed(0)
            })
            state.tpsLine = tpsline
        },

        // wsState赋值
        ws_State(state, data) {
            state.wsState = data
        },

    },

    actions: {}
})