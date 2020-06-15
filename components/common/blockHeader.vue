<template>
  <div>
    <p class="dashboard_title">Test dashboard</p>
    <div class="header_block">
      <el-select v-model="valueP" placeholder="请选择" size="mini">
        <el-option v-for="item in optionP" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-select v-model="num" placeholder="请选择" size="mini">
        <el-option v-for="item in optionP" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-select v-model="area" placeholder="请选择" size="mini">
        <el-option v-for="item in optionP" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" size="mini">查看</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {},
    data() {
      return {
        valueP: "信标链",
        num: "编号",
        area: "区块链高度",
        optionP: [{
            value: "信标链",
            label: "信标链"
          },
          {
            value: "中继链",
            label: "中继链"
          },
          {
            value: "分信链",
            label: "分信链"
          }
        ],
      }
    },
    methods: {}
  }

</script>

<style lang="scss">
  .header_block {
    .el-input__inner {
      background-color: transparent;
      border: 1px solid #409eff;
      color: #409eff;
    }
    // 选框颜色
    .el-input .el-select__caret {
      color: #409eff;
    }
    // hover颜色
    .el-select:hover .el-input__inner {
      border-color: #409eff;
    }
  }

</style>

<style lang="scss" scoped>
  .dashboard_title {
    color: #fff;
    width: 200px;
    float: left;
    margin-left: 20px;
    padding-top: 16px;
  }

  .header_block {
    float: right;
    height: 55px;
    padding: 13px 15px;

    .header_btn {
      height: 35px;
      width: 115px;
    }
  }

</style>
