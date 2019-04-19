<style lang="css">
.header{
  margin: 20px 0;
}

.form_title, .form_ctn{
  font-size: 14px;
  line-height: 36px;
}
.form_title{
  box-sizing: border-box;
  display: inline-block;
  width: 100px;
  padding: 0 12px 0 0;
  font-weight: bold;
  text-align: right;
}
.form_img{
  width: 100px;
  height: 100px;
}
</style>

<template>
<div>

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)' @search='search'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @show='updateForm'
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
    <el-form label-width='100px'>
      <!-- <custom-img :obj='formData.img'></custom-img> -->

      <div>
        <span class='form_title'>{{formData.img.title}}</span>
        <img class='form_img' :src='formData.img.value' />
      </div>

      <div v-for='(item, index) in keys' :key='index'>
        <span class='form_title'>{{formData[item].title}}</span>
        <span class='form_ctn'>{{formData[item].value}}</span>
      </div>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="deleteItem(detail)">删除</el-button>
    </span>
</el-dialog>


</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customImg from '@/components/customImg'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';
import api from '@/api/comment'

export default {
  components: {
    customHead,
    customTable,
    customImg,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      keys: ['nickName', 'goods_name', 'amount', 'price', 'pay_time', 'comment_time'],
      formData: {
        img: { title: '主图', value: [], limit: 1, alert: null },
        nickName: { title: '昵称', value: '', alert: null, },
        goods_name: { title: '购买商品', value: '', alert: null, },
        amount: { title: '购买数量', value: '', alert: null, },
        price: { title: '价格(￥)', value: '', alert: null, },
        pay_time: { title: '购买时间', value: '', alert: null, },
        comment_time: { title: '评论时间', value: '', alert: null, },
        content: { title: '评论内容', value: '', alert: null, },
      },
      detail: null,
      stopSubmit: false,

      headConfig: {
        dateWidth: 100,
        placeHolder: '请输入订单号',
      },

      tableConfig: {
        showOperate: true,
        showDetail: true,
        showDelete: true,
        classList: [
          { key: '头像', value: 'image', isImg: true, },
          { key: '昵称', value: 'nickName' },
          { key: '商品', value: 'goods_name' },
          { key: '支付金额', value: 'price' },
          { key: '购买时间', value: 'pay_time' },
          { key: '评论时间', value: 'comment_time' },
          { key: '内容', value: 'content' },
          { key: '订单号', value: 'orderNu' },
        ],
      },
      list: [],
      total: 0,
      query: {
        
        page: 1,
        limit: 10,
      },
      isLoading: true,

    }
  },
  methods: {
    //列表================================================
    async getList() {
      this.isLoading = true;
      let res = await api.getAssessList(this.query, this);

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
  },
  created(){
    this.getList();
  },
}
</script>