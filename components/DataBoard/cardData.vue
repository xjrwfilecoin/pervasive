<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card class="board_card">
          <div class="item">
            <div class="mainItem">
              <p>上一个区块交易数
                <span>
                  <el-popover placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容。">
                    <i class="el-icon-warning-outline" slot="reference"></i>
                  </el-popover>
                </span>
              </p>
              <h3>213131</h3>
            </div>
            <p class="line"></p>
            <div class="itemRate">
              <p class="left_p">出块时间</p>
              <h3>{{ time }}s</h3>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="board_card">
          <div class="item">
            <div class="mainItem">
              <p>最近一百个区块平均交易数
                <span>
                  <el-popover placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容。">
                    <i class="el-icon-warning-outline" slot="reference"></i>
                  </el-popover>
                </span>
              </p>
              <h3>213131</h3>
            </div>
            <p class="line"></p>
            <div class="itemRate">
              <p class="left_p">最近一百个区块平均交易数</p>
              <h3>2s</h3>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="board_card">
          <div class="item">
            <div class="mainItem">
              <p>100平均宽度
                <span>
                  <el-popover placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容。">
                    <i class="el-icon-warning-outline" slot="reference"></i>
                  </el-popover>
                </span>
              </p>
            </div>
            <h3 class="ms">3.58Mb/s</h3>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TWEEN from '@tweenjs/tween.js'

  export default {
    props: {
      cardForm: {}
    },
    watch: {
      cardForm: {
        deep: true, // 深度监听
        handler(newVal, oldVal) {}
      },
      blockMsg: function (n, o) {},
    },
    data() {
      return {
        time: '',
      }
    },
    computed: {
      blockMsg() {
        if (this.$store.getters.blockinfo) {
          let results = this.$store.getters.blockinfo
          this.BlockInfo(results)
        }
        // let results = this.$store.getters.blockinfo
        // this.BlockInfo(results)
      }
    },
    mounted() {},
    methods: {
      BlockInfo(data) {
        console.log('------------------------',data)
        this.time = data[0].interval/1000
      }
    }
  }

</script>

<style lang="scss">
  .board_card {
    .el-card__body {
      padding: 10px 8px;
      height: 100%;
    }
  }

</style>

<style lang="scss" scoped>
  .board_card {
    height: 20vh;
    text-align: center;

    .item {
      height: 100%;

      .mainItem {
        height: 50%;

        p {
          font-size: 12px;
        }

        i {
          margin-left: 5px;
        }
      }

      .line {
        border-top: 1px solid black;
      }

      .itemRate {
        height: 50%;

        .left_p {
          text-align: left;
          font-size: 12px;
          margin-top: 5px;
        }

        h3 {
          font-weight: 550;
        }
      }
    }

    h3 {
      font-size: 30px;
      font-weight: bold;
      margin-top: 10px;
      color: #63b8ff;
    }

    .ms {
      margin-top: -18px;
      font-weight: 550;
    }
  }

</style>
