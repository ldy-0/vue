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
import customImg from '@/components/img'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    number,
    integer,
    dateTimeRange,
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
      name: { title: '优惠券名称', value: '', alert: null, },
      price: { title: '面值', value: '', alert: null, },
      amount: { title: '数量', value: '', alert: null, },
      time: { title: '有效期', value: '', alert: null, },
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
          { key: '优惠券名称', value: 'name' },
          { key: '面值', value: 'price' },
          { key: '数量', value: 'total' },
          { key: '有效期', value: 'time' },
          { key: '使用条件', value: 'limit' },
          { key: '剩余', value: 'amount' },
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
    // search(param){
    //   console.error('search :', param); 
    // },
    updateForm(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;

      // FIXME: 
      this.name.value = status.name || ''; 
      this.price.value = status.price || '';
      this.amount.value = status.amount || '';
      this.time.value = status.time || '';
      this.limit.value = status.limit || '';
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },
    change(param){
      console.error('param :', param);
      this.query.limit = param.limit;
      this.query.page = param.page;
    },
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },
    async submit(){
      let paramArr = ['name', 'price', 'amount', 'time', 'limit'],
          query = this.query,
          param;

      // this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;
      console.error(this.name.value, this.time);
      
      this.stopSubmit = true;

      // let uploadArr = this.img.value.filter(v => v.raw).map(v => v.raw);
      // let imgRes = await uploadFn(uploadArr);
      // console.error('imgRes :', imgRes);

      param = {
        name: this.name.value,
        price: this.price.value,
        amount: this.amount.value,
        time: this.time.value,
        limit: this.limit.value,
      };

      // return console.error(img, o, 'about param : ', param);
      this.save(param);
    },
    // 
    async save(param){
      console.error('save: ', param); 

      this.stopSubmit = false;
    },
    async getList() { //获取列表
      this.isLoading = true

      console.error('param', this.query)
      // let res = await api.getClassList(this.listQuery, this);

      this.list = [
        { name: '士大夫', price: '13211122233', total: 1, amount: 1343, time: 1324, limit: 'asdfdsf' },
        { name: '士大夫', price: '13211122233', total: 1, amount: 1343, time: 1324, limit: 'asdfdsf' },
        { name: '士大夫', price: '13211122233', total: 1, amount: 1343, time: 1324, limit: 'asdfdsf' },
        { name: '士大夫', price: '13211122233', total: 1, amount: 1343, time: 1324, limit: 'asdfdsf' },
        { name: '士大夫', price: '13211122233', total: 1, amount: 1343, time: 1324, limit: 'asdfdsf' },
      ];
      res.pagination.total// res.pagination.total;
      this.isLoading = false
    },
    async deleteItem(id){
      console.error('delete Item', id);
      // let res = await api.deleteClass(id, null, this);

      this.getList();
    },

  },

  created(){
    this.getList();
  },
}
</script>