<style lang="css">
.header {
  margin: 20px 0;
}

.form_title,
.form_ctn {
  font-size: 14px;
  line-height: 36px;
  display: inline-block;
}
.form_title {
  box-sizing: border-box;
  display: inline-block;
  width: 100px;
  padding: 0 12px 0 0;
  font-weight: bold;
  text-align: right;
  vertical-align: top;
}
.form_ctn {
  width: 60%;
}
.form_img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
}
.form_img2 {
  width: 100px;
  height: 100px;
}
.form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

<template>
  <div>

    <el-header class="header">
      <custom-head :config='headConfig' @search='search' @export='exportFile'></custom-head>
    </el-header>

    <custom-table ref='mainTable' :config='tableConfig' :data='list' :total='total' :isLoading='isLoading' @show='updateForm' @modify='changeItem' @change='change'></custom-table>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <div v-if="dialogConfig.status === 3">
        <el-form label-width='100px'>
          <custom-input :obj='remark'></custom-input>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeRemarkDialog">取消</el-button>
          <el-button type="primary" @click="submitRemark">确 定</el-button>
        </div>
      </div>     

      <!-- 详情 -->
      <div v-if='dialogConfig.status == 2'>
        <el-form label-width='100px' class="form">

          <div v-for='(item, index) in keys' :key='index' :style="{width:(formData[item].value != '1970-01-01 08:00:00'&&formData[item].value !='null'?'30%':'0')}">
            <div v-if="formData[item].value != '1970-01-01 08:00:00'&&formData[item].value !='null'">
              <span class='form_title'>{{formData[item].title}}</span>
              <span class='form_ctn'>{{formData[item].value}}</span>
            </div>
          </div>
        </el-form>
        <custom-table :config='detailTable' :data='goodsList' :total='total' :isLoading='isLoading' :showPagination="false">
        </custom-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <!-- <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button> -->
        </span>
      </div>
    </el-dialog>

    <el-dialog :title="thirdDialogConfig.title" :visible.sync="thirdShowDialog" :before-close='closeDialogThird' width="30%">
      <div v-if="[7, 8].indexOf(thirdDialogConfig.status) !== -1">
        <el-form label-width='100px'>
          <custom-select :obj='postName'></custom-select>
          <custom-input :obj="post"></custom-input>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialogThird">取消</el-button>
          <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <el-dialog :title="twoDialogConfig.title" :visible.sync="twoShowDialog" :before-close='closeDialogTwo' width="50%">
      <el-form label-width='100px'>
        <div>
          <span class='form_title'>{{img.title}}</span>
          <img class='form_img' :src='img.value' />
        </div>

        <div v-for='(item, index) in keys2' :key='index'>
          <span class='form_title'>{{formDataTwo[item].title}}</span>
          <span class='form_ctn'>{{formDataTwo[item].value}}</span>
        </div>
        <div>
          <span class='form_title'>图片</span>
          <img v-for='(i,index) in detail.geval_image' :key='index' class='form_img2' :src="i" alt="">
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogTwo">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import customInput from "@/components/customInput";
import customSelect from "@/components/select";
import integer from "@/components/integer";
import dateTimeRange from "@/components/dateTimeRange";
import customImg from "@/components/customImg";
import editor from "@/components/Tinymce";
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from "babel-types";
import api from "@/api/order";
import apiOfcomment from "@/api/comment";
import logistic from "./logistic.js";
import remark from "./remark";

export default {
  mixins: [logistic, remark],

  components: {
    customHead,
    customTable,
    customInput,
    customSelect,
    integer,
    dateTimeRange,
    customImg,
    editor
  },

  computed: {
    showDialog() {
      return Boolean(this.dialogConfig.status);
    },
    thirdShowDialog() {
      return Boolean(this.thirdDialogConfig.status);
    },
    twoShowDialog() {
      return Boolean(this.twoDialogConfig.status);
    },
    keys() {
      return this.formData ? Object.keys(this.formData) : [];
    },
    keys2() {
      return this.formDataTwo ? Object.keys(this.formDataTwo) : [];
    }
  },

  data() {
    return {
      detail: {},
      order_id: null,
      dialogConfig: {
        title: "",
        status: 0 // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      thirdDialogConfig: {
        title: "",
        status: 0 // 7:添加分类，8：编辑分类， 9：四级分类列表
      },
      twoDialogConfig: {
        title: "",
        status: 0 // 4:添加分类，5：编辑分类， 6：四级分类列表
      },
      post: { type: 'string', title: "物流单号", value: "", alert: null },
      postName: { title: "物流公司", value: "", alert: null, categories: [] },
      formData: {
        order_sn: { title: "订单编号:", value: "", alert: null },
        goods_count: { title: "购买数量:", value: "", alert: null },
        order_amount: { title: "订单总价:", value: "", alert: null },
        shipping_fee: { title: "运费:", value: "", alert: null },
        order_amount: { title: "支付金额:", value: "", alert: null },
        add_time: { title: "下单时间:", value: "", alert: null },
        payment_time: { title: "购买时间:", value: "", alert: null },
        name: { title: "买家名称:", value: "", alert: null },
        phone: { title: "买家电话:", value: "", alert: null },
        address: { title: "买家地址:", value: "", alert: null },
        voucher_price: { title: "优惠券:", value: "", alert: null },
        order_points: { title: "积分抵扣:", value: "", alert: null },
        pd_amount: { title: "余额抵扣:", value: "", alert: null },
        logistic: { title: "物流信息:", value: "", alert: null },
        order_message: { title: "备注:", value: "", alert: null },
        repayDayStr: { title: "分期时长:", value: "", alert: null },
        prepay_amount: { title: "预付金额:", value: "", alert: null },
        repay_time: { title: "到期时间:", value: "", alert: null },
      },
      formDataTwo: {
        geval_frommembername: { title: "昵称", value: "", alert: null },
        geval_goodsname: { title: "商品名称", value: "", alert: null },
        order_count: { title: "购买数量", value: "", alert: null },
        order_amount: { title: "价格(￥)", value: "", alert: null },
        payment_time: { title: "购买时间", value: "", alert: null },
        geval_addtime: { title: "评论时间", value: "", alert: null },
        geval_content: { title: "评论内容", value: "", alert: null }
      },
      img: { title: "主图", value: [], limit: 1, alert: null },
      content: { title: "内容", value: "", alert: null },
      stopSubmit: false,

      headConfig: {
        placeHolder: "请输入关键字(订单号、买家姓名、联系方式)",
        dateWidth: 100,
        showExport: true,
        selectLabelList: ["订单状态",],
        selectList: [
          [
            { id: null, title: "全部" },
            { id: 0, title: "已取消" },
            { id: 10, title: "待付款" },
            { id: 20, title: "待发货" },
            { id: 30, title: "待收货" },
            { id: 40, title: "已收货" },
            { id: 80, title: "已完成" },
            { id: 100, title: "已关闭" }
          ],
        ]
      },

      tableConfig: {
        showOperate: true,
        detailTitle: "详情",
        btnList: [
          { key: "showSend", value: "发货" },
          { key: "showLookComment", value: "查看评论" },
          { key: "showFinish", value: "关闭" },
          { key: "order_id", value: "备注" },
        ],
        classList: [
          { key: "商品图片", value: "goods_image", isImg: true },
          { key: "商品名称", value: "goods_name" },
          { key: "订单号", value: "order_sn" },
          { key: "金额(￥)", value: "order_amount" },
          { key: "积分抵扣", value: "order_points" },
          { key: "余额抵扣", value: "pd_amount" },
          { key: "数量", value: "goods_count" },
          { key: "买家", value: "buyer_name" },
          { key: "联系方式", value: "buyer_telephone" },
          { key: "订单状态", value: "order_state" },
          { key: "下单时间", value: "add_time" },
          { key: "分期时长", value: "repayDayStr" },
          { key: "预付金额", value: "prepay_amount" },
          { key: "到期时间", value: "repay_time" },
        ]
      },
      detailTable: {
        showOperate: false,
        classList: [
          { key: "商品图片", value: "goods_image", isImg: true },
          { key: "商品名称", value: "goods_name" },
          { key: "规格", value: "spec" },
          { key: "金额(￥)", value: "goods_price" },
          { key: "数量", value: "goods_num" },
          { key: "支付金额(￥)", value: "goods_pay_price" }
        ]
      },
      list: [],
      goodsList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      isLoading: true
    };
  },
  methods: {
    async getList() {
      //获取列表
      this.isLoading = true;
      let send = Object.assign({}, this.listQuery);
      send.repay_order = 1;
      let res = await api.getOrderList_api(send, this);
      if (res.data && res.status == 0) {
        res.data.forEach(this.format);
        this.list = res.data;
      } else {
        this.list = [];
      }
      this.total = res.pagination.total;
      this.isLoading = false;
    },
    format(item) {
      let arr = ["status"],
        selectList = this.headConfig.selectList;

      item.img = [{ url: item.order_goods[0].goods_image }];
      item.goods_image = item.order_goods[0].goods_image;
      item.goods_name = item.order_goods[0].goods_name;
      item.name = item.order_reciver_info.name;
      item.phone = item.order_reciver_info.phone;
      item.address = item.order_reciver_info.address;
      
      item.logistic = "";
      if (item.shipping_code) {
        item.logistic = item.shipping_code[0] ? item.shipping_code : "";
        item.shipping_code = item.shipping_code[1];
      }

      let strList = this.exchange(
        selectList,
        arr.map(v => item[v]),
        "id",
        "title"
      );
      arr.forEach((v, i) => (item[`${v}Str`] = strList[i]));

      // 标记发货按钮是否显示
      item.showSend = item.order_state_id == 20;
      // 标记查看评论按钮是否显示
      item.showLookComment = item.evaluation_state == 1;

      item.showFinish = item.order_state_id >= 20 && item.order_state_id <= 40;

      item.repayDayStr = `${item.repay_day}天`;
    },

    updateForm(status) {
      let formData = this.formData,
        pricePattern = /[pP]rice|freight/;

      this.dialogConfig.status = typeof status === "number" ? status : 2;
      status.order_goods.forEach(v => {
        v.spec = "";
        if (v.goods_spec) {
          let specValue = Object.values(v.goods_spec);
          specValue.forEach(i => {
            v.spec += i + "/";
          });
          v.spec = v.spec.substr(0, v.spec.length - 1);
        } else {
          v.spec = "单规格商品";
        }
      });
      this.goodsList = status.order_goods;
      this.img.value = status.img[0].url;
      this.keys.forEach(v => {
        formData[v].value = (pricePattern.test(v) ? "￥" : "") + status[v];
      });
      this.content.value = status.content || "";
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },

    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },
    exchange(sourceList, valueList, filterProperty, destProperty) {
      let res,
        resList = [];

      sourceList.forEach((list, index) => {
        res = list.filter(v => v[filterProperty] == valueList[index])[0];
        resList[index] = res ? res[destProperty] : "";
      });

      return resList;
    },
    //======================================

    async changeItem(status, index) {
      this.order_id = status.order_id;
      // 发货
      if (index == 0) {
        this.post.value = "";
        this.postName.value = "YTO";
        this.thirdDialogConfig.status = typeof status === "number" ? status : 8;
      } 

      // 查看评论
      if (index == 1) {
        let res = await apiOfcomment.getAssessList({ search: status.order_sn });
        if (res.status == 0 && res.data.length != 0) {
          this.twoDialogConfig.status = 3;
          let formData = this.formDataTwo;
          let result = res.data[0];
          this.keys2.forEach(v => {
            formData[v].value = result[v];
          });

          this.img.value = result.geval_frommemberavatar;
          formData.content = result.content;
          this.detail = Object.assign({}, result);
          this.detail.geval_image = JSON.parse(result.geval_image);
        } else {
          this.$message.error("该评论被删除了");
        }
      } 

      // 关闭
      if(index == 2){
        let config = {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        };
        this.$confirm(`确认此操作, 是否继续?`, "提示", config)
          .then(() => {
            let param = {
              order_id: this.order_id,
              state_type: "order_close"
            };
            api.changeOrder_api(param).then(res => {
              if (res.status == 0) this.$message.success("关闭订单成功");
              if (res.status != 0) this.$message.error("关闭订单失败");
              this.getList();
            });
          })
          .catch(e => {
            this.$notify.info({ message: "已取消操作" });
          });
      }

      // 备注
      if(index == 3) this.openRemarkDialog(status);

    },

    closeDialogThird() {
      let config = this.thirdDialogConfig;

      config.status = 0;
    },
    closeDialogTwo() {
      let config = this.twoDialogConfig;

      config.status = 0;
    },
    async submit() {
      let paramArr = ["post"],
        company = this.postName,
        param;
      if (
        paramArr.some(v => {
          return this[v].value
            ? false
            : (this[v].alert = `请输入${this[v].title}`);
        })
      )
        return;

      if (typeof company.value !== "number" && !company.value)
        return (company.alert = `请选择${company.title}`);

      this.stopSubmit = true;
      param = {
        order_id: this.order_id,
        state_type: "deliver_goods",
        shipping_code: [
          company.categories.filter(v => v.id == company.value)[0].name,
          company.value,
          this.post.value
        ]
      };
      let res = await api.changeOrder_api(param);
      if (res.status == 0) this.$message.success("发货成功");
      if (res.status != 0) this.$message.error("发货失败");
      this.stopSubmit = false;
      this.thirdDialogConfig.status = 0;
      this.getList();
    },
    async deleteItem(id) {
      console.error("delete Item", id);
      // let res = await api.deleteClass(id, null, this);

      this.getList();
    },
    search(param) {
      this.listQuery.page = 1;
      this.$refs.mainTable.initPage();

      this.listQuery.search = param.search;
      this.listQuery.order_state = param.statusList[0];
      this.listQuery.store_order = param.statusList[1];
      if (param.date) {
        this.listQuery.starttime = param.date.startDate;
        this.listQuery.endtime = param.date.endDate;
      } else {
        delete this.listQuery.starttime;
        delete this.listQuery.endtime;
      }
      this.getList();
    },
    change(param) {
      this.listQuery.limit = param.limit;
      this.listQuery.page = param.page;
      this.getList();
    },
    async exportFile(loading) {
      await this.handleDownload();
      loading.close();
    },
    //订单导出
    async handleDownload() {
      //请求全部订单数据
      let send = {
        limit: 0,
        repay_order: 1,
      };
      if (typeof this.listQuery.order_state === "number") {
        send.order_state = this.listQuery.order_state;
      }
      let res = await api.getOrderList_api(send, this);
      let allOrder = null;
      if (res.status == 0 && res.data) {
        // res.data.forEach(this.format);
        allOrder = res.data;
      }
      if (!allOrder) {
        return this.$notify({
          title: "警告",
          message: "暂无数据",
          type: "warning"
        });
      }
      let tempData = [];
      allOrder.forEach(item => {
        let goods = item.order_goods[0];
        item.logistic = item.shipping_code;
        item.goods_name = goods.goods_name;
        item.goods_num = goods.goods_num;
        item.goods_pay_price = goods.goods_pay_price;
        item.goods_serial = goods.goods_serial ? goods.goods_serial : "";
        item.goods_spec = goods.goods_spec
          ? JSON.stringify(goods.goods_spec)
          : "";

        let reciver_info = item.order_reciver_info;
        // item.reciver_name = item.reciver.reciver_name;
        for (let k in reciver_info) {
          item[k] = reciver_info[k];
        }
        tempData.push(item);
        if (item.order_goods.length > 1) {
          for (let i = 1; i < item.order_goods.length; i++) {
            tempData.push({
              goods_name: item.order_goods[i].goods_name,
              goods_num: item.order_goods[i].goods_num,
              goods_pay_price: item.order_goods[i].goods_pay_price,
              goods_serial: item.order_goods[i].goods_serial
                ? item.order_goods[i].goods_serial
                : "",
              goods_spec: item.order_goods[i].goods_spec
                ? JSON.stringify(item.order_goods[i].goods_spec)
                : ""
            });
          }
        }
        // for(let i =1;i<item.goods.length;i++){
        //   let arr = Object.assign({},item);
        //   arr.goods_name=item.goods[i].goods_name,
        //   arr.goods_num=item.goods[i].goods_num,
        //   arr.goods_pay_price=item.goods[i].goods_pay_price,
        //   tempData.push(arr);
        // }
      });
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "订单号",
          "订单状态",
          "订单总价",
          "运费",
          "下单时间",
          "购买时间",
          "买家名称",
          "买家电话",
          "买家地址",
          "优惠券",
          "积分抵扣",
          "余额抵扣",
          "物流信息",
          "备注",
          "商品名",
          "购买数量",
          "支付金额",
          "商品编号",
          "规格",
          "分期时长",
          "预付金额",
          "到期时间",
        ];
        const filterVal = [
          "order_sn",
          "order_state",
          "order_amount",
          "shipping_fee",
          "add_time",
          "payment_time",
          "name",
          "phone",
          "address",
          "voucher_price",
          "order_points",
          "pd_amount",
          "logistic",
          "order_message",
          "goods_name",
          "goods_num",
          "goods_pay_price",
          "goods_serial",
          "goods_spec",
          "repay_day",
          "prepay_amount",
          "repay_time",
        ];
        const list = tempData;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "分期订单",
          autoWidth: true
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if(j == 'repay_day') return `${v[j]}天`;

          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return j === "logistic"
              ? v[j] && typeof v[j] === "object" ? v[j].join(", ") : v[j]
              : v[j];
          }
        })
      );
    }
  },

  created() {

    this.getList();
  }
};
</script>