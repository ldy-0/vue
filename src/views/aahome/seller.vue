<style lang="stylus">
.v-modal
  width: 0 !important
.dashboard-hbs
  margin-left: 0 !important
.notice-time
  text-align: right 
  color: #999999
  font-size: 10px
.notice-content
  text-align: center
  font-size: 15px 
  min-min-height: 50px
</style>
<template>
  <div>
    <el-dialog
        :title="noticeInfo.affiche_title"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <div class="notice-time">
            {{noticeInfo.add_time}}
        </div>
        <div class="notice-content">
            {{noticeInfo.affiche_content}}
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </div>
    </el-dialog>  
    <el-row :gutter="20" style="margin:20px;">
      <el-col :span="6"><div class="box">昨日订单数:{{Yorder}}</div></el-col>
      <el-col :span="6"><div class="box">昨日订单额:{{YorderMoney}}</div></el-col>
      <el-col :span="6"><div class="box">总订单数:{{Aorder}}</div></el-col>
      <el-col :span="6"><div class="box">总订单额:{{AorderMoney}}</div></el-col>
    </el-row>
    <el-row style="margin:20px;">
        <el-date-picker
          v-model="daterange"
          type="daterange"
          align="center"
          range-separator="至"
          :start-placeholder="startDate"
          :end-placeholder="endDate"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
          <el-button type='primary' @click="getHomeDate" icon="el-icon-search">查询</el-button>
    </el-row>
    <el-row style="background:#fff;margin:20px">
      <chart v-if="chartFlag" :data='data' :xData='xData' :xData2='xData2'></chart>
    </el-row>
  </div>
</template>

<script>
import {getHomeData_api} from '@/api/seller'
import Chart from '@/views/aahome/lineMarker'
import Moment from '@/utils/moment'
import {getNotice_api} from '@/api/seller'
export default {
  name: 'lineChart',
  components: { Chart },
  data(){
    return{
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        },
         {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      daterange:[],
      startDate:'',
      endDate:'',
      yesterday:'',
      nowDay:'',
      //
      data:[],
      xData:[],
      xData2:[],
      chartFlag:false,
      //
      Yorder:'',
      YorderMoney:'',
      Aorder:'',
      AorderMoney:'',
      centerDialogVisible: false,
      noticeInfo: '',
    }
  },
  created(){
    
    const date = new Date()
    this.startDate = Moment(date.getTime() - 3600 * 1000 * 24 * 7).format('yyyy-MM-dd')
    this.yesterday = Moment(date.getTime() - 3600 * 1000 * 24 * 1).format('yyyy-MM-dd')
    this.nowDay = Moment(date).format('yyyy-MM-dd')
    this.endDate = Moment(date).format('yyyy-MM-dd')
    this.getData()
    this.getYesterdayData()
    this.getAllData()
    this.getNotice()
  },
  methods:{
    async getData(){
      await getHomeData_api({start_time:this.startDate,end_time:this.endDate}).then(response=>{
        if(response && response.status == 0){
          let res = response.data
          this.data = res.date
          this.xData = res.count
          this.xData2 = res.sales
        }
      })
      this.chartFlag = true
    },
    async getAllData(){
      await getHomeData_api().then(response=>{
        if(response && response.status == 0){
          let res = response.data
          this.Aorder = res.count_sum
          this.AorderMoney = res.sales_sum
        }
      })
      this.chartFlag = true
    },
    async getYesterdayData(){
      await getHomeData_api({start_time:this.yesterday,end_time:this.nowDay}).then(response=>{
        if(response && response.status == 0){
          let res = response.data
          this.Yorder = res.count_sum
          this.YorderMoney = res.sales_sum
        }
      })
      this.chartFlag = true
    },
    async getNotice() {
      await getNotice_api().then(response=>{
          if(response && response.status == 0){
            this.centerDialogVisible =true
            this.noticeInfo = response.data[0]
          }
        console.log(response);
      })
    },

    async getHomeDate(){
      let startTime = Moment(new Date(this.daterange[0]).getTime()).format('yyyy-MM-dd')
      let endTime = Moment(new Date(this.daterange[1]).getTime()).format('yyyy-MM-dd')
      let sendData = {
        start_time:startTime,
        end_time:endTime
      }
       await getHomeData_api(sendData).then(response=>{
        if(response && response.status == 0){
          let res = response.data
          this.data = res.date
          this.xData = res.count
          this.xData2 = res.sales
        }
      })
    }

  },
}
</script>

<style scoped>
.chart-container{
  position: relative;
  padding:20px;
  width: 100%;
  height:70vh;
}
.box{
  border: 1px solid rgb(146, 146, 146);
  border-radius: 10px;
  height: 80px;
  text-align: center;
  line-height: 80px;
}
.block{
  margin-left: 30px;
}
</style>