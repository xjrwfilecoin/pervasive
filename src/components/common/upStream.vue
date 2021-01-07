<template>
  <div>
    <el-card>
      <div slot="header">
        <span><i class="iconfont icon-Up"></i>上行交易包信息</span>
      </div>
      <div class="upHash">
        <div style="float:left; text-align:center; height: 100%" :style="relays ? 'width:95px' : 'width:190px'">
          <p>UP哈希值</p>
        </div>
        <div style="float:right; text-align:center; height: 100%"
          :style="relays ? 'width:420px;padding-right:80px' : 'width:840px;padding-right:160px'">
          <p>{{ blockInfo.upHash }}</p>
        </div>
      </div>

      <el-table :data="upStream" ref="upStream" border size="mini" @expand-change="getChildren" :row-key="getRowKeys"
        :expand-row-keys="expands" :header-cell-style="{background:'#F0F4FB',color:'#2c2c2c'}"
        style="height: calc(55vh - 170px);min-height: 269px; margin-top:10px; overflow: auto;">
        <el-table-column type="expand" v-if="blockInfo.type == 'S'">
          <template slot-scope="props">
            <el-table :data="children" border size="mini" :header-cell-style="{background:'#F0F4FB',color:'#2c2c2c'}">
              <el-table-column label="交易" align="center" :min-width="relays ? 95 : 190">
                <template slot-scope="scope">
                  {{ scope.row.fromShard + '->' + scope.row.toShard }}
                </template>
              </el-table-column>
              <el-table-column prop="hash" label="哈希值" align="center" show-overflow-tooltip
                :min-width="relays ? 370 : 790">
              </el-table-column>
              <el-table-column prop="amount" label="交易数量" align="center" :min-width="relays ? 95 : 190">
                <template slot-scope="scope">
                  <el-button type="text" @click="turnToTrad(scope.row)">{{ scope.row.trans }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column :label="tableLabel" align="center" :min-width="relays ? 95 : 190">
          <template slot-scope="scope">
            {{ scope.row.fromkey + '->' +  scope.row.tokey }}
          </template>
        </el-table-column>
        <el-table-column prop="hash" label="哈希值" align="center" :min-width="relays ? 370 : 790">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: {
      blockInfo: {}
    },

    watch: {
      blockInfo: {
        handler(newValue, oldValue) {
          if (newValue.type == 'B') {
            this.relays = false
            this.tableLabel = '跨中继交易组'
          } else if (newValue.type == 'R') {
            this.relays = true
            this.tableLabel = '跨中继交易组'
          } else if (newValue.type == 'S') {
            this.relays = false
            this.tableLabel = '跨分片交易组'
          }
          this.queryData()
        },
        deep: true
      }
    },

    data() {
      return {
        relays: false,
        tableLabel: '跨中继交易组',
        upStream: [],
        getRowKeys(row) {
          return row.hash
        },
        expands: [],
        children: []
      }
    },

    methods: {
      // 获取表数据
      queryData() {
        if (this.blockInfo.type == 'S') {
          this.blockInfo.detail.upStream.map(item => {
            item.hasChildren = true;
          });
        }
        this.upStream = this.blockInfo.detail.upStream
      },

      getChildren(row, expandedRows) {
        this.expands = []
        this.children = []
        if (expandedRows.length > 0) {
          this.expands.push(row.hash)
          let params = {
            height: parseInt(this.blockInfo.height), //区块高度
            fromShard: row.fromkey,
            toShard: row.tokey,
          }
          this.webSocket.sendRequest('ssInfo', params).then((result) => {
            if (JSON.stringify(result) != "{}") {
              this.children = result
            }
          }).catch((error) => {
            this.$message.warning(error)
          })
        }
      },

      turnToTrad(row) {
        this.$router.push({
          path: '/tradinginfo',
          query: {
            // type: this.blockInfo.type,
            chainKey: this.blockInfo.chainKey,
            // hash: this.blockInfo.hash, // hash 
            from: row.fromShard,
            to: row.toShard,
            height: this.blockInfo.height
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .child_card {

    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 1px solid #fff;
    }
  }
</style>

<style lang="scss" scoped>
  .upHash {
    height: 16px;
    background-color: rgb(240, 244, 251);
    margin-bottom: 5px;
    padding: 10px 0;

    p {
      font-weight: 550;
    }
  }
</style>