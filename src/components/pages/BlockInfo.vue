<template>
  <div>
    <Header class="main_header" :Title="Title"></Header>
    <div class="wrapper">
      <div class="block_search">
        <el-form :inline="true" :model="blockSearch" ref="blockSearch" size="mini">
          <el-form-item label="区块类型：">
            <el-select v-model="blockSearch.type" placeholder="请选择" style="width:150px" @change="getChainKey">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider direction="vertical"></el-divider>
          <el-form-item label="链编号：">
            <el-input v-model="blockSearch.chainKey" placeholder="请输入链编号" style="width:150px" maxlength="4"
              :disabled="blockSearch.type=='B'"></el-input>
          </el-form-item>
          <el-divider direction="vertical"></el-divider>
          <el-form-item label="区块高度：">
            <el-input v-model="blockSearch.height" placeholder="请输入区块高度" style="width:250px"
              onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getBlockInfo()">查询</el-button>
            <el-button type="primary" size="mini" @click="clearSearch()">清除</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button type="primary" size="mini" @click="turnToDB">返回</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="block_info">
        <el-row :gutter="10">
          <el-col :span="15">
            <el-card style="height: calc(45vh - 77px);min-height: 285px;">
              <div slot="header">
                <span><i class="iconfont icon-block"></i>区块信息</span>
              </div>
              <div class="mine_info">
                <p>区块高度
                  <span class="af">{{ blockInfo.height }}</span>
                </p>
              </div>
              <div class="mine_info">
                <p>父区块哈希
                  <span class="af">{{ blockInfo.father }}</span>
                </p>
              </div>
              <div class="mine_info">
                <p>区块哈希
                  <span class="af">{{ blockInfo.hash }}</span>
                </p>
              </div>
              <!-- <div class="mine_info">
                <p>VRF结果
                  <span class="af">{{ blockInfo.vrf }}</span>
                </p>
              </div> -->
              <div class="mine_info">
                <p>区块大小
                  <span class="af">{{ blockInfo.size }} KB</span>
                </p>
              </div>
              <div class="mine_info">
                <p>交易笔数
                  <span class="af">{{ blockInfo.trans }}</span>
                </p>
              </div>
              <div class="mine_info">
                <p>
                  <span class="fon">间隔时间</span>
                  <span class="af">{{ blockInfo.interval }}S</span>
                </p>
              </div>
              <div style="padding: 8px 16px 0 16px;height: 20px;">
                <p>生成时间
                  <span style="float:right">{{ reDate(blockInfo.time) }}</span>
                </p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="9">
            <lockBlock :blockInfo="blockInfo"></lockBlock>
          </el-col>

          <el-col v-show="!beconds" :span="relays ? 12 : 24">
            <upStream :blockInfo="blockInfo" style="margin-top: 10px"></upStream>
          </el-col>

          <el-col :span="relays ? 12 : 24">
            <downStream :blockInfo="blockInfo" style="margin-top: 10px"></downStream>
          </el-col>
        </el-row>
      </div>
    </div>

    <toastDialog :message="message" :visible.sync="toastDialog" @close="closeDialog">
    </toastDialog>
  </div>
</template>

<script>
  import Header from '@/components/common/Header'
  import lockBlock from '@/components/common/lockBlock'
  import upStream from '@/components/common/upStream'
  import downStream from '@/components/common/downStream'
  import toastDialog from '@/components/Dialog/toastDialog'

  import moment from 'moment'

  export default {
    name: 'BlockInfo',

    components: {
      Header,
      lockBlock,
      upStream,
      downStream,
      toastDialog
    },
    watch: {
      $route() {
        if (this.$route.path == '/blockinfo') {
          this.blockSearch.type = this.$router.currentRoute.query.type
          this.blockSearch.chainKey = this.$router.currentRoute.query.chainKey
          this.blockSearch.height = this.$router.currentRoute.query.height + ''
          this.getBlockInfo()
        }
      },
    },

    data() {
      return {
        toastDialog: false,
        message: '',

        Title: '链区块信息',
        hash: '',
        typeOptions: [{
          value: 'B',
          label: '信标'
        }, {
          value: 'R',
          label: '中继'
        }, {
          value: 'S',
          label: '分片'
        }],

        blockSearch: {
          type: 'B',
          chainKey: '',
          height: ''
        },

        blockInfo: {
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
          lockHash: [{
            type: '',
            chainKey: '',
            height: 0,
          }],
          upHash: '',
          downHash: '',
          detail: {
            upStream: [{
              fromKey: '',
              toKey: '',
              hash: ''
            }], //上传hash组 S-R
            downStream: [{
              fromKey: '',
              toKey: '',
              hash: ''
            }], //下传hash组
            ss: [{
              fromShard: '', //shardKey	
              toShard: '', //shardKey	
              fromRelay: '', //relayKey	
              toRelay: '', //relayKey
              hash: '',
              trans: [{
                hash: '',
                from: '',
                to: '',
                amount: '',
              }]
            }]
          }, //详情 
        },

        expands: [],
        upStream: [],
        beconds: false,
        relays: false, // 是否显示下行交易
        // shards: false
      }
    },
    computed: {
      reDate() {
        return function (data) {
          return moment(data).format("YYYY-MM-DD HH:mm:ss")
        }
      }
    },

    mounted() {
      this.blockSearch.type = this.$router.currentRoute.query.type
      this.blockSearch.chainKey = this.$router.currentRoute.query.chainKey
      this.blockSearch.height = this.$router.currentRoute.query.height + ''
      // this.hash = this.$router.currentRoute.query.hash
      this.getBlockInfo()
    },

    methods: {
      turnToDB() {
        this.$router.push('/databoard')
      },

      getBlockInfo() {
        if (!this.blockSearch.type) {
          this.$message.warning('请选择区块类型')
          return
        }
        if (!this.blockSearch.chainKey && this.blockSearch.type != 'B') {
          this.$message.warning('请输入链编号')
          return
        }
        if (!this.blockSearch.height) {
          this.$message.warning('请输入区块高度')
          return
        }

        let params = {
          type: this.blockSearch.type,
          chainKey: this.blockSearch.chainKey,
          height: parseInt(this.blockSearch.height),
          // hash: this.hash
        }
        this.webSocket.sendRequest('blockInfo', params).then((result) => {
          if (JSON.stringify(result) != "{}") {
            if (this.blockSearch.type == 'B') {
              this.beconds = true
              this.relays = false
              // this.shards = false
            } else if (this.blockSearch.type == 'R') {
              this.beconds = false
              this.relays = true
              // this.shards = false
            } else if (this.blockSearch.type == 'S') {
              this.beconds = false
              this.relays = false
              // this.shards = true
            }
            this.blockInfo = result
          } else {
            this.message = '查询不到数据'
            this.toastDialog = true
          }
        }).catch((error) => {
          this.$message.warning(error)
        })
      },

      getChainKey(val) {
        this.search = false
        if (val == 'B') {
          this.blockSearch.chainKey = ''
        }
      },

      clearSearch() {
        this.blockSearch = {}
      },

      closeDialog() {
        this.toastDialog = false
      },
    }
  }
</script>

<style lang="scss">
  .block_search {

    .el-form-item--mini.el-form-item {
      margin-bottom: 0;
    }

    .el-form-item__label,
    .el-input__inner {
      height: 24px;
    }

    .el-form-item__label {
      font-size: 12px;
      color: #fff;
    }

    .el-divider--vertical {
      width: 1px;
      height: 15px;
      padding-top: 8px;
    }
  }

  .block_info {
    .el-table__expanded-cell {
      padding: 0;
    }
  }
</style>

<style lang="scss" scoped>
  .block_search {
    height: 27px;
    border-radius: 8px;
    margin-top: 10px;
    padding: 9px 16px;
    background-color: #727C98;
  }

  .block_info {
    margin-top: 10px;
    height: calc(45vh - 61px);
    min-height: 300px;

    .mine_info {
      border-bottom: 1px dashed #c9c9c9;
      margin-top: 5px;
    }
  }
</style>