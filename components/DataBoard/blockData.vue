<template>
  <div class="custom-tree-container mytree" ref="treeDiv" style="overflow-y:auto; height:calc(63vh - 100px);">
    <el-tree class="tree" :data="data" node-key="time" :indent="0" ref="trees" default-expand-all
      :expand-on-click-node="false" :highlight-current="true" accordion>
      <div class="custom-tree-node" slot-scope="{node, data}" @click="getBlockInfo(data)">
        <div style="color:#4bb0ff" v-if="node.label == '信标链'">{{ node.label }}</div>
        <div style="color:#67C23A" v-if="node.label == '中继链'">{{ node.label }}</div>
        <div style="color:red" v-if="node.label == '分片链'">{{ node.label }}</div>
        <div class="itemWarp">
          <p class="up">
            <span class="time">时间：{{jsTime(data.time)}}</span>
            <!-- <span v-for="(item,index) in data.timeData" :key="index" class="item">{{item}}</span> -->
            <span class="item">最近：{{data.interval/1000}}s，平均：{{data.interval/1000}}s</span>
          </p>
          <p class="dn">
            <span class="area">区块：</span>
            <span class="item">高度{{data.height}}， 交易数：{{data.trans}}， TPS：，大小：{{data.size}}KB</span>
            <!-- <span v-for="(item,index) in data.areaData" :key="index" class="item">高度：{{item}}</span> -->
          </p>
        </div>
      </div>
    </el-tree>
  </div>
</template>
<script>
  import {
    sendSock,
    getCallBack,
  } from '@/plugins/sockjs'
  import {
    getTreeList
  } from "~/utils/treeTool";
  export default {
    props: {
      value: Array,
      addInfo: Array
    },
    watch: {
      value: {
        handler(newValue, oldValue) {
          this.value = newValue; //把新值赋值给我们的属性数据
          this.getData()
        },
        deep: true
      },
      addInfo: {
        handler(newValue, oldValue) {
          this.addInfo = newValue; //把新值赋值给我们的属性数据
          this.addData()
        },
        deep: true
      },
    },
    data() {
      return {
        data: [],
      };
    },
    methods: {
      getData() {
        let blist = [] // 信标链
        let rlist = [] // 中继链
        let slist = [] // 分片链
        for (var i = 0; i < this.value.length; i++) {
          if (this.value[i].type == 'b') {
            blist.push(this.value[i])
            blist.forEach(item => {
              item.label = '信标链'
              item.children = []
            })
          } else if (this.value[i].type == 'r') {
            rlist.push(this.value[i])
            rlist.forEach(item => {
              item.label = '中继链'
              item.children = []
            })
          } else if (this.value[i].type == 's') {
            slist.push(this.value[i])
            slist.forEach(item => {
              item.label = '分片链'
            })
          }
        }
        this.data = blist
        rlist[0].children = slist
        this.data[0].children = rlist
        this.$store.commit('WEBSOCKET_BLOCK_LIST', this.data);
      },
      addData() {
        if (this.$store.state.allblocklist) {
          this.data = this.$store.state.allblocklist.slice()
        }
        if (!this.value || !this.value.length > 0) {
          return
        }
        if (this.addInfo) {
          for (var i = 0; i < this.addInfo.length; i++) {
            if (this.addInfo[i].type == 'b') {
              this.addInfo.forEach(item => {
                item.label = '信标链'
                item.children = []
              })
              this.data.push(this.addInfo[i])
              this.$store.dispatch("WEBSOCKET_BLOCK_LIST", this.data);
            } else if (this.addInfo[i].type == 'r') {
              this.addInfo.forEach(item => {
                item.label = '中继链'
                item.children = []
              })
              for (var j = 0; j < this.data.length; j++) {
                if (this.data[j].children.length < 32) {
                  this.data[j].children.push(this.addInfo[i])
                  this.$store.dispatch("WEBSOCKET_BLOCK_LIST", this.data);
                  return
                }
              }
            } else if (this.addInfo[i].type == 's') {
              this.addInfo.forEach(item => {
                item.label = '分片链'
              })
              for (var m = 0; m < this.data.length; m++) {
                for (var n = 0; n < this.data[m].children.length; n++) {
                  if (this.data[m].children[n].children.length < 32) {
                    this.data[m].children[n].children.push(this.addInfo[i])
                    this.$store.dispatch("WEBSOCKET_BLOCK_LIST", this.data);
                    return
                  }
                }
              }
            }
          }
        }
      },
      getBlockInfo(node) {
        let obj = {
          uri: 'blockInfo',
          body: {
            type: node.type,
            number: node.number
          }
        }
        this.$store.dispatch("WEBSOCKET_REIVE", obj);
      },
      jsTime(val) {
        if (val === '') {
          return '----'
        } else if (val.length != 29) {
          let date = new Date(val);
          let y = date.getFullYear();
          let MM = date.getMonth() + 1;
          MM = MM < 10 ? ('0' + MM) : MM;
          let d = date.getDate();
          d = d < 10 ? ('0' + d) : d;
          let h = date.getHours();
          h = h < 10 ? ('0' + h) : h;
          let m = date.getMinutes();
          m = m < 10 ? ('0' + m) : m;
          let s = date.getSeconds();
          s = s < 10 ? ('0' + s) : s;
          return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        } else if (val === '0001-01-01T00:00:00Z') {
          return '----'
        } else if (val === '5000-01-01T23:59:59+08:00') {
          return '永久'
        } else {
          val = val.toString().replace('T', ' ')
          return val.substring(0, 19)
        }
      },
    }
  };

</script>

<style lang="scss">
  .el-tree-node__content {
    height: 55px;
  }

</style>

<style lang="scss" scoped>
  p,
  div {
    font-size: 13px;
  }

  .itemWarp {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    align-items: flex-start;

    .time {
      font-weight: bold;
      color: rgb(0, 0, 0);
    }

    .area {
      font-weight: bold;
      color: rgb(0, 0, 0);
    }

    .item {
      margin-left: 20px;
      font-family: "微软雅黑";
    }

    .dn {
      margin-top: 5px;
    }
  }

  .custom-tree-container {}

  .custom-tree-node {
    height: 53px;
    display: flex;
    font-size: 14px;
    padding-right: 8px;
    align-items: center;
  }

  .custom-tree-container /deep/ .el-tree>.el-tree-node:after {
    border-top: none;
  }

  .tree /deep/ .el-tree-node {
    position: relative;
    padding-left: 16px;
  }

  .tree /deep/ .el-tree-node__children {
    padding-left: 16px;
  }

  .tree /deep/ .el-tree-node :last-child:before {
    height: 38px;
  }

  .tree /deep/ .el-tree>.el-tree-node:before {
    border-left: none;
  }

  .tree-container /deep/ .el-tree>.el-tree-node:after {
    border-top: none;
  }

  .tree /deep/ .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree /deep/ .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .tree /deep/ .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 23px;
    width: 24px;
  }

</style>
