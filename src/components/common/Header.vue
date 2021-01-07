<template>
  <div class="headerC">
    <div class="wrapper">
      <div class="header">
        <div class="home_btn">
          <el-button icon="el-icon-s-home" @click="turnToHome"></el-button>
          <el-divider direction="vertical"></el-divider>
          {{ Title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      Title: String
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      turnToHome() {
        this.$router.push('/databoard')
      }
    }
  }
</script>

<style lang="scss">
  .home_btn {
    .el-button {
      background: transparent;
      border: none;
      padding: 0;
      font-size: 26px;
      color: #fff;
    }
  }
</style>