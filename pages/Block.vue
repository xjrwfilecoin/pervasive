<template>
  <div>
    <Header class="block_header"></Header>
    <div class="block_Data">
      <el-row :gutter="15" style="width:100%;margin-left:0;">
        <el-col :span="12">
          <el-card class="block_info">
            <div class="card_title">
              <p>区块信息</p>
            </div>
            <div class="card_info">
              <p>
                <span class="fon">
                  <i class="el-icon-umbrella"></i>
                  <span style="margin-left:20px;">区块高度:</span>
                </span>
                <span class="af">678932</span>
              </p>
              <p>
                <span class="fon">
                  <i class="el-icon-brush"></i>
                  <span style="margin-left:20px;">父区块哈希:</span>
                </span>
                <span class="af">678932</span>
              </p>
              <p>
                <span class="fon">
                  <i class="el-icon-attract"></i>
                  <span style="margin-left:20px;">区块哈希:</span>
                </span>
                <span class="af">678932</span>
              </p>
              <p>
                <span class="fon">
                  <i class="el-icon-folder-checked"></i>
                  <span style="margin-left:20px;">VRF结果:</span>
                </span>
                <span class="af">678932</span>
              </p>
              <p>
                <span class="fon">
                  <i class="el-icon-folder"></i>
                  <span style="margin-left:20px;">区块大小:</span>
                </span>
                <span class="af">678932</span>
              </p>
              <p>
                <span class="fon">
                  <i class="el-icon-trophy-1"></i>
                  <span style="margin-left:20px;">交易笔数:</span>
                </span>
                <span class="af">678932</span>
              </p>
              <p>
                <span class="fon">
                  <i class="el-icon-time"></i>
                  <span style="margin-left:20px;">出块时间:</span>
                </span>
                <span class="af">678932</span>
              </p>
            </div>
          </el-card>
          <el-card class="chain_info">
            <el-table :data="tableOne" stripe height="calc(30vh - 55px)" size="mini">
              <el-table-column label="链编号" prop="name" width="300" height="20%"></el-table-column>
              <el-table-column label="锁定区块" prop="num" height="20%"></el-table-column>
            </el-table>
          </el-card>
          <el-card class="vote_info">
            <div class="card_title">
              <p>投票详情</p>
            </div>
            <el-table :data="tableTwo" stripe height="calc(36.5vh - 12px)" size="mini">
              <el-table-column label="ID" prop="id" width="300"></el-table-column>
            <el-table-column label="投票顺位" prop="number"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="trading_list">
            <p class="listTitle">原始交易列表:</p>
            <div class="listInfo">
              <p v-for="(item,index) in 9">oooooooewwweweweccs-4232424242342</p>
              <p>更多
                <i class="el-icon-arrow-right"></i>
              </p>
            </div>
          </el-card>
          <el-card class="output_list">
            <p class="listTitle">跨分片输出:</p>
            <div class="listInfo">
              <p v-for="(item,index) in 9">oooooooewwweweweccs-4232424242342</p>
              <p>更多
                <i class="el-icon-arrow-right"></i>
              </p>
            </div>  
          </el-card>
          <el-card class="input_list">
            <p class="listTitle">跨分片输入:</p>
            <div class="listInfo">
              <p v-for="(item,index) in 9">oooooooewwweweweccs-4232424242342</p>
              <p>更多
                <i class="el-icon-arrow-right"></i>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/common/blockHeader'

  export default {
    components: {
      Header,
    },
    data() {
      return {
        tableOne: [
          { name: "中继-1", num: 227898977 },
          { name: "中继-2", num: 227898977 },
          { name: "中继-3", num: 227898977 },
          { name: "中继-4", num: 227898977 },
          { name: "中继-4", num: 227898977 },
          { name: "中继-4", num: 227898977 },
          { name: "中继-4", num: 227898977 },
          { name: "中继-4", num: 227898977 },
          { name: "中继-4", num: 227898977 },
          { name: "中继-5", num: 227898977 }
        ],
        tableTwo: [
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 },
          { id: "ooooddlllllsadddddd-798788", number: 1 }
        ]
      }
    }
  }

</script>

<style lang="scss">
  .block_Data {
    .el-card__body {
      padding: 0;
    }
    .el-table__body-wrapper::-webkit-scrollbar {
      width: 7px; // 横向滚动条
      height: 5px; // 纵向滚动条 必写
    }
    .el-table__body-wrapper::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.144);
      background: #fff;
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb {
      background-color: #cfcfcf;
      -webkit-box-shadow: 0 -1px 3px #cfcfcf;
      border-radius: 5px;
    }
  }

  .chain_info {
    .el-table thead {
      color: #000;
      font-size: 13px;
      background-color: #e0eeee;
    }
    .el-table th, .el-table tr {
        background-color: transparent;
    }
  }

</style>

<style lang="scss" scoped>
  .block_header {
    height: 55px;
    background-color: #000;
    margin-bottom: 8px;
  }

  .block_Data {
    padding: 8px;
    height: calc(100vh - 79px);

    .block_info {
      height: calc(30vh - 55px);
    }

    .chain_info {
      height: calc(30vh - 55px);
      margin: 1.5vh 0;
    }

    .vote_info {
      height: calc(40vh - 10px);
    }

    .trading_list {
      height: calc(33vh - 37px);
    }

    .output_list {
      height: calc(33vh - 37px);
      margin: 1.5vh 0;
    }

    .input_list {
      height: calc(33vh - 37px);
    }

    .card_title {
      height: 3.5vh;
      background-color: #e0eeee;

      p {
        font-size: 13px;
        font-weight: bold;
        padding-left: 10px;
        line-height: 3.5vh;
      }
    }

    .card_info {
      padding-left: 10px;

      p {
        font-size: 13px;
        line-height: 2.7vh;
        margin-top: 0.7vh;
      }

      .fon {
        float: left;
        width: 20%;
      }

      .af {
        float: right;
        width: 80%;
      }
    }

    .listTitle {
      float: left;
      font-size: 13px;
      font-weight: bold;
      padding-left: 10px;
      line-height: 3.5vh;
      width: 20%;
    }

    .listInfo {
      float: right; 
      width: 80%;
      padding-top: 0.5vh;
      p {
        font-size: 13px;  
        line-height: 2.7vh;
      }
    }
  }

</style>
