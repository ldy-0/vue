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
  width: 66px;
  height: 66px;
  border-radius: 50%;
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
        <span class='form_title'>{{img.title}}</span>
        <img class='form_img' :src='img.value' />
      </div>

      <div v-for='(item, index) in keys' :key='index'>
        <span class='form_title'>{{formData[item].title}}</span>
        <span class='form_ctn'>{{formData[item].value}}</span>
      </div>
      <div >
        <span class='form_title'>图片</span>
        <img v-for='(i,index) in detail.geval_image' :key='index' class='form_img' :src="i" alt="">
      </div>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="danger" :disabled="stopSubmit" :loading="stopSubmit" @click="deleteItem(detail)">删除</el-button>
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
import Moment from "@/utils/moment";

export default {
  components: {
    customHead,
    customTable,
    customImg,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    keys(){ return this.formData ? Object.keys(this.formData) : []; },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      img: { title: '头像', value: '', limit: 1, alert: null },
      formData: {
        geval_frommembername: { title: '昵称', value: '', alert: null, },
        geval_goodsname: { title: '商品名称', value: '', alert: null, },
        order_count: { title: '购买数量', value: '', alert: null, },
        order_amount: { title: '价格(￥)', value: '', alert: null, },
        payment_time: { title: '购买时间', value: '', alert: null, },
        geval_addtime: { title: '评论时间', value: '', alert: null, },
        geval_content: { title: '评论内容', value: '', alert: null, },
      },
      detail: {},
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
          { key: '头像', value: 'geval_frommemberavatar', isAvatar: true, },
          { key: '昵称', value: 'geval_frommembername' },
          { key: '商品', value: 'geval_goodsname' },
          { key: '支付金额', value: 'order_amount' },
          { key: '购买时间', value: 'payment_time' },
          { key: '评论时间', value: 'geval_addtime' },
          // { key: '内容', value: 'geval_content' },
          { key: '订单号', value: 'geval_orderno' },
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

      this.list = res.data;
      this.total =res.pagination.total;
      this.isLoading = false;
    },
    format(item) {
        item.geval_addtime = Moment(item.geval_addtime*1000).format("yyyy-MM-dd HH:mm:ss");
    },
    //查看详情============================================
    updateForm(status) {
      let formData = this.formData;

      this.dialogConfig.status = typeof status === "number" ? status : 2;

      this.keys.forEach(v => {
        formData[v].value = status[v];
      });

      this.img.value = status.geval_frommemberavatar;
      this.detail = Object.assign({},status);
      this.detail.geval_image = JSON.parse(status.geval_image);
    },
    //查询================================================
    search(param) {
        this.query.search  = param.search;
      if(param.date){
        this.query.starttime = param.date.startDate;
        this.query.endtime = param.date.endDate;
      }else{
        delete this.query.starttime;
        delete this.query.endtime;
      }
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
    async deleteItem(item) {
        let res = await api.deleteAssess(item.geval_id);
        if(res.status == 0) this.$message.success('删除成功');
        if(res.status != 0) this.$message.error('删除失败',res.error);
      this.getList();
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