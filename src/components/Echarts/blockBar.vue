<template>
    <div :id="id" :style="{width:width}" class="charts chart-bar"></div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: 'ChartLine',
        props: {
            id: String,
            width: {
                type: String,
                default: '600px'
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
                            // text: "中继链-01",
                            subtext: "运行曲线图"
                        },
                        tooltip: {
                            trigger: "axis",
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '5%',
                            right: '3%',
                            bottom: '10%'
                        },

                        xAxis: {
                            type: "category",
                            data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月",
                                "12月"],
                            axisTick: {
                                alignWithLabel: true
                            }
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
                            type: "bar",
                            barWidth: '50%',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [{
                                            offset: 0,
                                            color: '#83bff6'
                                        },
                                        {
                                            offset: 0.5,
                                            color: '#188df0'
                                        },
                                        {
                                            offset: 1,
                                            color: '#188df0'
                                        }
                                    ]
                                )
                            },
                            name: "中继数",
                            data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290],
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