<template>
  <div>
    <el-card>
      <div slot="header">
        <span><i class="iconfont icon-Down"></i>下行交易包信息</span>
      </div>
      <div class="downHash">
        <div style="float:left; text-align:center; height: 100%; width:95px">
          <p>DOWN哈希值</p>
        </div>
        <div style="float:right; text-align:center; height: 100%"
          :style="relays ? 'width:420px;padding-right:80px' : 'width:840px;padding-right:160px'">
          <p>{{ blockInfo.downHash }}</p>
        </div>
        <!-- <div style="float:right; text-align:center; height: 100%; width:420px;padding-right:80px">
          <p>{{ blockInfo.downHash }}</p>
        </div> -->
      </div>

      <el-table ref="downStream" :data="blockInfo.detail.downStream" border size="mini"
        :header-cell-style="{background:'#F0F4FB',color:'#2c2c2c'}"
        style="height: calc(55vh - 170px);min-height: 269px; margin-top:10px; overflow: auto;">
        <el-table-column label="跨中继交易组" align="center" min-width="95">
          <template slot-scope="scope">
            {{ scope.row.fromkey + '->' +  scope.row.tokey }}
          </template>
        </el-table-column>
        <el-table-column prop="hash" label="哈希值" align="center" min-width="420">
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
        },
        deep: true
      }
    },

    data() {
      return {
        relays: false
      }
    },

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .downHash {
    height: 16px;
    background-color: rgb(240, 244, 251);
    margin-bottom: 5px;
    padding: 10px 0;

    p {
      font-weight: 550;
    }
  }
</style>