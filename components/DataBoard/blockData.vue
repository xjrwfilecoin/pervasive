<template>
  <div class="custom-tree-container mytree" ref="treeDiv" style="overflow-y:auto; height:calc(63vh - 100px);">
    <el-tree class="tree" :data="data" node-key="id" :indent="0" ref="trees" default-expand-all
      :expand-on-click-node="false" :highlight-current="true">
      <div class="custom-tree-node" slot-scope="{node, data}" @click="getBlockInfo(data)">
        <div class="title">{{ node.label }}</div>
        <div class="itemWarp">
          <p class="up">
            <span class="time">时间：{{jsTime(data.time)}}</span>
            <!-- <span v-for="(item,index) in data.timeData" :key="index" class="item">{{item}}</span> -->
            <span class="item">最近：{{data.interval/1000}}s，平均：{{data.interval/1000}}s</span>
          </p>
          <p class="dn">
            <span class="area">区块：高度{{data.height}}</span>
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
      }
    },
    data() {
      // const data = []
      return {
        data: []
        // data: JSON.parse(JSON.stringify(data)),
        // data: JSON.parse(JSON.stringify(data))
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
      },
      addData() {
        console.log('~~~~~~~wwwwwwwwwww', this.addInfo)
        if (!this.value.length > 0) {
          return
        }
        if (this.addInfo && this.addInfo.length > 0) {
          for (var i = 0; i < this.addInfo.length; i++) {
            if (this.addInfo[i].type == 'b') {
              this.addInfo.forEach(item => {
                item.label = '信标链'
                item.children = []
              })
              this.data.push(this.addInfo[i])
            } else if (this.addInfo[i].type == 'r') {
              this.addInfo.forEach(item => {
                item.label = '中继链'
                item.children = []
              })
              // this.$set(this.data[0].children, this.data[0].children.length, this.addInfo[0]);
              this.data[0].children.push(this.addInfo[i])
            } else if (this.addInfo[i].type == 's') {
              this.addInfo.forEach(item => {
                item.label = '分片链'
              })
              // this.$set(this.data[0].children[0].children, this.data[0].children[0].children.length, this.addInfo[0]);
              this.data[0].children[0].children.push(this.addInfo[i])
            }
          }
        }
        console.log('*************', this.data)
      },
      getBlockInfo(node) {
        let obj = {
          uri: 'blockInfo',
          body: {
            type: node.type,
            number: node.number
          }
        }
        sendSock(obj)
        setInterval(() => { // setInterval
          let globalBlock = getCallBack()
          if (globalBlock) {
            // this.chainList = globalBlock
            console.log('xxxxqqqqxxxxxxxxxxx', globalBlock)
          }
        }, 5000)

      },
      jsTime(val) {
        if (val === '') {
          return '----'
        } else if (val === '0001-01-01T00:00:00Z') {
          return '----'
        } else if (val === '5000-01-01T23:59:59+08:00') {
          return '永久'
        } else {
          val = val.toString().replace('T', ' ')
          return val.substring(0, 19)
        }
      }
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

    .title {
      color: #4bb0ff;
    }
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
