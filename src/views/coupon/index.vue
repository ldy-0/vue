<style lang="css">
.header{
  margin: 20px 0;
}
</style>

<template>
<div>

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

      <number :obj='price'></number>

      <integer :obj='amount'></integer>

      <dateTimeRange :obj='time'></dateTimeRange>

      <number :obj='limit'></number>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
</el-dialog>


</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import number from '@/components/number'
import integer from '@/components/integer'
import dateTimeRange from '@/components/dateTimeRange'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';
import api from '@/api/coupon';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    number,
    integer,
    dateTimeRange,
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
      name: { title: '优惠券名称', value: '', alert: null, },
      price: { title: '面值', value: '', alert: null, },
      amount: { title: '数量', value: '', alert: null, },
      time: { title: '有效期', value: '', alert: null, isNow:true},
      limit: { title: '使用条件', value: '', preValue: '满', postValue: '元可用', alert: null, },
      // img: { title: '主图', value: [], limit: 1, alert: null },
      stopSubmit: false,

      headConfig: {
        title: '添加优惠券'
      },

      tableConfig: {
        showOperate: true,
        showDelete: true,
        classList: [
          { key: '优惠券名称', value: 'vouchertemplate_title' },
          { key: '面值', value: 'vouchertemplate_price' },
          { key: '数量', value: 'vouchertemplate_total' },
          { key: '有效期', value: 'vouchertemplate_aging' },
          { key: '使用条件', value: 'vouchertemplate_limit' },
          { key: '剩余', value: 'rest' },
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
    //列表============================================
    async getList() { 
      this.isLoading = true;
      let res = await api.getCoupon(this.query, this);
      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.isLoading = false;
    },
    format(item){
      item.rest= Number(item.vouchertemplate_total)-Number(item.vouchertemplate_giveout);
    },
    //操作============================================
    updateForm(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      if(status == 1){
        this.name.value = '';
        this.price.value ="";
        this.amount.value ="";
        this.limit.value ="";
        this.time.value ='';
      }
    },
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },
    async submit(){
      let paramArr = ['name','price','amount','time','limit'],
          query = this.query,
          param;
      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;
      this.stopSubmit = true;

      param = {
        vouchertemplate_title:this.name.value,
        vouchertemplate_price:this.price.value,
        vouchertemplate_total:this.amount.value,
        vouchertemplate_limit:this.limit.value,
        vouchertemplate_startdate:this.time.value[0],
        vouchertemplate_enddate:this.time.value[1],
        vouchertemplate_gettype:3
      };
      let res = await api.addCoupon(param,this);
      if(res.status ==0){
        this.$message({message:'新增成功',type:'success'});
      }else{
        this.$message({message:'新增失败',type:'error'});
      }
      this.dialogConfig.status = 0;
      this.stopSubmit = false;
      this.getList();
    },
    async deleteItem(item){
      let res = await api.deleteCoupon(item.vouchertemplate_id, null, this);
      if(res.status ==0){
        this.$message({message:'操作成功',type:'success'});
      }else{
        this.$message({message:'操作失败',type:'error'});
      }
      this.getList();
    },
    //分页 查询==========================================
    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    search(param){
      this.query.search = param.search;
      this.getList();
    },
  },

  created(){
    this.getList();
  },
}
</script>