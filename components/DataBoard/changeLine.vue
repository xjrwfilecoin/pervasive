<template>
  <div :id="id" :style="{width:width}" class="charts chart-line"></div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'ChartLine',
    props: {
      id: String,
      width: {
        type: String,
        default: '590px'
      },
      value: Array,
      text: String,
      subtext: String
    },
    data() {
      return {
        dom: null,
        option: {},
      }
    },
    watch: {
      value: {
        handler(newValue, oldValue) {
          this.value = newValue; //把新值赋值给我们的属性数据
          this.initChart(); //刷新echarts图表
        },
        deep: true
      },
      width: {
        handler(newValue, oldValue) {
          this.width = newValue; //把新值赋值给我们的属性数据
          this.initChart(); //刷新echarts图表
        },
        deep: true
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },
      initChart() {
        this.$nextTick(() => {
          let xAxisData = this.value.map(_ => _.name)
          let yAxisData = this.value.map(_ => _.value)
          let option = {
            title: {
              text: "中继链-01",
              subtext: "运行曲线图"
            },
            tooltip: {
              trigger: "axis"
            },
            grid: {
              left: '8%',
              bottom: '10%'
            },

            xAxis: {
              type: "category",
              data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              // data: xAxisData,
            },
            yAxis: {
              axisLabel: {
                show: true,
                textStyle: {
                  color: "black"
                }
              },
              name: "",
              type: "value",
              axisLine: false,
              axisTick: false
            },
            series: [{
              type: "line",
              smooth: true,
              name: "中继数",
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              // data: yAxisData,
            }]
          }
          document.getElementById(this.id).style.width = this.width + "px";
          this.dom = echarts.init(document.getElementById(this.id))
          this.dom.setOption(option)
          window.addEventListener("resize", this.dom.resize); //添加 监听屏幕缩放
        }, 1000)
      }
    },
    mounted() {
      this.initChart()
    },
  }

</script>
