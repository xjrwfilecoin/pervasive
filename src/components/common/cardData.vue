<template>
  <div>
    <el-card class="board_card">
      <div slot="header">
        <span><i class="iconfont iconprofile"></i>测试说明</span>
      </div>
      <h3>本测试用于展示大象链使用1024分片实现64K－100K TPS的效果</h3>
      <p style="margin-top:20px"> &nbsp; &nbsp; &nbsp;
        10K／100K／500K／1M测试按钮每次点击时将会自动在各个分片中生成相应数量的随机的交易，交易由某个节点地址生成，把1000枚资产转移给不同分片上的不同的目标地址。</p>
      <p> &nbsp; &nbsp; &nbsp;可以从上述图表看到全网的总TPS数的变化情况；</p>
      <p> &nbsp; &nbsp; &nbsp;左侧图表展示了信标链、中继链和分片链的出块及数据信息，点击列表中相应的高度数据可以看到相应的区块中的交易详细信息。</p>
      <h4> &nbsp; &nbsp;
        &nbsp;MeChain(大象)链是目前唯一能够真正在广域公网上实现数万TPS的区块链项目。大象链采用分层分片技术，能够联接全球数十亿台计算机形成统一的存储、流量、交易的信息传播和价值转移网络，任何一个组织或个人都可以为这个网络提供服务，也可以自由获得该资源池提供的服务。
      </h4>
      <h3 style="color:orange"> &nbsp; &nbsp; &nbsp;MeChain链－－存储文明，传播信息，传递价值</h3>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: {},
    watch: {},
    data() {
      return {
        time: '',
      }
    },
    computed: {},
    mounted() {},
    methods: {}
  }
</script>

<style lang="scss">
  .board_card {
    .el-card__body {
      padding: 20px 36px;
    }
  }
</style>

<style lang="scss" scoped>
  .board_card {
    margin-top: 10px;
    height: calc(55vh - 51px);
    min-height: 390px;

    h4 {
      font-size: 13px;
      font-weight: 500;
      line-height: 25px;
      margin-top: 15px;
    }

    p {
      font-size: 12px;
      color: rgb(109, 108, 108);
      line-height: 20px;
    }

    h3 {
      font-size: 14px;
      font-weight: 550;
      color: #409EFF;
      text-align: center;
      margin: 20px 0;
    }
  }
</style>