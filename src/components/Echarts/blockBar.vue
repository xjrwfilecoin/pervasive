<template>
    <div :id="id" style="width:600px;height:calc(40vh - 60px); min-height:260px; margin:0 auto"
        class="charts chart-bar"></div>
</template>

<script>
    import {
        mapState,
        mapActions
    } from 'vuex'
    import echarts from 'echarts'

    export default {
        name: 'ChartLine',
        props: {
            id: String,
            value: Array,
        },
        data() {
            return {
                dom: null,
                option: {},
            }
        },
        watch: {
            value: {
                handler(newVal, oldVal) {
                    this.initChart()
                }
            },
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
                        tooltip: {
                            trigger: "axis",
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '11%',
                            right: '4%',
                            bottom: '10%'
                        },
                        xAxis: [{
                            type: 'category',
                            data: xAxisData,
                        }],
                        yAxis: [{
                            type: 'value',
                            axisLine: false,
                            axisTick: false,
                            min: 0,
                            // max: 20000,
                            splitNumber: 4,
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: function (value) {
                                    if (parseInt(value) < 1000) {
                                        return value
                                    } else {
                                        return parseFloat(value / 1000).toFixed(0) + ' K'
                                    }
                                },
                                textStyle: {
                                    color: "black",
                                    fontFamily: 'verdana',
                                    fontSize: 10,
                                    fontStyle: 'normal',
                                }
                            },
                        }],
                        series: [{
                            type: "line",
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
                            name: "TPS",
                            data: yAxisData,
                        }]
                    };
                    // document.getElementById(this.id).style.width = this.width + "px";
                    if (document.getElementById('blockBar')) {
                        this.dom = echarts.init(document.getElementById('blockBar'))
                        this.dom.setOption(option)
                    }
                    window.addEventListener("resize", this.dom.resize); //添加 监听屏幕缩放
                }, 2000)
            }
        },
        mounted() {
            this.initChart()
        },
    }
</script>