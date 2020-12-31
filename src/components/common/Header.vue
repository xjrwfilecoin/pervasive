<template>
  <div class="headerC">
    <div class="wrapper">
      <div class="header">
        <i class="el-icon-s-home" @click="turnToHome"></i>
        <el-divider direction="vertical"></el-divider>
        {{ Title }}
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

<style scoped lang="scss">
</style>