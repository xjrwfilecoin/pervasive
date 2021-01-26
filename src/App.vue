<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },

    created() { //页面刷新store数据备份
      //在页面加载时读取localStorage里的状态信息
      let parameters = localStorage.getItem("parameters")
      if (parameters != null && parameters != undefined && parameters != '') {
        this.$store.state.parameters = JSON.parse(parameters);
      }

      //在页面刷新时将vuex里的信息保存到localStorage里
      window.addEventListener("beforeunload", () => {
        localStorage.setItem("parameters", JSON.stringify(this.$store.state.parameters))
      })
    }
  }
</script>

<style lang="scss">
  @import "assets/css/main.css";
</style>