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
                    store.commit("updateApiCount", "sub");
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
                        this.emit(msg.msgId, msg);
                    }
                }

                this.client.onclose = () => {
                    store.commit('ws_State', this.client.readyState);
                    this.emit('onClose', false);
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
                    this.removeAllListeners(msgId);
                    reject('timeout');
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
                let timer = setTimeout(to, 5000);

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