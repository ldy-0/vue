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
  width: 150px;
  height: 150px;
}
</style>

<template>
<div>

<el-header class="header">
  <custom-head :config='headConfig' @search='search' @export='exportFile'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @show='updateForm'
                @modify='changeItem'
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

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <!-- <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button> -->
    </span>
</el-dialog>


</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import customSelect from '@/components/select'
import number from '@/components/number'
import integer from '@/components/integer'
import dateTimeRange from '@/components/dateTimeRange'
import customImg from '@/components/customImg'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';
import api from '@/api/order'

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customSelect,
    number,
    integer,
    dateTimeRange,
    customImg,
    editor,
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
      formData: {
        goods_name: { title: '商品名称', value: '', alert: null, },
        class: { title: '分类', value: '', alert: null, },
        amount: { title: '购买数量', value: '', alert: null, },
        spec: { title: '规格', value: '', alert: null, },
        orderNu: { title: '订单编号', value: '', alert: null, },
        price: { title: '商品原价(￥)', value: '', alert: null, },
        orderPrice: { title: '订单金额', value: '', alert: null, },
        freight: { title: '运费', value: '', alert: null, },
        payPrice: { title: '支付金额', value: '', alert: null, },
        submitTime: { title: '下单时间', value: '', alert: null, },
        payTime: { title: '购买时间', value: '', alert: null, },
        name: { title: '买家名称', value: '', alert: null, },
        mobile: { title: '买家电话', value: '', alert: null, },
        address: { title: '买家地址', value: '', alert: null, },
        coupon: { title: '优惠券', value: '', alert: null, },
        remark: { title: '备注', value: '', alert: null, },
      },
      img: { title: '主图', value: [], limit: 1, alert: null },
      content: { title: '内容', value: '', alert: null, },
      stopSubmit: false,

      headConfig: {
        placeHolder: '请输入订单号',
        dateWidth: 100,
        showExport: true,
        selectLabelList: ['订单状态'],
        selectList: [
          [
            { id: 10, title: '待付款' },
            { id: 20, title: '待发货' },
            { id: 30, title: '待收货' },
            { id: 40, title: '已完成' },
            { id: 50, title: '已评价' },
          ],
        ]
      },

      tableConfig: {
        showOperate: true,
        detailTitle: '详情',
        btnList: [
          { key: 'showSend', value: '发货' },
          { key: 'showLookComment', value: '查看评论' },
        ],
        classList: [
          { key: '商品图片', value: 'goods_image', isImg: true, },
          { key: '商品名称', value: 'goods_name' },
          { key: '订单号', value: 'order_sn' },
          { key: '金额(￥)', value: 'order_amount' },
          { key: '数量', value: 'order_amount' },
          { key: '买家', value: 'name' },
          { key: '联系方式', value: 'phone' },
          { key: '订单状态', value: 'order_state' },
          { key: '下单时间', value: 'add_time' },
        ],
      },
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      isLoading: true,

    }
  },
  methods: {
    search(param){
      console.error('search :', param); 
    },
    exportFile(loading){
      console.error('export');
      loading.close();
    },
    updateForm(status){
      let formData = this.formData,
          pricePattern = /[pP]rice|freight/;

      this.dialogConfig.status = typeof status === 'number' ? status : 2;

      this.img.value = status.img[0].url;
      this.keys.forEach(v => { formData[v].value = (pricePattern.test(v) ? '￥' : '') + status[v]; });
      this.content.value = status.content || '';
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },
    change(param){
      console.error('param :', param);
      this.listQuery.limit = param.limit;
      this.listQuery.page = param.page;
      this.getList();
    },
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },
    format(item){
      let arr = ['status'],
          selectList = this.headConfig.selectList;

      item.img = [ {url: item.order_goods[0].goods_image }];
      item.goods_image = item.order_goods[0].goods_image;
      item.goods_name = item.order_goods[0].goods_name;
      item.name = item.order_reciver_info.name;
      item.phone = item.order_reciver_info.phone;
      item.address = item.order_reciver_info.address;

      let strList = this.exchange(selectList, arr.map(v => item[v]), 'id', 'title');  
      arr.forEach((v, i) => item[`${v}Str`] = strList[i]);

      // 标记发货按钮是否显示
      item.showSend = item.order_state_id == 20;
      // 标记查看评论按钮是否显示
      item.showLookComment = item.order_state_id == 50;
    },
    exchange(sourceList, valueList, filterProperty, destProperty){
      let res,
          resList = [];

      sourceList.forEach((list, index) => {
        res = list.filter(v => v[filterProperty] == valueList[index])[0];
        resList[index] = res ? res[destProperty] : '';
      }); 

      return resList;
    },
    // 
    async save(param){
      console.error('save: ', param); 

      this.stopSubmit = false;
    },
    async getList() { //获取列表
      this.isLoading = true
      let res = await api.getOrderList_api(this.listQuery, this);
      res.data.forEach(this.format);
      this.list = res.data;
      this.total = res.pagination.total;
      this.isLoading = false
    },
    async changeItem(item, index){
      let filed = this.tableConfig.btnList[index].value;

      // let res = 
      console.error(item, filed);

      this.getList();
    },
    async deleteItem(id){
      console.error('delete Item', id);
      // let res = await api.deleteClass(id, null, this);

      this.getList();
    },

  },

  created(){
    // let arr = new Array(10);

    this.getList();
  },
}
</script>