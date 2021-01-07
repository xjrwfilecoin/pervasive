import _ from "lodash";
// import io from 'socket.io-client'
import EventEmitter from 'eventemitter3'
import P from 'bluebird'

import {
    Message
} from 'element-ui'

class wsClinet extends EventEmitter {
    constructor(store) {
        super();

        this.store = store;

        this.startUp = (url) => {

            if (this.client) {
                this.client.close();
                store.commit('updateState', {});
            }

            return new P((resolve, reject) => {
                this.client = new WebSocket(url);
                this.client.onopen = () => {
                    store.commit('ws_State', this.client.readyState);
                    clearTimeout(this.timer);
                    resolve();
                }

                this.client.onmessage = (callback) => {
                    let msg = JSON.parse(callback.data)

                    if (msg.error) {
                        Message.warning(msg.error.message)
                        return
                    }
                    //event
                    if (msg.event && !msg.msgId) {
                        switch (msg.event) {
                            case 'block':
                                let item = msg.body;
                                let obj = store.state.chainInfo || {};
                                let update_obj = {}
                                _.each(item, i => {
                                    i.recently = -1
                                    if (obj[i.type + i.chainKey] && obj[i.type + i.chainKey].height > i.height) {
                                        this.client.close();
                                    }
                                    obj[i.type + i.chainKey] = i;
                                    update_obj[i.type + i.chainKey] = i
                                });

                                store.commit('updateBlock', update_obj);
                                store.commit('updateState', {
                                    chainInfo: obj
                                });

                                break;

                            default:
                                break;
                        }
                    }
                    //response
                    if ((msg.event || msg.uri) && msg.msgId) {
                        store.commit("updateApiCount", "sub");
                        this.emit(msg.msgId, msg);
                    }
                }

                this.client.onclose = () => {
                    console.log('准备关闭')
                    store.commit('ws_State', this.client.readyState);
                    this.emit('onClose', false);
                }

                this.client.onerror = (event) => {
                    console.log('error', event)
                }

                this.timer = setTimeout(() => {
                    this.client.close();
                    reject()
                }, 1000)
            })
        };



        this.baseRequest = (type, value, body) => {
            store.commit("updateApiCount", "add"); // loading

            let fun = (resolve, reject) => {
                let msgId = Math.random().toString(36).substr(2, 8);

                let to = () => {
                    reject('timeout');
                    this.removeAllListeners(msgId);                  
                };

                this.once(msgId, (result) => {
                    if (timer) {
                        clearTimeout(timer);
                    }

                    this.removeAllListeners(msgId);

                    if (result.error) {
                        // 错误信息处理  
                        reject(result.error)
                    } else {
                        resolve(result.body);
                    }

                });
                let timer = setTimeout(to, 10000);

                let data = {
                    body: body,
                    msgId: msgId
                };
                data[type] = value;

                this.client.send(JSON.stringify(data))
            }
            return new P(fun.bind(this))
        }

        this.sendRequest = (
            uri,
            body
        ) => {
            return this.baseRequest('uri', uri, body);
        };

        this.sendSubscribe = (
            event,
            body
        ) => {
            return this.baseRequest('event', event, body)
        };

    }
}

export default wsClinet