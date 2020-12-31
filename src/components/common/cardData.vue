<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="board_card">
          <div slot="header">
            <span><i class="iconfont icon-tongji"></i>统计展示</span>
          </div>
          <div class="card_item">
            <p>网络存储 <i class="el-icon-info" style="float:right"></i></p>
            <h2>5.11 PiB</h2>
            <p>周同比 12%</p>
            <p>日均销售额</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="board_card">
          <div slot="header">
            <span><i class="iconfont icon-tongji"></i>统计展示</span>
          </div>
          <div class="card_item">
            <p>网络存储 <i class="el-icon-info" style="float:right"></i></p>
            <h2>5.11 PiB</h2>
            <p>周同比 12%</p>
            <p>日均销售额</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="board_card">
          <div slot="header">
            <span><i class="iconfont icon-tongji"></i>统计展示</span>
          </div>
          <div class="card_item">
            <p>网络存储 <i class="el-icon-info" style="float:right"></i></p>
            <h2>5.11 PiB</h2>
            <p>周同比 12%</p>
            <p>日均销售额</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      cardForm: {}
    },
    watch: {
      cardForm: {
        deep: true, // 深度监听
        handler(newVal, oldVal) {}
      },
      // blockMsg: function (n, o) {},
    },
    data() {
      return {
        time: '',
      }
    },
    computed: {
      // blockMsg() {
      //   if (this.$store.getters.blockinfo) {
      //     let results = this.$store.getters.blockinfo
      //     this.BlockInfo(results)
      //   }
      //   // let results = this.$store.getters.blockinfo
      //   // this.BlockInfo(results)
      // }
    },
    mounted() {},
    methods: {
      BlockInfo(data) {
        this.time = data[0].interval / 1000
      }
    }
  }
</script>

<style lang="scss">
  .board_card {
    i {
      margin-right: 5px
    }

    .el-card__header {
      padding: 7px 10px;
      font-size: 14px;
    }

    .el-card__body {
      padding: 8px;
    }
  }
</style>

<style lang="scss" scoped>
  .board_card {
    margin-top: 10px;
    height: calc(27.5vh - 46px);
    min-height: 174px;

    .card_item {
      padding: 0 40px;

      p {
        font-size: 12px;
        margin: 8px 0;
      }

      h2 {
        margin-bottom: 10px;
      }
    }
  }
</style>