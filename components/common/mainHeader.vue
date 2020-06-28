<template>
  <div>
    <p class="dashboard_title">Test dashboard</p>
    <div class="header_div">
      <el-button type="primary" class="header_btn" @click="CmdTest()">10K 测试</el-button>
      <el-button type="warning" class="header_btn">100K 测试</el-button>
      <el-button type="danger" class="header_btn">500K 测试</el-button>
      <el-button type="success" class="header_btn">1M 测试</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {},
    data() {
      return {}
    },
    methods: {
      CmdTest() {
        let obj = {
          uri: 'cmd',
          body: {
            type: "s",
            cmd: {
              key: "transfer",
              params: {
                amount: 10000
              }
            }
          }
        }
        this.$store.dispatch("WEBSOCKET_REIVE", obj);
      }
    }
  }

</script>

<style lang="scss" scoped>
  .dashboard_title {
    color: #fff;
    width: 200px;
    float: left;
    margin-left: 20px;
    padding-top: 16px;
  }

  .header_div {
    float: right;
    height: 55px;
    padding: 10px 15px;

    .header_btn {
      height: 35px;
      width: 115px;
    }
  }

</style>
