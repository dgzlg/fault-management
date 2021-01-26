<template>
  <el-container>
    <el-header style="height: 10%;position: relative;">
      <p style="position: absolute;top: 40%;left: 15px;">{{ currentTime }}</p>
      <p style="position: absolute;top: 40%;right: 13.5%;">{{ wea }}</p>
      <p style="position: absolute;top: 40%;right: 8.5%;color: #15CC48;">{{ tem }}</p>
      <p style="position: absolute;top: 40%;right: 1.5%;color: #10d4c5;">空气:{{ air_level }}</p>
    </el-header>
    <el-main>
      <el-row :gutter="15" style="height: 99%;">
        <el-col :span="6" style="height: 100%;">
          <div style="height: 30%;margin-bottom:5%;">
            <p class="text-size-14 marginBottom"><span class="el-icon-data-analysis marginRight"></span>车间产量统计</p>
            <ve-histogram :data="yieldChartData" :extend="chartsExtend" :colors="chartColor" height="85%"></ve-histogram>
          </div>
          <div style="height: 30%;margin-bottom:5%;">
            <p class="text-size-14"><span class="fa fa-wrench marginRight"></span>设备状态</p>
            <el-col :span="24" style="height: 85%;">
              <div id="eqRingChart" style="width: 100%;height: 100%;"></div>
            </el-col>
          </div>
          <div style="height: 30%;">
            <p class="text-size-14 marginBottom"><span class="el-icon-data-line marginRight"></span>能耗曲线</p>
            <ve-line :data="lineChartData" :extend="chartsExtend" :colors="lineColor" height="85%"></ve-line>
          </div>
        </el-col>
        <el-col :span="12" style="height: 100%;">
          <div style="height: 25%;">
            <el-col :span="24" style="height: 100%;position: relative;">
              <el-col :span="6" style="position: absolute;bottom:0;left: 0;">
                <p class="text-size-12 marginBottoms">已完成计划</p>
                <p class="text-size-20 marginBottoms" style="color: #04E09E;">27456</p>
              </el-col>
              <el-col :span="6" :offset="6" style="position: absolute;bottom:0;right:0;">
                <p class="text-size-12 marginBottoms">执行中计划</p>
                <p class="text-size-20 marginBottoms" style="color: #04E09E;">1231</p>
              </el-col>
            </el-col>
          </div>
          <div style="height: 35%;">
            <el-col :span="24" style="height: 100%;">
              <div id="PlanGaugeChart" style="width: 100%;height: 100%;"></div>
            </el-col>
          </div>
          <div style="height: 30%;margin-bottom:5%;">
            <el-col :span="6" :offset="18">
              <p class="text-size-12 marginBottoms">需求订单量</p>
              <p class="text-size-20 marginBottoms" style="color: #04E09E;">25456</p>
              <p class="text-size-12 marginBottoms">需求匹配率</p>
              <p class="text-size-20" style="color: #F6E714;">78%</p>
              <ve-histogram :data="yieldChartData" :extend="chartsExtend" :colors="chartColor" height="85%"></ve-histogram>
            </el-col>
          </div>
        </el-col>
        <el-col :span="6" style="height: 100%;">
          <div style="height: 50%;margin-bottom:5%;">
            <p class="text-size-14">累计生产批次</p>
            <p class="text-size-36" style="color: #04E09E;">620376</p>
            <p class="text-size-12 color-grayblack">累计品种 <span class="text-size-20" style="color: #F6E714;">126</span></p>
            <el-col :span="24" style="height: 65%;">
              <div id="PlanPieChart" style="width: 100%;height: 100%;"></div>
            </el-col>
          </div>
          <div style="height: 50%;">
            <p class="text-size-14"><span class="el-icon-time marginRight"></span>生产时长</p>
            <el-col :span="24" style="height: 85%;">
              <div id="timeBarChart" style="width: 100%;height: 100%;"></div>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  var moment = require('moment');
  import echarts from 'echarts'
  export default {
    name: "ProductionMonitoring",
    data(){
      return {
        websock:null,
        websockVarData:{},
        currentTime:"",
        wea:"",
        tem:"",
        air_level:"",
        chartsExtend:{
          legend:{
            show:false
          },
          yAxis:{
            show:false,
          },
          xAxis:{
            show:false
          },
          grid:{
            left:0,
            top:0,
            right:0,
            bottom:0,
            containLabel:false,
          },
          series:{
            barMaxWidth:12,
            itemStyle:{
              normal: {
                barBorderRadius:8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#04e09e'
                }, {
                  offset: 1,
                  color: '#43816f'
                }]),
              },
            },
            symbolSize:0,
            lineStyle:{
              shadowColor:"#818143"
            }
          }
        },
        yieldChartData:{
          columns: ['时间', '产量'],
          rows: [
            { '时间': '1/1', '产量': 1393},
            { '时间': '1/2', '产量': 3530},
            { '时间': '1/3', '产量': 2923},
            { '时间': '1/4', '产量': 1723},
            { '时间': '1/5', '产量': 3792},
            { '时间': '1/6', '产量': 4593}
          ]
        },
        chartColor:["#04E09E"],
        EqStatusChart:"",
        EqStatusChartData1:64,
        EqStatusChartData2:37,
        EqStatusChartData3:45,
        EqStatusChartData4:27,
        lineColor:["#04E09E","#F6E714"],
        lineChartData:{
          columns: ['时间', '昨日', '今日'],
          rows: [
            { '时间': '1', '昨日': 164, '今日': 245},
            { '时间': '2', '昨日': 199, '今日': 151},
            { '时间': '3', '昨日': 244, '今日': 154},
            { '时间': '4', '昨日': 345, '今日': 541},
            { '时间': '5', '昨日': 541, '今日': 366},
            { '时间': '6', '昨日': 514, '今日': 641},
          ]
        },
        planChart:"",
        planChartData:[],
        gaugeChart:"",
        gaugeChartData:5456,
        gaugeChartAllData:10000,
        timeBarChart:"",
        timeBarChartTitle:['水提罐1号', '水提罐2号', '水提罐3号', '水提罐4号', '水提罐5号'],
        timeBarChartData:[500, 2200, 1000, 500, 1],
      }
    },
    created(){
      this.initWebSocket()
      let _this = this
      this.timer = setInterval(() =>{
        _this.currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      },1000);
    },
    mounted(){
      this.getWeather()
      this.getBrandNum()
      let that = this
      that.$nextTick(function() {
        that.initEqRingChart("eqRingChart")
        that.initPlanGaugeChart("PlanGaugeChart")
        that.initTimeBarChartChart("timeBarChart")
      })
      window.addEventListener('resize',this.resize())
    },
    watch:{

    },
    computed:{ //计算属性

    },
    destroyed() {
      if(this.websock){
        this.websock.close() //离开路由之后断开websocket连接
      }
    },
    methods: {
      initWebSocket(){ //初始化weosocket
        // this.websock = new WebSocket('ws://' + location.host + '/socket');
        this.websock = new WebSocket('ws://127.0.0.1:5002/socket');
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        this.websocketsend();
      },
      websocketonerror(){//连接建立失败重连
        console.log("websocket连接失败")
      },
      websocketonmessage(e){ //数据接收
        this.websockVarData = JSON.parse(e.data)
        console.log(this.websockVarData)
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log("websocket关闭")
      },
      closesocket(){
        this.websock.close()
      },
      getWeather(){
        let that = this
        this.axios.get("https://www.tianqiapi.com/api/?version=v1&appid=38126558&appsecret=9X3cD127").then(res => {
          that.wea = res.data.data[0].wea
          that.tem = res.data.data[0].tem
          that.air_level = res.data.data[0].air_level
        })
      },
      getBrandNum(){
        var that = this
        var params = {
          tableName:"PlanManager"
        }
        this.axios.get("/api/CUID",{
          params: params
        }).then(res => {
          if (res.data.code === "200") {
            //统计状态
            var PlanStatus1 = 0
            var PlanStatus2 = 0
            var PlanStatus3 = 0
            var PlanStatus4 = 0
            var PlanStatus5 = 0
            var PlanStatus6 = 0
            var PlanStatus7 = 0
            var PlanStatus8 = 0
            res.data.data.rows.forEach(item =>{
              if(item.PlanStatus === "待审核"){
                PlanStatus1 = PlanStatus1 + 1
              }
              if(item.PlanStatus === "审核未通过"){
                PlanStatus2 = PlanStatus2 + 1
              }
              if(item.PlanStatus === "待下发"){
                PlanStatus3 = PlanStatus3 + 1
              }
              if(item.PlanStatus === "待执行"){
                PlanStatus4 = PlanStatus4 + 1
              }
              if(item.PlanStatus === "撤回"){
                PlanStatus5 = PlanStatus5 + 1
              }
              if(item.PlanStatus === "待备料"){
                PlanStatus6 = PlanStatus6 + 1
              }
              if(item.PlanStatus === "物料发送中"){
                PlanStatus7 = PlanStatus7 + 1
              }
              if(item.PlanStatus === "物料发送完成"){
                PlanStatus8 = PlanStatus8 + 1
              }
            })
            that.planChartData = [
              {name:"待执行",value:PlanStatus4,unit:"条"},
              {name:"待备料",value:PlanStatus6,unit:"条"},
              {name:"发送物料中",value:PlanStatus7,unit:"条"},
              {name:"发送物料完成",value:PlanStatus8,unit:"条"},
            ]
            that.$nextTick(function() {
              that.initPieChart('PlanPieChart')
            })
          }
        })
      },
      initPieChart(id){
        let dashedPic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAAABCAYAAACWoZGlAAAAKUlEQVQokWM8efJUFSMjAxiYmpq2MUDB6dOnq2DsUfFR8VFxJHEGBgYA3faK2qQRMHIAAAAASUVORK5CYII="
        let that = this
        that.planChart = echarts.init(document.getElementById(id))
        let color = ['#FF8700', '#ffc300', '#00e473', '#009DFF'];
        let arrName = [];
        let arrValue = [];
        let sum = 0;
        let pieSeries = [],
            lineYAxis = [];
        // 数据处理
        that.planChartData.forEach((v, i) => {
          arrName.push(v.name);
          arrValue.push(v.value);
          sum = sum + v.value;
        })
        // 图表option整理
        that.planChartData.forEach((v, i) => {
          pieSeries.push({
            name: '',
            type: 'pie',
            clockWise: false,
            hoverAnimation: false,
            radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
            center: ["30%", "50%"],
            label: {
              show: false
            },
            data: [{
              value: v.value,
              name: v.name
            }, {
              value: sum - v.value,
              name: '',
              itemStyle: {
                  color: "rgba(0,0,0,0)"
              }
            }]
          });
          pieSeries.push({
              name: '',
              type: 'pie',
              silent: true,
              z: 1,
              clockWise: false, //顺时加载
              hoverAnimation: false, //鼠标移入变大
              radius: [65 - i * 15 + '%',57 - i * 15 + '%'],
              center: ["30%", "50%"],
              label: {
                  show: false
              },
              data: [{
                  value: 7.5,
                  itemStyle: {
                      color: "#E3F0FF"
                  }
              }, {
                  value: 2.5,
                  name: '',
                  itemStyle: {
                      color: "rgba(0,0,0,0)"
                  }
              }]
          });
          v.percent = (v.value / sum * 100).toFixed(1) + "%";
          lineYAxis.push({
            value: i,
            textStyle: {
              rich: {
                circle: {
                  color: color[i],
                  padding: [0, 5]
                }
              }
            }
          });
        })
        var option = {
          color: color,
          grid: {
            top: '15%',
            bottom: '54%',
            left: "30%",
            containLabel: false
          },
          yAxis: [{
            type: 'category',
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: function(params) {
                let item = that.planChartData[params];
                return '{line|}{circle|●}{name|'+ item.name + ' | ' + item.value +'}'
              },
              interval: 0,
              inside: true,
              textStyle: {
                color: "#333",
                fontSize: 14,
                rich: {
                  line: {
                    width: 30,
                    height: 1,
                    backgroundColor: {image: dashedPic}
                  },
                  name: {
                    color: '#fff',
                    fontSize: 12,
                  },
                  bd: {
                    color: '#ccc',
                    padding: [0, 5],
                    fontSize: 14,
                  },
                  percent:{
                    color: '#333',
                    fontSize: 14,
                  },
                  value: {
                    color: '#333',
                    fontSize: 16,
                    fontWeight: 500,
                    padding: [0, 0, 0, 20]
                  },
                  unit: {
                    fontSize: 14
                  }
                }
              },
              show: true
            },
            data: lineYAxis
          }],
          xAxis: [{
            show: false
          }],
          series: pieSeries
        };
        that.planChart.setOption(option)
        that.planChart.resize()
      },
      initEqRingChart(id){
        let that = this
        that.EqStatusChart = echarts.init(document.getElementById(id))
        var option = {
          title: [{
            text: that.EqStatusChartData1+'%',
            subtext:"正常",
            subtextStyle:{
              color:"#04E09E",
              lineHeight:60
            },
            left: '28%',
            top: '18%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              fontWeight:'600',
              color: 'rgba(89, 180, 157, 1)',
              textAlign: 'center',
            },
          },{
            text: that.EqStatusChartData2+'%',
            subtext:"维修",
            subtextStyle:{
              color:"rgba(251, 200, 79, 1)",
              lineHeight:60
            },
            left: '58%',
            top: '18%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              fontWeight:'600',
              color: 'rgba(251, 200, 79, 1)',
              textAlign: 'center',
            },
          },{
            text: that.EqStatusChartData3+'%',
            subtext:"委外",
            subtextStyle:{
              color:"rgba(232, 85, 63, 1)",
              lineHeight:60
            },
            left: '28%',
            top: '65%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              fontWeight:'600',
              color: 'rgba(232, 85, 63, 1)',
              textAlign: 'center',
            },
          },{
            text: that.EqStatusChartData4+'%',
            subtext:"保养",
            subtextStyle:{
              color:"rgba(255, 255, 255, 1)",
              lineHeight:60
            },
            left: '58%',
            top: '65%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              fontWeight:'600',
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'center',
            },
          }],
          series: [
            { //正常
              type: 'pie',
              radius: ['30%', '33%'],
              center: ['30%', '24%'],
              data: [{
                  hoverOffset: 1,
                  value: that.EqStatusChartData1,
                  name: '正常',
                  itemStyle: {
                    color: 'rgba(89, 180, 157, 1)',
                  },
                  label: {
                    show: false,
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  hoverAnimation: false,
                },
                {
                  label: {
                    show: false
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  value: 100 - that.EqStatusChartData1,
                  hoverAnimation: false,
                  itemStyle: {
                    color: 'rgba(89, 180, 157, .2)',
                  },
                }
              ]
            },{
              type: 'pie',
              radius: ['38%', '43%'],
              center: ['30%', '24%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData1,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },
            {
              type: 'pie',
              radius: ['20%', '25%'],
              center: ['30%', '24%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData1,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },
            { //维修
              type: 'pie',
              radius: ['30%', '33%'],
              center: ['60%', '25%'],
              data: [{
                  hoverOffset: 1,
                  value: that.EqStatusChartData2,
                  name: '维修',
                  itemStyle: {
                    color: 'rgba(251, 200, 79, 1)',
                  },
                  label: {
                    show: false,
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  hoverAnimation: false,
                },
                {
                  label: {
                    show: false
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  value: 100 - that.EqStatusChartData2,
                  hoverAnimation: false,
                  itemStyle: {
                    color: 'rgba(251, 200, 79, .2)',
                  },
                }
              ]
            },
            {
              type: 'pie',
              radius: ['38%', '43%'],
              center: ['60%', '25%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData2,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },
            {
              type: 'pie',
              radius: ['20%', '25%'],
              center: ['60%', '25%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData2,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },{ //委外
              type: 'pie',
              radius: ['30%', '33%'],
              center: ['30%', '70%'],
              data: [{
                  hoverOffset: 1,
                  value: that.EqStatusChartData3,
                  name: '委外',
                  itemStyle: {
                    color: 'rgba(232, 85, 63, 1)',
                  },
                  label: {
                    show: false,
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  hoverAnimation: false,
                },
                {
                  label: {
                    show: false
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  value: 100 - that.EqStatusChartData3,
                  hoverAnimation: false,
                  itemStyle: {
                    color: 'rgba(232, 85, 63, .2)',
                  },
                }
              ]
            },
            {
              type: 'pie',
              radius: ['38%', '43%'],
              center: ['30%', '70%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData3,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },
            {
              type: 'pie',
              radius: ['20%', '25%'],
              center: ['30%', '70%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData3,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },{ //保养
              type: 'pie',
              radius: ['30%', '33%'],
              center: ['60%', '70%'],
              data: [{
                  hoverOffset: 1,
                  value: that.EqStatusChartData4,
                  name: '保养',
                  itemStyle: {
                    color: 'rgba(255, 255, 255, 1)',
                  },
                  label: {
                    show: false,
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  hoverAnimation: false,
                },
                {
                  label: {
                    show: false
                  },
                  labelLine: {
                    normal: {
                      smooth: true,
                      lineStyle: {
                        width: 0
                      }
                    }
                  },
                  value: 100 - that.EqStatusChartData4,
                  hoverAnimation: false,
                  itemStyle: {
                    color: 'rgba(255, 255, 255, .2)',
                  },
                }
              ]
            },
            {
              type: 'pie',
              radius: ['38%', '43%'],
              center: ['60%', '70%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData4,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },
            {
              type: 'pie',
              radius: ['20%', '25%'],
              center: ['60%', '70%'],
              data: [{
                label: {
                  show: false
                },
                labelLine: {
                  normal: {
                    smooth: true,
                    lineStyle: {
                      width: 0
                    }
                  }
                },
                value: 100 - that.EqStatusChartData4,
                hoverAnimation: false,
                itemStyle: {
                  color: 'rgba(63, 66, 73, .3)',
                },
              }]
            },

          ]
        };
        that.EqStatusChart.setOption(option)
        that.EqStatusChart.resize()
      },
      initPlanGaugeChart(id){
        let that = this
        that.gaugeChart = echarts.init(document.getElementById(id))
        var option = {
          angleAxis: {
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            min: 0,
            max: 160,
            startAngle: 202.5 //坐标轴大小，两头水平
          },
          radiusAxis: {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: ['a', 'b', 'c'],
            z: 10
          },
          polar: {},
          series: [{
            type: 'bar',
            data: [, , 30],
            coordinateSystem: 'polar',
            barWidth:10,
            barMaxWidth: 10,
            barMinWidth: 10,
            z: 3,
            name: '已完成',
            roundCap: true,
            color: '#4A90E2',
            barGap: '-100%',
          }, {
            type: 'bar',
            data: [, , 50],
            z: 2,
            coordinateSystem: 'polar',
            barWidth:10,
            barMaxWidth: 10,
            barMinWidth: 10,
            name: '执行中',
            roundCap: true,
            color: '#3768a2',
            barGap: '-100%',
          }, {
            type: 'bar',
            data: [, , 100],
            z: 1,
            coordinateSystem: 'polar',
            barWidth:10,
            barMaxWidth: 10,
            barMinWidth: 10,
            name: 'C',
            roundCap: true,
            color: '#707070',
            barGap: '-100%',
          }],
          legend: {
            show: true,
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 12,
              color: '#ffffff'
            },
            top: '50%',
            left: 'center',
            data: ['已完成', '执行中']
          },
          tooltip: {
            show: false
          },
          graphic: [{
              type: 'group',
              top: 'middle',
              left: 'center',
              id: 'data',
              children: [{
                  type: 'text',
                  id: 'current',
                  top: 20,
                  style: {
                    text: that.gaugeChartData,
                    font: 'bolder 28px "Microsoft YaHei", sans-serif',
                    fill: '#ffffff',
                    textAlign: 'center'
                  }
                },
                {
                  type: 'text',
                  id: 'all',
                  top: 100,
                  style: {
                    text: 'of ' + that.gaugeChartAllData,
                    font: 'bolder 14px "Microsoft YaHei", sans-serif',
                    fill: '#c0c0c0',
                    textAlign: 'center'
                  }
                }
              ]
            },
            {
              type: 'text',
              bottom: 390,
              left: 400,
              style: {
                text: '0%',
                font: 'bolder 1em "Microsoft YaHei", sans-serif',
                fill: '#c0c0c0',
              }
            },
            {
              type: 'text',
              bottom: 390,
              right: 400,
              style: {
                  text: '100%',
                  font: 'bolder 1em "Microsoft YaHei", sans-serif',
                  fill: '#c0c0c0',
              }
            }
          ]
      };
        that.gaugeChart.setOption(option)
        that.gaugeChart.resize()
      },
      initTimeBarChartChart(id){
        let that = this
        that.timeBarChart = echarts.init(document.getElementById(id))
        var option = {
            grid: {
              left: '5%',
              right: '5%',
              bottom: '5%',
              top: '10%',
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'none'
              },
              formatter: function(params) {
                return params[0].name + '<br/>' +
                    "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#04e09e'></span>" +
                    params[0].seriesName + ' : ' + params[0].value
              }
            },
            xAxis: {
              show: false,
              type: 'value'
            },
            yAxis: [{
              type: 'category',
              inverse: true,
              axisLabel: {
                  show: true,
                  textStyle: {
                      color: '#fff'
                  },
              },
              splitLine: {
                  show: false
              },
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              data: that.timeBarChartTitle
            }, {
              type: 'category',
              inverse: true,
              axisTick: 'none',
              axisLine: 'none',
              show: true,
              axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize: '12'
                },
              },
              data: that.timeBarChartData
            }],
            series: [{
                  name: '金额',
                  type: 'bar',
                  zlevel: 1,
                  itemStyle: {
                      normal: {
                          barBorderRadius: 30,
                          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                              offset: 0,
                              color: '#04e09e'
                          }, {
                              offset: 1,
                              color: '#43816f'
                          }]),
                      },
                  },
                  barWidth: 10,
                  data: that.timeBarChartData
              },
              {
                name: '背景',
                type: 'bar',
                barWidth: 10,
                barGap: '-100%',
                data: [10000,10000,10000,10000,10000],
                itemStyle: {
                  normal: {
                    color: '#798f88',
                    barBorderRadius: 30,
                  }
                },
              },
            ]
        };
        that.timeBarChart.setOption(option)
        that.timeBarChart.resize()
      },
      resize(){
        let that = this
        let timer = null
        return function(){
          if(timer){
            clearTimeout(timer)
          }
          timer = setTimeout(() =>{
            that.initPieChart('PlanPieChart')
            that.initEqRingChart('eqRingChart')
            that.initPlanGaugeChart('PlanGaugeChart')
            that.initTimeBarChartChart("timeBarChart")
          })
        }
      }
    }
  }
</script>
<style scoped>
  .el-container{
    /*background: url("../assets/img/monitor_bg.jpg");*/
    background: #272727;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #ffffff;
  }
</style>
