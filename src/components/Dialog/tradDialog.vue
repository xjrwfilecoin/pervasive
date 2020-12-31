<template>
  <div>
    <el-dialog custom-class="trad_dialog" title="交易详情" :visible.sync="selfVisible" top="calc(50vh - 135px)" width="750px"
      :close-on-click-modal="false">
      <div class="mine_info">
        <p>交易哈希
          <span class="af">{{ tranForm.hash }}</span>
        </p>
      </div>
      <!-- <div class="mine_info">
        <p>状态
          <span class="af">成功</span>
        </p>
      </div>
      <div class="mine_info">
        <p>区块
          <span class="af">11263352</span>
        </p>
      </div>
      <div class="mine_info">
        <p>时间戳
          <span class="af">26561</span>
        </p>
      </div> -->
      <div class="mine_info">
        <p>发送方
          <span class="af">{{ tranForm.from }}</span>
        </p>
      </div>
      <div class="mine_info">
        <p>接收方
          <span class="af">{{ tranForm.to }}</span>
        </p>
      </div>
      <div class="mine_info">
        <p>交易费用
          <span class="af">{{ tranForm.amount }} FIL</span>
        </p>
      </div>
      <!-- <div class="mine_info">
        <p>其他
          <span class="af">其他</span>
        </p>
      </div> -->

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="selfVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      tradform: {}
    },
    watch: {
      visible(val) {
        this.selfVisible = val
        if (this.visible) {
          // this.clearForm()
          this.tranForm = this.tradform
        }
      },
      selfVisible(val) {
        this.$emit('update:visible', val)
      },
    },
    data() {
      return {
        selfVisible: this.visible, // 避免vue双向绑定警告
        tranForm: {
          hash: '',
          from: '', //发送方
          to: '', //接收方
          amount: '', //数量
        },
      }
    },
    methods: {

      clearForm() {
        this.tranForm = {}
      }

    }
  }
</script>

<style lang="scss">
  .trad_dialog {
    .el-dialog__header {
      padding: 8px 16px;
      background-color: #515D6D;
    }

    .el-dialog__title {
      line-height: 16px;
      font-size: 16px;
      color: #fff;
    }

    .el-dialog__headerbtn {
      top: 11px;

      .el-dialog__close {
        color: #fff;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .trad_dialog {
    .mine_info {
      border-bottom: 1px dashed #c9c9c9;
    }
  }
</style>