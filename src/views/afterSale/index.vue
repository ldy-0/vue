<style lang="css">
.header {
  margin: 20px 0 40px;
}

.form_title,
.form_ctn {
  font-size: 14px;
  line-height: 36px;
}
.form_title {
  box-sizing: border-box;
  display: inline-block;
  width: 100px;
  padding: 0 12px 0 0;
  font-weight: bold;
  text-align: right;
}
.form_img {
  width: 150px;
  height: 150px;
}
</style>

<template>
  <div>

    <el-header class="header">
      <custom-head :config='headConfig' @add='updateForm(1)' @search='search'></custom-head>
    </el-header>

    <custom-table :config='tableConfig' :data='list' :total='total' :isLoading='isLoading' @show='updateForm' @auth='auth' @change='change'></custom-table>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <el-form label-width='100px'>
        <!-- <custom-img :obj='formData.img'></custom-img> -->

        <div>
          <span class='form_title'>{{img.title}}</span>
          <img class='form_img' :src='img.value' />
        </div>

        <div v-for='(item, index) in keys' :key='index'>
          <span class='form_title'>{{formData[item].title}}</span>
          <span class='form_ctn'>{{formData[item].value}}</span>
        </div>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="auth(detail, 0)">拒绝</el-button>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="auth(detail, 1)">同意</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import customImg from "@/components/img";
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from "babel-types";
import api from '@/api/afterSale'

export default {
  components: {
    customHead,
    customTable,
    customImg
  },

  computed: {
    showDialog() {
      return Boolean(this.dialogConfig.status);
    },
    keys() {
      return this.formData ? Object.keys(this.formData) : [];
    }
  },

  data() {
    return {
      dialogConfig: {
        title: "",
        status: 0 // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      img: { title: "商品图片", value: [], limit: 1, alert: null },
      formData: {
        goods_name: { title: "商品名称", value: "", alert: null },
        amount: { title: "购买数量", value: "", alert: null },
        spec: { title: "规格", value: "", alert: null },
        order_sn: { title: "订单编号", value: "", alert: null },
        goods_price: { title: "商品原价(￥)", value: "", alert: null },
        shipping_fee: { title: "运费", value: "", alert: null },
        order_amount: { title: "支付金额", value: "", alert: null },
        add_time: { title: "下单时间", value: "", alert: null },
        paymant_time: { title: "购买时间", value: "", alert: null },
        name: { title: "买家名称", value: "", alert: null },
        phone: { title: "买家电话", value: "", alert: null },
        address: { title: "买家地址", value: "", alert: null },
        reason_info: { title: "退款原因", value: "", alert: null },
        refundPrice: { title: "退款金额", value: "", alert: null },
        refundContent: { title: "退款内容", value: "", alert: null }
      },
      detail: null,
      stopSubmit: false,

      headConfig: {
        dateWidth: 100,
        placeHolder: "请输入订单号",
        selectLabelList: ["订单状态", "类型", "商品类型"],
        selectList: [
          [
            { id: 1, name: "同意" },
            { id: 2, name: "拒绝" },
            { id: 3, name: "待处理" }
          ],
          [{ id: 1, name: "退款" }, { id: 2, name: "退换货" }],
          [{ id: 1, name: "常规商品" }, { id: 2, name: "VIP商品" }]
        ]
      },

      tableConfig: {
        showOperate: true,
        showDetail: true,
        showAuth: true,
        classList: [
          { key: "商品图片", value: "goods_image", isImg: true },
          { key: "商品名称", value: "goods_name" },
          { key: "订单号", value: "order_sn" },
          { key: "买家", value: "name" },
          { key: "联系方式", value: "phone" },
          { key: "金额(￥)", value: "goods_price" },
          { key: "类型", value: "typeStr" },
          { key: "商品类型", value: "goodsTypeStr" },
          { key: "状态", value: "order_state" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10
      },
      isLoading: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //列表================================================
    async getList() {
      this.isLoading = true;
      let res = await api.getReturnList(this.query, this);

      res.data.forEach(this.format);

      this.list = res.data.data;
      this.total =res.pagination.total;
      this.isLoading = false;
    },
    format(item) {
      let matcher,
        selectList = this.headConfig.selectList;

      item.img = [{ url: item.order_goods[0].goods_image }];
      item.goods_image = item.order_goods[0].goods_image;
      item.goods_name = item.order_goods[0].goods_name;
      item.goods_price = item.order_goods[0].goods_price;
      item.name = item.order_reciver_info.name;
      item.phone = item.order_reciver_info.phone;
      item.address = item.order_reciver_info.address;

      matcher = selectList[0].filter(v => v.id === item.state)[0];
      item.stateStr = matcher ? matcher.name : "";

      matcher = selectList[1].filter(v => v.id === item.type)[0];
      item.typeStr = matcher ? matcher.name : "";

      matcher = selectList[2].filter(v => v.id === item.goodsType)[0];
      item.goodsTypeStr = matcher ? matcher.name : "";
    },
    //查看详情============================================
    updateForm(status) {
      let formData = this.formData;

      this.dialogConfig.status = typeof status === "number" ? status : 2;

      this.keys.forEach(v => {
        formData[v].value = status[v];
      });

      this.img.value = status.img[0].url;
      formData.content = status.content;
      this.detail = status;
    },
    //查询================================================
    search(param) {
      console.error("search :", param);

      this.getList();
    },
    //操作================================================
    auth(item, state) {
      
    },
    closeDialog() {
      let config = this.dialogConfig;
      config.status = 0;
    },
    async save(param) {
      this.stopSubmit = false;
    },
    async deleteItem(id) {

      // this.getList();
    },
    //分页
    change(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    }
  }
};
</script>