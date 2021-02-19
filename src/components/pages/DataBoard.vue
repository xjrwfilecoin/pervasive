<template>
  <div>
    <chooseHeader class="main_header"></chooseHeader>
    <div class="wrapper">
      <div class="databoard_block">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card style="min-height: 722px;height: calc(100vh - 80px);">
              <div slot="header">
                <span><i class="iconfont icon-ChainInfo"></i>链结构</span>
              </div>
              <div id="tableList" style="height: calc(100vh - 170px);overflow-y:scroll">
                <ul id="dataTree" class="ztree"></ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card style="height: calc(45vh - 41px); min-height: 320px">
              <div slot="header">
                <span><i class="iconfont icontubiaozhexiantu"></i>TPS</span>
              </div>
              <blockBar id="blockBar" :value="tpsLine"
                style="height:calc(40vh - 60px); min-height:260px; margin:0 auto"></blockBar>
            </el-card>
            <div>
              <cardData></cardData>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from '@/lib/jquery-vendor.js'
  import 'jquery-ui'
  import "@/lib/ztree_v3/js/jquery.ztree.core.js"
  import "@/lib/ztree_v3/js/jquery.ztree.excheck.js"
  import "@/lib/ztree_v3/js/jquery.ztree.exedit.js"
  import "@/lib/ztree_v3/css/zTreeStyle/zTreeStyle.css"

  import chooseHeader from '@/components/common/chooseHeader'
  import blockBar from '@/components/Echarts/blockBar'
  import cardData from '@/components/common/cardData'

  import Vue from 'vue'
  import router from '@/router'
  import store from '@/store'

  import {
    reDate
  } from '@/lib/moment.js'

  import {
    mapState,
    mapActions
  } from 'vuex'

  export default {
    name: 'DataBoard',

    components: {
      chooseHeader,
      blockBar,
      cardData,
    },
    computed: {
      ...mapState({ //等价于上面的写法
        showChain: state => _.values(state.showChain),
      }),
      ...mapState({ //等价于上面的写法
        tpsData: state => _.values(state.tpsLine),
      })
    },
    watch: { //监听值改变
      showChain: {
        handler(newVal, oldVal) {
          this.getTree()
        }
      },
      tpsData: {
        handler(newVal, oldVal) {
          this.getTPS()
        }
      },
    },

    data() {
      return {
        treeData: [],
        collapses: ['B', 'R00'],
        setting: {
          data: {
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
              rootPId: 0
            }
          },
          view: {
            showLine: false,
            showTitle: false,
            addDiyDom: this.addDiyDom,
            selectedMulti: false,
          },
          callback: {
            onRightClick: this.zTreeOnRightClick,
            onExpand: this.zTreeOnExpand,
            onCollapse: this.zTreeOnCollapse
          }
        },

        tpsLine: [],
        timeo: 1,
        timeStop: null, // 刷新计时
      }
    },

    mounted() {
      sessionStorage.setItem('collapses', JSON.stringify(this.collapses))

      this.getTPS()
      this.updateTPS()
      this.getTree()
    },

    methods: {
      zTreeOnRightClick: function (e, treeId, treeNode) {
        if (!treeNode) {
          return
        }
        this.$store.commit("setParameters", {
          type: treeNode.type,
          chainKey: treeNode.chainKey,
          height: treeNode.height, //区块高度
        });
        this.$router.push('/blockinfo')
      },

      // 添加条目数
      addDiyDom: function (treeId, treeNode) {
        var spaceWidth = 15;
        var liObj = $("#" + treeNode.tId);
        var aObj = $("#" + treeNode.tId + "_a");
        var switchObj = $("#" + treeNode.tId + "_switch");
        var icoObj = $("#" + treeNode.tId + "_ico");
        var spanObj = $("#" + treeNode.tId + "_span");
        aObj.attr('title', '');
        aObj.append('<div class="diy_swich"></div>');
        var div = $(liObj).find('div').eq(0);
        switchObj.remove();
        spanObj.remove();
        icoObj.remove();
        div.append(switchObj);
        div.append(spanObj);
        var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) +
          "px'></span>";
        switchObj.before(spaceStr);
        var editStr = '';
        editStr +=
          '<div class="chain_tree_node"><div class="tree_logo" style="background-color:' + treeNode.color + '"><h3>' +
          treeNode.type + '<span style="font-size:12px">' + treeNode.chainKey + '</span>' +
          '</h3></div><div class="tree_info"><div class="tree_info_top"> 时间 | 最近：' + this.getRecently(treeNode
            .recently) +
          ' s | 平均：' + parseFloat(treeNode.average).toFixed(3) +
          ' s</div><div class="tree_info_bottom"> 区块 | 高度：<a style="color:#409EFF;height:24px" id="addBtn_' + treeNode
          .tId +
          '" onclick="this.blur()">' + treeNode.height + '</a> | TPS：' + parseFloat(treeNode.tps).toFixed(0) +
          ' | 交易数：' + treeNode.trans + ' | 大小：' + parseFloat(
            treeNode.size / 1024).toFixed(0) + ' KB </div></div></div>'
        aObj.append(editStr);

        var btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
          let vm = new Vue({
            router,
            store,
            methods: {
              turnToBlockInfo() {
                this.$store.commit("setParameters", {
                  type: treeNode.type,
                  chainKey: treeNode.chainKey,
                  height: treeNode.height, //区块高度
                });
                this.$router.push('/blockinfo')
              },
            },
          })
          vm.turnToBlockInfo();
          return false;
        })
      },

      // 展开
      zTreeOnExpand: function (event, treeId, treeNode) {
        this.collapses = JSON.parse(sessionStorage.getItem('collapses'))
        if (treeNode.id != 'B') {
          this.collapses = ['B']
        }
        this.collapses.push(treeNode.id)
        sessionStorage.setItem('collapses', JSON.stringify(this.collapses))

        this.$store.commit('getTree')

        // 滚轮定位
        let height = 0
        height = parseInt((treeNode.getIndex() + 1) * 55)
        this.$nextTick(() => {
          var div = document.getElementById('tableList');
          if (treeNode.type == 'B') {
            div.scrollTop = 0
          } else {
            div.scrollTop = height
          }
        })
      },
      // 关闭
      zTreeOnCollapse: function (event, treeId, treeNode) {
        if (sessionStorage.getItem('collapses')) {
          this.collapses = JSON.parse(sessionStorage.getItem('collapses'))
          var index = this.collapses.indexOf(treeNode.id);
          if (index > -1) {
            this.collapses.splice(index, 1);
          }
          sessionStorage.setItem('collapses', JSON.stringify(this.collapses))
        }
      },

      getTree() {
        clearInterval(this.timeStop); //清除定时器
        this.treeData = [];
        this.treeData = this.$store.state.showChain
        $.fn.zTree.init($("#dataTree"), this.setting, this.treeData);
        this.getTime()
      },

      getTPS() {
        if (this.$store.state.tpsLine && this.$store.state.tpsLine.length == 180) {
          this.tpsLine = this.$store.state.tpsLine
        } else {
          this.$store.commit('inintTPS')
        }
      },

      updateTPS() {
        let tpso = 5
        setInterval(() => {
          tpso--;
          let timeS = reDate(new Date(), 'HH:mm:ss').substring(reDate(new Date(), 'HH:mm:ss').length - 1,
            reDate(
              new Date(), 'HH:mm:ss').length)
          if (timeS == '0' || timeS == '5') {
            if (tpso > 0) {} else {
              if (this.webSocket.client && this.webSocket.client.readyState == 1 && this.$store.state.chainInfo[
                  'B'] && this.$store.state.chainInfo['B'].tps) {
                let obj = {
                  time: reDate(new Date(), 'HH:mm:ss'),
                  tps: this.$store.state.chainInfo['B'].tps
                }
                this.$store.commit('updateTPS', obj)
                tpso = 5
              } else {
                let obj = {
                  time: reDate(new Date(), 'HH:mm:ss'),
                  tps: 0
                }
                this.$store.commit('updateTPS', obj)
                tpso = 5
              }
            }
          } else {
            tpso = 1
          }
        }, 1000)
      },

      getTime() {
        this.timeo = 1
        this.timeStop = setInterval(() => {
          this.timeo--;
          if (this.timeo > 0) {} else {
            this.$store.commit('getTree')
          }
        }, 1000)
      },

      getRecently(val) {
        if (val <= 60) {
          return val
        } else if (val <= 3600) {
          return parseInt(val / 60) + 'm' + (val % 60)
        } else {
          return parseInt(val / 3600) + 'h' + parseInt((val % 3600) / 60) + 'm' + (val % 60)
        }
      },

    }
  }
</script>

<style lang="scss">
  /*ztree表格*/
  .ztree {
    padding: 0;
    height: calc(100vh - 170px);
    min-height: 630px;
  }

  .ztree li a {
    vertical-align: middle;
    height: 55px;
    padding: 0;
  }

  .ztree li>a {
    width: 90%;
  }

  .ztree li>a,
  .ztree li a.curSelectedNode {
    padding-top: 0px;
    background: none;
    height: 55px;
    border: none;
    cursor: default;
    opacity: 1;
  }

  .ztree li ul {
    padding-left: 0px;
  }

  .diy_swich {
    float: left;
    height: 50px;

    .node_name {
      color: transparent;
    }
  }

  .ztree div.chain_tree_node {
    height: 100%;
    width: 90%;
    line-height: 23px;
    text-align: left;
    display: inline-block;
    color: #6c6c6c;
    font-size: 12px;
    overflow: hidden;

    .tree_logo {
      width: 60px;
      height: 24px;
      padding: 12px 0;
      text-align: center;
      float: left;

      h3 {
        color: #fff;
        font-size: 14px;
      }
    }

    .tree_info {
      float: right;
      width: calc(100% - 70px);
      height: 48px;
      border-left: 1px solid rgb(226, 226, 226);
      border-right: 1px solid rgb(226, 226, 226);

      p {
        margin: 0 10px;
        padding-top: 3px;
      }

    }

    .tree_info_top {
      height: 22.5px;
      width: calc(100% - 70px);
      min-width: 431px;
      border-top: 1px solid rgb(226, 226, 226);
      border-bottom: 1px solid rgb(226, 226, 226);
    }

    .tree_info_bottom {
      height: 22.5px;
      width: calc(100% - 70px);
      min-width: 431px;
      border-bottom: 1px solid rgb(226, 226, 226);
    }
  }

  .databoard_block {
    .el-tree-node__content {
      height: 46px;
      margin: 5px 0;
    }

    .el-button--mini,
    .el-button--mini.is-round {
      padding: 0;
    }
  }
</style>

<style lang="scss" scoped>
  .databoard_block {
    margin-top: 10px;
    height: calc(100vh - 125px);
    min-height: 675px;
  }
</style>