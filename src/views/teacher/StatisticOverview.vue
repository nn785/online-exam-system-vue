<template>
  <el-container>

      <el-row>
        <div id="img1" style="width: 800px;height:400px;"></div>
        <div id="img2" style="width: 800px;height:400px;"></div>
      </el-row>

      <el-row>
        <div id="img3" style="width: 800px;height:400px;"></div>
        <div id="img4" style="width: 800px;height:400px;"></div>
      </el-row>

  </el-container>
</template>

<script>
import statistic from '@/api/statistic'

export default {
  name: 'StatisticOverview',
  data () {
    return {
      //考试名称
      examNames: [],
      //考试通过率
      passRate: [],
      //饼图的数据
      pieData: [],
    }
  },
  created () {
    //页面数据加载的等待状态栏
    this.loading = this.$Loading.service({
      body: true,
      lock: true,
      text: '数据拼命加载中,(*╹▽╹*)',
      spinner: 'el-icon-loading',
    })
    this.getExamPassRate()
    this.getExamNumbers()
  },
  methods: {
    async getExamPassRate () {
      await statistic.getExamPassRate().then((resp) => {
        if (resp.code === 200) {
          this.examNames = resp.data[0].split(',')
          this.passRate = resp.data[1].split(',')
          this.drawLine()
          this.drawBrokenLine()
          this.drawImg4()
          this.loading.close()
        }
      })
    },
    //考试通过率柱状图
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('img1'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '考试通过率',
          subtext: 'Dashboard 1',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#333',
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
          orient: 'horizontal',
          bottom: 'bottom',
          data: ['通过率'],
          textStyle: {
            color: '#666'
          }
        },
        xAxis: {
          type: 'category',
          data: this.examNames,
          axisLabel: {
            color: '#666',
            fontSize: 14
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#666',
            fontSize: 14
          }
        },
        series: [{
          name: '通过率',
          type: 'bar',
          data: this.passRate,
          itemStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#83bff6'},
              {offset: 1, color: '#188df0'}
            ]),
          }
        }]
      })
    },
    //获取考试次数数据
    async getExamNumbers () {
      await statistic.getExamNumbers().then((resp) => {
        console.log(resp)
        let examNames = resp.data[0].split(',')
        let examNumbers = resp.data[1].split(',')
        examNames.forEach((item, index) => {
          this.pieData.push({
            name: item,
            value: parseInt(examNumbers[index])
          })
        })
        this.drawPie()
      })
    },
    //考试次数饼图
    drawPie () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('img2'))
      myChart.setOption({
        title: {
          text: '考试次数占比',
          subtext: 'Dashboard 2',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#333',
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}次 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          top: 'center',
          data: this.pieData,
          textStyle: {
            color: '#666'
          },
          itemWidth: 20,
          itemHeight: 10,
          itemGap: 20
        },
        series: [
          {
            name: '考试次数',
            type: 'pie',
            radius: '55%',
            data: this.pieData,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#ff7e5f','#feb47b','#86a8e7','#52cdd5','#6574cd','#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3'];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      })
    },
    //通过率的折线图
    drawBrokenLine () {
      // 初始化ehcharts实例
      let myChart = this.$echarts.init(document.getElementById('img3'))
      // 指定图表的配置项和数据
      var option = {
        //标题
        title: {
          text: '考试通过率折线图',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        //提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{a} <br/>{b} : {c}%'
        },
        //图例
        legend: {
          orient: 'horizontal',
          bottom: 'bottom',
          data: ['通过率'],
          textStyle: {
            color: '#666'
          }
        },
        //x轴
        xAxis: {
          type: 'category',
          data: this.examNames,
          axisLabel: {
            color: '#666',
            fontSize: 14
          }
        },
        //y轴
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#666',
            fontSize: 14
          }
        },
        //数据
        series: [{
          name: '通过率',
          type: 'line',
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#83bff6'},
                {offset: 1, color: '#188df0'}
              ])
            }
          },
          itemStyle: {
            color: '#4ecb73'
          },
          data: this.passRate
        }]
      }
      // 使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option)
    },
    drawImg4 () {
      let myChart = this.$echarts.init(document.getElementById('img4'))
      myChart.setOption({
        color: ['#ff6347'],
        textStyle: {
          color: 'black'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{a} <br/>{b} : {c}%'
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLine: {
            lineStyle: {
              color: '#fff'
            },
          },
          axisLabel: {
            interval: 0,
            fontSize: 14,
            color: '#666'
          }
        },
        yAxis: {
          type: 'category',
          data: this.examNames,
          axisLine: {
            lineStyle: {
              color: '#fff'
            },
          },
          axisLabel: {
            interval: 0,
            fontSize: 14,
            color: '#666'
          }
        },
        series: [{
          name: '通过率',
          type: 'bar',
          data: this.passRate,
          itemStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#ff9a9e'},
              {offset: 1, color: '#fad0c4'}
            ]),
          }
        }]
      })
    }
  }
}
</script>

<style scoped lang="scss">

.el-container {
  width: 100%;
  height: 100%;
}

.el-container {
  animation: leftMoveIn .7s ease-in;
}

@keyframes leftMoveIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
</style>
