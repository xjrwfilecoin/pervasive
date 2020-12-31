<template>
  <div>
    <chooseHeader class="main_header"></chooseHeader>
    <div class="wrapper">
      <div class="databoard_block">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-card style="min-height: 680px;height: calc(100vh - 120px);">
              <div slot="header">
                <span><i class="iconfont icon-ChainInfo"></i>普适链结构</span>
              </div>
              <div class="layer">
                <div id="tableMain">
                  <ul id="dataTree" class="ztree"></ul>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="13">
            <el-card style="height: calc(45vh - 54px); min-height: 308px">
              <div slot="header">
                <span><i class="iconfont icon-Up"></i>出块量</span>
              </div>
              <blockBar id="blockBar" style="height:calc(40vh - 60px); min-height:260px; margin:0 auto"
                :value="totalFlow" :width="LineWidth">
              </blockBar>
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
  import "@/lib/ztree_v3/css/zTreeStyle/zTreeStyle.css"

  // import tree from "vue-giant-tree";
  import chooseHeader from '@/components/common/chooseHeader'
  import blockBar from '@/components/Echarts/blockBar'
  import cardData from '@/components/common/cardData'

  import {
    mapState,
    mapActions
  } from 'vuex'

  export default {
    components: {
      // tree,
      chooseHeader,
      blockBar,
      cardData,
    },
    computed: {
      ...mapState({ //等价于上面的写法
        chainInfo: state => _.values(state.chainInfo),
      })
    },
    watch: { //监听值改变
      chainInfo: {
        handler(newVal, oldVal) {
          this.getTree()
        }
      },
    },

    data() {
      return {
        treeData: [],
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
            nameIsHTML: true,
            selectedMulti: false,
          },
          callback: {
            onRightClick: this.zTreeOnRightClick
            // onDblClick: this.onDblClick,
            // onClick: this.onNodeClick
          }
        },

        totalFlow: [],
        LineWidth: '600',
      }
    },
    mounted() {
      this.getTree()
    },

    methods: {
      zTreeOnRightClick: function (e, treeId, treeNode) {
        this.$router.push({
          path: '/blockinfo',
          query: {
            type: treeNode.type,
            chainKey: treeNode.chainKey,
            height: treeNode.height, //区块高度
            hash: treeNode.hash, // hash 
          }
        })
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
          treeNode.type +
          '</h3></div><div class="tree_info"><div class="tree_info_top"> 时间 | 最近：' + parseFloat(treeNode.interval)
          .toFixed(3) + ' s | 平均：' + parseFloat(treeNode.average).toFixed(3) +
          ' s</div><div class="tree_info_bottom"> 区块 | 高度：<span>' +
          // '<a style="height:18.5px;color:#409EFF" href="http://110.185.107.125:8090/blockinfo?type=' + treeNode.type +
          '<a style="height:18.5px;color:#409EFF" href="http://localhost:8090/blockinfo?type=' + treeNode.type +
          '&chainKey=' + treeNode.chainKey + '&height=' + treeNode.height + '">' + treeNode.height + '</a>' +
          '</span> | TPS：' + parseFloat(treeNode.tps).toFixed(1) + ' | 交易数：' + treeNode.trans + ' | 大小：' + parseFloat(
            treeNode.size /
            1024).toFixed(0) + ' KB </div></div></div>'

        aObj.append(editStr);
      },

      // 展开或关闭所有节点
      expandAndCloseNode: function (e) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        if (e) {
          this.isShowicon2 = false;
          this.isShowicon1 = true;
        } else {
          this.isShowicon2 = true;
          this.isShowicon1 = false;
        }
        zTree.expandAll(e);
      },

      getTree() {
        this.treeData = [];
        let chainInfo = _.clone(this.$store.state.chainInfo);

        let relays = {};
        let shards = [];

        _.mapValues(chainInfo, (item) => {
          item.id = item.type + item.chainKey
          item.name = item.type + item.chainKey
          item.tps = 0.0
          switch (item.type) {
            case 'B':
              item.pid = 0
              item.color = '#0099cc'
              item.children = []
              break;

            case 'R':
              item.pid = 'B'
              item.color = '#52aac7'
              item.children = []
              relays[item.name] = item
              break;

            case 'S':
              if (item.interval == 0) {
                item.tps = 0.0
              } else {
                item.tps = parseFloat(item.trans / item.interval)
              }
              item.pid = 'R' + item.chainKey.substring(0, 2)
              item.color = '#b7d0d9'
              shards.push(item);
              break;
          }
        })

        _.each(shards, (item) => {
          if (relays[item.pid]) {
            relays[item.pid].tps = parseFloat(relays[item.pid].tps) + parseFloat(item.tps)
            chainInfo['B'].tps = parseFloat(chainInfo['B'].tps) + parseFloat(item.tps)
          }
        })
        this.treeData = _.values(chainInfo)
        $.fn.zTree.init($("#dataTree"), this.setting, this.treeData).expandAll(true);
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
    overflow-y: auto;
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
      width: 48px;
      height: 24px;
      padding: 12px 0;
      text-align: center;
      float: left;

      h3 {
        color: #fff;
        font-size: 18px;
      }
    }

    .tree_info {
      float: right;
      width: calc(100% - 50px);
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
      width: calc(100% - 110px);
      min-width: 430px;
      border-top: 1px solid rgb(226, 226, 226);
      border-bottom: 1px solid rgb(226, 226, 226);
    }

    .tree_info_bottom {
      height: 22.5px;
      width: calc(100% - 110px);
      min-width: 430px;
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