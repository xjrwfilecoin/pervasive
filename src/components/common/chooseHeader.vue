<template>
  <div class="headerC">
    <div class="wrapper">
      <div class="header">
        Hypera浏览器
        <div style="text-align:right; float:right; margin-top:5px">
          <el-button size="small" @click="changeTest(10)">10K测试</el-button>
          <el-button size="small" @click="changeTest(100)">100K测试</el-button>
          <el-button size="small" @click="changeTest(500)">500K测试</el-button>
          <el-button size="small" @click="changeTest(1000)">1M测试</el-button>
        </div>
      </div>
    </div>

    <toastDialog :message="message" :visible.sync="toastDialog">
    </toastDialog>
  </div>
</template>

<script>
  import toastDialog from '@/components/Dialog/toastDialog'

  export default {
    components: {
      toastDialog
    },

    data() {
      return {
        toastDialog: false,
        message: '',
      }
    },

    created() {},
    mounted() {},

    methods: {
      changeTest(val) {
        let params = {
          type: 'S', //[B|R|S], 链类型
          cmd: {
            key: 'transfer',
            params: {
              amount: val * 1000
            }
          }, // 命令  
        }
        this.$confirm('是否确认开始测试?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'testMessage'
        }).then(() => {
          this.webSocket.sendRequest('cmd', params).then((result) => {
            if (result) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
            } else {
              this.message = '15秒内只能测试一次'
              this.toastDialog = true
            }
          })
        }).catch((error) => {
          this.$message.warning(error)
        })
      },
    }
  }
</script>

<style lang="scss">
  .el-message-box {
    border: 0;

    .el-message-box__header {
      padding: 8px 16px;
      background-color: #515D6D;
    }

    .el-message-box__title {
      line-height: 16px;
      font-size: 16px;
      color: #fff;
    }

    .el-message-box__headerbtn {
      top: 11px;

      .el-message-box__close {
        color: #fff;
      }
    }

    .el-button {
      width: 75px;
      height: 25px;
    }

    .el-button--small {
      padding: 0;
    }
  }
</style>

<style scoped lang="scss">
  .header {
    button {
      width: 90px;
      height: 30px;
    }
  }

  .testMessage {
    width: 750px;
  }
</style>