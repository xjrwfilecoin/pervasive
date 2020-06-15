<template>
  <div>
    <h1>vue + websocket连接demo</h1>
    <Button @click="test">test</Button>
  </div>
</template>

<script>
  let socket;
  // 给服务器发送一个字符串:
  export default {
    data() {
      return {
        // 连接标志位
        lockReconnect: false,
        wsCfg: {
          // websocket地址
          url: "ws://192.168.0.164:9999/v1.0/conn"
        },
        // {"uri":"chainInfo",
        //  "body":{
        //    "beaconBlockList":[
        //       {
        //         "Type":"b",
        //         "Number":"100005",
        //         "Id":"100005",
        //         "Height":431,
        //         "Father":"fatherHash",
        //         "Hash":"hash",
        //         "Vrf":"vrf",
        //         "Time":1591600467,
        //         "Interval":20,
        //         "Trans":120,
        //         "Size":120,
        //         "Detail":null
        //       },{
        //         "Type":"b",
        //         "Number":"100005",
        //         "Id":"100005",
        //         "Height":431,
        //         "Father":"fatherHash",
        //         "Hash":"hash",
        //         "Vrf":"vrf",
        //         "Time":1591600467,
        //         "Interval":20,
        //         "Trans":120,
        //         "Size":120,
        //         "Detail":null
        //       }
        //     ],
        //   "chainId":[{"id":"100002","type":"r"}],"countNode":[{"id":"r","total":4},{"id":"s","total":4},{"id":"b","total":4}],
        //   "totalFlow":[
        //     {"id":"5edde72e32184f3991820164","time":3183201884,"in":659,"out":659}
        //   ]},
        //   "error":null,
        //   "msgId":""}
      };
    },
    methods: {
      createWebSocket() {
        try {
          // 创建Web Socket 连接
          socket = new WebSocket(this.wsCfg.url);
          // 初始化事件
          this.initEventHandle(socket);
        } catch (e) {
          // 出错时重新连接
          this.reconnect(this.wsCfg.url);
        }
      },
      initEventHandle(socket) {
        // 连接关闭时触发
        socket.onclose = () => {
          console.log("连接关闭");
        };
        // 通信发生错误时触发
        socket.onerror = () => {
          // 重新创建长连接
          this.reconnect();
        };
        // 连接建立时触发
        socket.onopen = () => {
          console.log("连接成功啦~~~~~~~~~~~~~~~~~~~~~~~~~");
          
        };
        // 客户端接收服务端数据时触发
        socket.onmessage = () => {
          // 业务逻辑处理
          websocketonmessage()
          // console.log(msg.data, "ws:data");
        };
      },
      //连接建立失败重连
	    websocketonmessage(e){ 
        console.log('==================',e)
	      let dataJson = JSON.parse(e.data)
	      console.log('1111111111111111111111111111',dataJson)
	      // 在这里使用后端返回的数据，对数据进行处理渲染
	    },
      reconnect() {
        if (this.lockReconnect) {
          return;
        }
        this.lockReconnect = true;

        // 没连接上会一直重连，设置延迟避免请求过多
        setTimeout(() => {
          this.lockReconnect = false;
          this.createWebSocket(this.wsCfg.url);
        }, 2000);
      },
      test() {
        // 给服务器发送一个字符串:
        socket.send("block");
      }
    },
    mounted() {
      this.createWebSocket();
    }
  };

</script>
