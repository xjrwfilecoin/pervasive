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
        default: '560px'
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
          let xAxisData = this.value.map(_ => _.time)
          let inData = this.value.map(_ => _.in)
          let outData = this.value.map(_ => _.out)
          let option = {
            title: {
              text: this.text,
              subtext: this.subtext
            },
            tooltip: {
              trigger: "axis"
            },
            grid: {
              left: '8%',
              bottom: '10%'
            },
            legend: {
              itemWidth: 7,
              itemHeight: 7,
              data: ["中继数", "分片数"],
              icon: "circle",
              right: 10,
              orient: "vertical", //垂直显示
              y: "center", //延Y轴居中
              x: "right" //居右显示
            },

            xAxis: {
              type: "category",
              // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              data: xAxisData,
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
              name: "in",
              // data: [820, 932, 901, 934, 1290, 1330, 1320],
              data: inData,
            },{
              type: "line",
              smooth: true,
              name: "out",
              // data: [800, 902, 961, 914, 1090, 1930, 1720],
              data: outData,
            }]
          }
          document.getElementById(this.id).style.width = this.width + "px";
          this.dom = echarts.init(document.getElementById(this.id))
          this.dom.setOption(option)
          window.addEventListener("resize", this.dom.resize); //添加 监听屏幕缩放
        }, 1000)
      },
      
    },
    mounted() {
      this.initChart()
    },
  }

</script>
