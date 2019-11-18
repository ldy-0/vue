<style lang="css">
</style>
<template>
  <div class="page-bagColor">

    <el-row :gutter="20" style="margin:20px;">
      <el-col :span="6">
        <div class="box">
          <img src="../../assets/icon_zuoridingdan.png" alt>
          <div>昨日订单量
            <div class="box-num">{{Yorder}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <img src="../../assets/icon_zuorijine.png" alt>
          <div>昨日订单额
            <div class="box-num">{{YorderMoney}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <img src="../../assets/icon_zongdingdan.png" alt>
          <div>总订单数
            <div class="box-num">{{Aorder}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <img src="../../assets/icon_zongjine.png" alt>
          <div>总订单额
            <div class="box-num">{{AorderMoney}}</div>
          </div>
        </div>
      </el-col>
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
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-button type="primary" @click="getHomeDate" icon="el-icon-search">查询</el-button>
    </el-row>
    <el-row style="background:#fff;margin:20px">
      <chart v-if="chartFlag" :data="data" :xData="xData" :xData2="xData2"></chart>
    </el-row>
  </div>
</template>

<script>
import { getHomeData_api} from "@/api/seller";
import Chart from "@/components/Charts/lineMarker";
import Moment from "@/utils/moment";
export default {
  name: "lineChart",
  components: { Chart },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      daterange: [],
      startDate: "",
      endDate: "",
      yesterday: "",
      nowDay: "",
      //
      data: [],
      xData: [],
      xData2: [],
      chartFlag: false,
      //
      Yorder: "",
      YorderMoney: "",
      Aorder: "",
      AorderMoney: "",
      noticeInfo: ""
    };
  },
  created() {
    const date = new Date();
    this.startDate = Moment(date.getTime() - 3600 * 1000 * 24 * 7).format(
      "yyyy-MM-dd"
    );
    this.yesterday = Moment(date.getTime() - 3600 * 1000 * 24 * 1).format(
      "yyyy-MM-dd"
    );
    this.nowDay = Moment(date).format("yyyy-MM-dd");
    this.endDate = Moment(date).format("yyyy-MM-dd");
    this.getData();
    this.getYesterdayData();
    this.getAllData();
  },
  methods: {
    async getData() {
      await getHomeData_api({
        start_time: this.startDate,
        end_time: this.endDate
      }).then(response => {
        if (response && response.status == 0) {
          let res = response.data;
          this.data = res.date;
          this.xData = res.count;
          this.xData2 = res.sales;
        }
      });
      this.chartFlag = true;
    },
    async getAllData() {
      await getHomeData_api().then(response => {
        if (response && response.status == 0) {
          let res = response.data;
          this.Aorder = res.count_sum;
          this.AorderMoney = res.sales_sum;
        }
      });
      this.chartFlag = true;
    },
    async getYesterdayData() {
      await getHomeData_api({
        start_time: this.yesterday,
        end_time: this.nowDay
      }).then(response => {
        if (response && response.status == 0) {
          let res = response.data;
          this.Yorder = res.count_sum;
          this.YorderMoney = res.sales_sum;
        }
      });
      this.chartFlag = true;
    },
    async getHomeDate() {
      let startTime = Moment(new Date(this.daterange[0]).getTime()).format(
        "yyyy-MM-dd"
      );
      let endTime = Moment(new Date(this.daterange[1]).getTime()).format(
        "yyyy-MM-dd"
      );
      let sendData = {
        start_time: startTime,
        end_time: endTime
      };
      await getHomeData_api(sendData).then(response => {
        if (response && response.status == 0) {
          let res = response.data;
          this.data = res.date;
          this.xData = res.count;
          this.xData2 = res.sales;
        }
      });
    }
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  padding: 20px;
  width: 100%;
  height: 70vh;
}
.box {
  border: 1px solid rgb(146, 146, 146);
  border-radius: 5px;
  height: 108px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 35px;
  font-size: 16px;
  color: #999999;
}
.box img {
  width: 40px;
  height: 46px;
}
.box-num {
  font-family: MicrosoftYaHei-Bold;
  font-size: 20px;
  color: #666;
  text-align: center;
  padding-top: 18px;
}
.block {
  margin-left: 30px;
}
</style>