<template>
  <div class="custom-tree-container mytree" ref="treeDiv" style="overflow-y:auto; height:calc(63vh - 100px);">
    <el-tree class="tree" :data="data" node-key="id" :indent="0" ref="trees" default-expand-all
      :expand-on-click-node="false" :highlight-current="true">
      <div class="custom-tree-node" slot-scope="{node, data}" @click="getBlockInfo(data)">
        <div class="title">{{ node.label }}</div>
        <div class="itemWarp">
          <p class="up">
            <span class="time">时间：{{data.time}}</span>
            <span v-for="(item,index) in data.timeData" :key="index" class="item">{{item}}</span>
          </p>
          <p class="dn">
            <span class="area">区块：{{data.area}}</span>
            <span v-for="(item,index) in data.areaData" :key="index" class="item">{{item}}</span>
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
  export default {
    props: {
      value: Array
    },
    watch: {
      value: {
        handler(newValue, oldValue) {
          this.value = newValue; //把新值赋值给我们的属性数据
          this.getData()
          console.log('3333333333333333333333333333', this.value)
        },
        deep: true
      }
    },
    data() {
      const data = []
      // [{
      //   id: 1,
      //   label: "信标链-01",
      //   time: "时间",
      //   area: "区块",
      //   timeData: ["最近2s", "平均12s"],
      //   areaData: ["高度 689", "高度 689", "高度 689", "高度 689"],
      //   children: [{
      //       id: 2,
      //       label: "中继链-01",
      //       time: "时间",
      //       area: "区块",
      //       timeData: ["最近2s", "平均12s"],
      //       areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //     },
      //     {
      //       id: 3,
      //       label: "中继链-02",
      //       time: "时间",
      //       area: "区块",
      //       timeData: ["最近2s", "平均12s"],
      //       areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //     },
      //     {
      //       id: 4,
      //       label: "中继链-04",
      //       time: "时间",
      //       area: "区块",
      //       timeData: ["最近2s", "平均12s"],
      //       areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //     },
      //     {
      //       id: 5,
      //       label: "中继链-05",
      //       time: "时间",
      //       area: "区块",
      //       timeData: ["最近2s", "平均12s"],
      //       areaData: ["高度 689", "高度 689", "高度 689", "高度 689"],
      //       children: [{
      //           id: 6,
      //           label: "分片链-06",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 7,
      //           label: "分片链-07",
      //           time: "时间",
      //           area: "时间",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 8,
      //           label: "分片链-08",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 9,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 10,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 11,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 12,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 13,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 14,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 15,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 16,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         },
      //         {
      //           id: 17,
      //           label: "分片链-09",
      //           time: "时间",
      //           area: "区块",
      //           timeData: ["最近2s", "平均12s"],
      //           areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
      //         }
      //       ]
      //     },
      //   ]
      // }];
      return {
        data: JSON.parse(JSON.stringify(data)),
        data: JSON.parse(JSON.stringify(data))
      };
    },
    methods: {
      getData() {
        let blist = [] // 信标链
        let rlist = [] // 中继链
        let slist = [] // 分片链
        for (var i = 0; i < this.value.length; i++) {
          if (this.value[i].chainId.type == 'b') {
            blist.push({
              id: this.value[i].chainId.id,
              type: 'b',
              label: '信标链' + i + '',
              time: this.timestampToTime(this.value[i].blockList[0].Time),
              area: '',
              number: this.value[i].blockList[0].Number,
              timeData: ["最近2s", "平均12s"],
              areaData: ["高度 689", "高度 689", "高度 689", "高度 689"]
            })
          } else if (this.value[i].chainId.type == 'r') {
            rlist.push(this.value[i])
          } else if (this.value[i].chainId.type == 's') {
            slist.push(this.value[i])
          }
        }
        this.data = blist
        console.log('xxaaaaaaaaaaaaaaa', this.data)
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
      },
      timestampToTime(timestamp) {
        var date = new Date(parseInt(timestamp) * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ':';
        var m = (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + ':';
        var s = (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds());
        return Y + M + D + h + m + s;
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
