let socket;
var lockReconnect = false // 连接标志位
var wsCfg = {
  // url: "ws://192.168.0.164:9999/v1.0/conn" // websocket地址process.env.baseURL
  url: "ws://" + process.env.baseURL + "/v1.0/conn"
}

let globalCallback = null
let globalBlock = null
let createWebSocket = () => {
  try {
    socket = new WebSocket(wsCfg.url); // 创建Web Socket 连接
    // 初始化事件
    initWebSocket(socket);
  } catch (e) {
    // 出错时重新连接
    reconnect(wsCfg.url);
  }
};
// 初始化weosocket
function initWebSocket(socket) {
  // 连接关闭时触发
  socket.onclose = () => {
    websocketclose()
  };
  // 通信发生错误时触发
  socket.onerror = () => {
    // 重新创建长连接
    console.log(';错误了')
  };
  // 连接建立时触发
  socket.onopen = () => {
    websocketOpen()
  };
  // 客户端接收服务端数据时触发
  socket.onmessage = msg => {
    // 业务逻辑处理
    websocketonmessage(msg)
    // console.log(msg.data, "ws:data");
  };
};

// 数据接收
function websocketonmessage(e) {
  console.log('数据是-------------------', e)
  getSock(e.data)
}
//定义重连函数
let reconnect = () => {
  if (lockReconnect) {
    return;
  }
  lockReconnect = true;

  // 没连接上会一直重连，设置延迟避免请求过多
  setTimeout(() => {
    lockReconnect = false;
    createWebSocket(wsCfg.url);
  }, 2000);
};
// 关闭
function websocketclose(e) {
  console.log('连接关闭')
}
// 创建 websocket 连接
function websocketOpen(e) {
  console.log("连接成功啦~~~~~~~~~~~~~~~~~~~~~~~~~");
  // heartCheck.reset().start(); //心跳检测重置
}

//心跳设置
var heartCheck = {
  timeout: 20000, //每段时间发送一次心跳包 这里设置为20s
  timeoutObj: null, //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）
  serverTimeoutObj: null,

  start: function () {
    var self = this;
    this.timeoutObj = setTimeout(function () {
      // if (isConnect) socket.send("ping");
      socket.send("headbeat");
      self.serverTimeoutObj = setTimeout(function () { //如果超过一定时间还没重置，说明后端主动断开了
        socket.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout)
    }, this.timeout);
  },

  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    this.start();
  }
};

// 实际调用的方法
function sendSock(agentData, callback) {
  console.log('ssssssss',socket,agentData)
  if (!socket) {
    setTimeout(function () {
      sendSock(agentData, callback)
    }, 1000)
  } else {
    if (socket.readyState === 1) {
      // 若是ws开启状态
      websocketsend(agentData)
    } else if (socket.readyState === socket.CONNECTING) {
      // 若是 正在开启状态，则等待1s后重新调用
      setTimeout(function () {
        sendSock(agentData, callback)
      }, 1000)
    } 
  }
}

function getSock(data) {
  if (JSON.parse(data).uri == 'chainInfo') {
    globalCallback = JSON.parse(data).body
  } else if (JSON.parse(data).uri == 'blockInfo') {
    globalBlock = JSON.parse(data).body
  } 
}

function getCallBack() {
  if (globalCallback) {
    return globalCallback
  }
  if (globalBlock) {
    return globalBlock
  }
}
// 数据发送
function websocketsend(agentData) {
  socket.send(JSON.stringify(agentData))
}
//设置关闭连接
let closeWebSocket = () => {
  if (socket && socket.readyState == 1) {
    socket.close();
  }
};

createWebSocket()

// 将方法暴露出去
export {
  sendSock,
  getSock,
  getCallBack,
  createWebSocket,
  closeWebSocket
}
