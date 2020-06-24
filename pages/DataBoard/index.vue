<template>
  <div>
    <Header class="main_header"></Header>
    <div class="board_Data">
      <el-row :gutter="15" style="width:100%;margin-left:0;">
        <!-- <el-col :span="12">
          <el-card class="tpsLine_data">
            <chartLine id="tpsLine_one" style="height:30vh;margin:0 auto" :text="textTPS" :subtext="subTPS"
              :value="totalFlow" :width="LineWidth" />
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="tpsLine_data">
            <chartLine id="tpsLine_two" style="height:30vh;margin:0 auto" :text="textWide" :subtext="subWide"
              :value="totalFlow" :width="LineWidth" />
          </el-card>
        </el-col> -->

        <el-col :span="12">
          <el-card class="block_data">
            <blockData :value="chainList" :addInfo="eventInfo"></blockData>
          </el-card>
        </el-col>

        <el-col :span="12">
          <cardData style="height:20vh;margin:1.5vh 0" :cardForm="cardForm"></cardData>
          <el-card class="areaLine_data">
            <!-- <changeLine id="chageLine" style="height:30vh;margin:0 auto" :value="totalFlow" :width="LineWidth">
            </changeLine> -->
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/common/mainHeader'
  import chartLine from '@/components/DataBoard/chartLine'
  import blockData from '@/components/DataBoard/blockData'
  import cardData from '@/components/DataBoard/cardData'
  import changeLine from '@/components/DataBoard/changeLine'

  import {
    getMarketData,
    MinerProfitByTime,
    MinerPowerByTime
  } from '@/api/manage'
  import {
    jsTime,
    formatDateTime
  } from "~/utils/tools";
  // import {
  //   sendSock,
  //   getCallBack,
  //   closeWebSocket
  // } from '@/utils/websocket.js'

  export default {
    components: {
      Header,
      chartLine,
      blockData,
      cardData,
      changeLine,
    },
    data() {
      return {
        textTPS: 'TPS',
        subTPS: '运行曲线图',
        textWide: '带宽',
        subWide: '数据情况',
        chainList: [],
        totalFlow: [],
        countNode: [],
        cardForm: {},
        LineWidth: '560',
        eventInfo: []
      }
    },
    watch: {
      blockMsg: function (n, o) {},
      // websockMsg: function (n, o) {
      //   if (n !== o && n) {
      //     let _data = n;
      //     //根据数据的变化做出相应的处理
      //     if (_data.event == 'block') {
      //       this.eventInfo = _data.body
      //       console.log('!!!!!!!!!!!!!!!!!!!', _data.body)
      //     }
      //   }
      // },
    },
    computed: {
      blockMsg() {
        let results = this.$store.getters.chainlist
        this.getChainInfo(results)
      }
    },
    mounted() {
      window.addEventListener('resize', this.getWidth);
      this.getWidth()
    },
    destroyed() {
      // closeWebSocket();
    },
    created() {
      this.initState()
    },
    methods: {
      initState() {
        this.$store.dispatch('WEBSOCKET_INIT', "ws://" + process.env.baseURL + "/v1.0/conn")
        let obj_one = {
          uri: 'chainInfo',
          body: {}
        }
        this.$store.dispatch("WEBSOCKET_REIVE", obj_one);
      },
      getChainInfo(data) {
        this.chainList = data
        this.getBlockInfo()
      },
      getBlockInfo() {
        this.$store.subscribe((mutation, state) => {
          this.eventInfo = state.eventlist
          console.log("rd: state", this.eventInfo);
        });
      },
      // 获取折线图宽度
      getWidth() {
        this.LineWidth = Math.floor(window.innerWidth / 2 - 110) + '';
        if (this.LineWidth < 560) {
          this.LineWidth = 560 + ''
        }
      },
    }
  }

</script>

<style lang="scss">
  .block_data {
    .el-card__body {
      padding: 20px 0;
    }
  }

</style>

<style lang="scss" scoped>
  .main_header {
    height: 55px;
    background-color: #000;
    margin-bottom: 8px;
  }

  .board_Data {
    padding: 8px;

    .tpsLine_data {
      height: 33vh;
      min-height: 264px;
    }

    .block_data {
      margin-top: 1.5vh;
      height: calc(63vh - 60px);
      min-height: 440px;
    }

    .areaLine_data {
      height: calc(41.5vh - 60px);
      min-height: 272px;
    }
  }

</style>
