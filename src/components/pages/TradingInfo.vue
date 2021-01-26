<template>
  <div>
    <Header class="main_header" :Title="Title"></Header>
    <div class="wrapper">
      <div class="fblock_info">
        <el-card style="min-height: 177px;height: calc(25vh - 22.5px);">
          <div slot="header">
            <span><i class="iconfont iconqukuai"></i>所属区块</span>
            <span style="float:right">
              <el-button type="primary" size="mini" @click="turnToBlockInfo">返回</el-button>
            </span>
          </div>
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="mine_info" style="border-right: 1px dashed #c9c9c9;">
                <p>所属区块
                  <span class="af">{{ basicInfo.father }}</span>
                </p>
              </div>
              <div class="mine_info" style="border-right: 1px dashed #c9c9c9;">
                <p>区块高度
                  <span class="af">{{ basicInfo.height }}</span>
                </p>
              </div>
              <div class="mine_info" style="border-right: 1px dashed #c9c9c9;">
                <p>区块大小
                  <span class="af">{{ basicInfo.size }} KB</span>
                </p>
              </div>
              <div class="mine_info" style="border-right: 1px dashed #c9c9c9;">
                <p>间隔时间
                  <span class="af">{{ basicInfo.interval }} S</span>
                </p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="mine_info">
                <p> 区块哈希
                  <span class="af">{{ basicInfo.hash }}</span>
                </p>
              </div>
              <div class="mine_info">
                <p> 矿工号
                  <span class="af">{{ basicInfo.miner }}</span>
                </p>
              </div>
              <div class="mine_info">
                <p>交易笔数
                  <span class="af">{{ basicInfo.trans }}</span>
                </p>
              </div>
              <div class="mine_info">
                <p>生成时间
                  <span class="af">{{ reDate(basicInfo.time) }}</span>
                </p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <div class="trad_list">
        <el-card style="min-height: 532px;height: calc(75vh - 70px);">
          <div slot="header">
            <span><i class="iconfont iconqukuai"></i>分片交易列表</span>
          </div>
          <el-table :data="tradList" stripe border size="mini" height="calc(75vh - 120px)"
            :header-cell-style="{background:'#F0F4FB',color:'#2c2c2c'}">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="hash" label="交易哈希" min-width="330" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="from" label="发送方" min-width="330" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="to" label="接收方" min-width="220" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="amount" label="金额（ME）" min-width="200" align="center">
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="showDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination style="text-align:center" layout="total, prev, pager, next, jumper" :total="Total"
            :page-size="Size" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination> -->
        </el-card>
      </div>
    </div>

    <tradDialog :tradform="tradForm" :visible.sync="tradDialog" @close="closeDialog">
    </tradDialog>
  </div>
</template>

<script>
  import Header from '@/components/common/Header'
  import tradDialog from '@/components/Dialog/tradDialog'

  import moment from 'moment'

  export default {
    name: 'TradingInfo',

    components: {
      Header,
      tradDialog
    },
    computed: {
      reDate() {
        return function (data) {
          return moment(data).format("YYYY-MM-DD HH:mm:ss")
        }
      }
    },

    watch: {
      $route() {
        if (this.$route.path == '/tradinginfo') {
          let parameters = this.$store.getters.parameters;
          this.chainKey = parameters.chainKey
          this.from = parameters.from
          this.to = parameters.to
          this.height = parameters.height
          this.getBlockInfo()
          this.getTradList()
        }
      },
    },

    data() {
      return {
        Title: '链分片交易',
        chainKey: '',
        from: '',
        to: '',
        height: '',

        // blockInfo基本信息
        basicInfo: {
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

        tradList: [],
        // Total: 0,
        // currentPage: 1,
        // Size: 10,
        tradDialog: false,
        tradForm: {}
      }
    },

    mounted() {
      let parameters = this.$store.getters.parameters;
      this.chainKey = parameters.chainKey
      this.from = parameters.from
      this.to = parameters.to
      this.height = parameters.height
      this.getBlockInfo()
      this.getTradList()
    },
    methods: {
      turnToBlockInfo() {
        this.$store.commit("setParameters", {
          type: 'S',
          chainKey: this.chainKey,
          height: this.height, //区块高度
        });
        this.$router.push('/blockinfo')
      },

      getBlockInfo() {
        if (this.$store.state.blockInfo.chainKey && this.$store.state.blockInfo.chainKey != '') {
          this.basicInfo = this.$store.state.blockInfo
        } else {
          let params = {
            type: 'S',
            chainKey: this.chainKey,
            height: parseInt(this.height),
          }
          this.webSocket.sendRequest('blockInfo', params).then((result) => {
            if (JSON.stringify(result) != "{}") {
              this.basicInfo = result
            }
          }).catch((error) => {
            this.$message.warning(error)
          })
        }
      },

      getTradList() {
        let params = {
          height: parseInt(this.height), //区块高度
          fromShard: this.from,
          toShard: this.to,
        }
        this.webSocket.sendRequest('ssInfo', params).then((result) => {
          this.tradList = result
        }).catch((error) => {
          this.$message.warning(error)
        })
      },

      showDetail(val) {
        this.tradForm = val
        this.tradDialog = true
      },

      closeDialog() {
        this.tradDialog = false
      },


      // handleCurrentChange(value) {
      //   this.currentPage = value
      // }
    }
  }
</script>

<style lang="scss">
  .trad_list {

    .el-table td.gutter,
    .el-table th.gutter {
      background-color: #F0F4FB;
    }
  }
</style>

<style lang="scss" scoped>
  .fblock_info {
    height: calc(25vh - 22.5px);
    margin-top: 10px;

    .mine_info {
      margin-top: 3px;
    }
  }

  .trad_list {
    margin-top: 10px;
  }
</style>