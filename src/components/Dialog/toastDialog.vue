<template>
  <div>
    <el-dialog custom-class="trad_dialog" title="交易详情" :visible.sync="selfVisible" top="calc(50vh - 87px)"
      width="750px" :close-on-click-modal="false">
      {{ message }}
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
      message: String
    },
    watch: {
      visible(val) {
        this.selfVisible = val
        if (this.visible) {
        }
      },
      selfVisible(val) {
        this.$emit('update:visible', val)
      },
    },
    data() {
      return {
        selfVisible: this.visible, // 避免vue双向绑定警告
      }
    },
    methods: {

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