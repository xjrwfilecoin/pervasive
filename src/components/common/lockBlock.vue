<template>
  <div>
    <el-card>
      <div slot="header">
        <span><i class="iconfont icon-lock-block"></i>锁定区块信息</span>
      </div>
      <el-table :data="lockHash" ref="lockHash" border size="mini" @expand-change="getChildren" :row-key="getRowKeys"
        :expand-row-keys="expands" style="height: calc(45vh - 127px);min-height: 235px; overflow: auto;"
        :header-cell-style="{background:'#F0F4FB',color:'#2c2c2c'}">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="children" border size="mini" :header-cell-style="{background:'#F0F4FB',color:'#2c2c2c'}">
              <el-table-column label="交易" align="center">
                <template slot-scope="scope">
                  {{ scope.row.fromkey + '->' + scope.row.tokey }}
                </template>
              </el-table-column>
              <el-table-column prop="hash" label="哈希值" align="center" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="chainkey" label="区块编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.type + scope.row.chainkey }}
          </template>
        </el-table-column>
        <el-table-column prop="height" label="区块高度" align="center">
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
          this.queryData()
        },
        deep: true
      }
    },

    data() {
      return {
        lockHash: [],
        getRowKeys(row) {
          return row.type + row.chainkey;
        },
        expands: [],
        children: []
      }
    },

    methods: {
      // 获取表数据
      queryData() {
        this.lockHash = this.blockInfo.lockHash
      },

      getChildren(row, expandedRows) {
        this.expands = []
        this.children = []
        if (expandedRows.length > 0) {
          this.expands.push(row.type + row.chainkey)
          let params = {
            type: row.type, //链类型
            chainKey: row.chainkey,
            height: parseInt(row.height), //区块高度
            // hash: this.lockHash.hash, // hash 
          }
          this.webSocket.sendRequest('blockInfo', params).then((result) => {
            if (JSON.stringify(result) != "{}") {
              if (this.blockInfo.type == 'B') {
                this.children = result.detail.upStream
              } else if (this.blockInfo.type == 'R') {
                if (row.type == 'B') {
                  this.children = result.detail.downStream
                } else {
                  this.children = result.detail.upStream
                }
              } else if (this.blockInfo.type == 'S') {
                this.children = result.detail.downStream
              }
            }
          })
        }
      },
    }
  }
</script>