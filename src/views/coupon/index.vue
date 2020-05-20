<style lang="stylus">
  .notice
    .header
      margin-top 20px
    .big-icon
      font-size 30px
      color #409EFF
    .big-icon-no
      font-size 30px
      color #b19999
      // color #F56C6C

</style>

<template>
<div>

<el-container class="notice">

  <el-header class="header">

    <custom-head :config='headConfig' @add='showForm'></custom-head>
          
  </el-header>

  <custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @update='showForm'
                @delete='deleteItem'
                @change='change'></custom-table>

  <custom-dialog :config='dialogConfig'
                  :visible='isShow'
                  :detail='formData'
                  @submit='submit'
                  @cancel='cancel'></custom-dialog>
</el-container>

</div>
</template>
<script>

import api from '@/api/api' 
import upLoadFile from '@/utils/aahbs.js'
import customTable from '@/components/customTable'
import customHead from '@/components/customHead'
import customDialog from '@/components/customDialog'

export default {
  components: {
    customTable,
    customHead,
    customDialog,
  },

  async created() {

    this.getList()
  },

  data() {
    return {
      headConfig: {
        showAdd: true,
        title: '新增优惠劵'
      },
      tableConfig: {
        showOperate: true,
        showDetail: true,
        showDelete: true,
        classList: [
          { key: '优惠券名称', value: 'vouchertemplate_title' },
          { key: '面值(￥)', value: 'vouchertemplate_price' },
          { key: '有效期', value: 'vouchertemplate_aging' },
          { key: '数量', value: 'vouchertemplate_total' },
        ], 
      },
      dialogConfig: {
        width: '80%',
        labelWidth: '100px',
        classList: [
          { key: '优惠劵名称', value: 'vouchertemplate_title', isText: true, },
          { key: '面值(￥)', value: 'vouchertemplate_price', isNumber: true, },
          { key: '数量', value: 'vouchertemplate_total', isInteger: true, },
          { key: '有效期', value: 'dateRange', isDateRange: true },
          { key: '优惠券码', value: 'a', isDetail: true, title: '生成' },
        ],
        rules: {
          'vouchertemplate_title': [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { message: '不能超过15个字符!', max: 15, trigger: 'blur' }
          ],
          'vouchertemplate_price': [ { required: true, message: '值不能为空!', trigger: 'blur' } ],
          'vouchertemplate_total': [ { required: true, message: '值不能为空!', trigger: 'blur' } ],
          'dateRange': [ { required: true, message: '值不能为空!', trigger: 'blur' } ]
        },
        canSubmit: true,
      },
      isShow: false,
      isAddItem: true,
      isLoading: false,
      list: [],
      formData: {
        storegc_name: '',
        storegc_sort: '',
      },
      detail: null,
      listQuery: {
        page: 1,
        limit: 2,
      },
      total: 0,
      category: '',
      hasTwoClass: null,
      searchKeyWord: '',
      showClass: false,
      parentClass: {},
      twoClassList: [],
    }
  },
  methods: {
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
    },
    showForm(item){ //
      if(item){
        this.detail = item;
        this.isAddItem = false;
      }else{
        this.isAddItem = true;
      }

      this.initForm(item);
      this.isShow = true
    },
    cancel(){ this.isShow = false; },
    initForm(item){
      let o = this.formData,
          obj = {};

      if(item){
        for(let key in o){ obj[key] = item[key] }
      }else{
        for(let key in o){ obj[key] = Array.isArray(o[key]) ? [] : '' }
      }

      this.formData = obj;
      console.log('initform :', item, this.formData);
    },
    async submit(formName) {

      this.dialogConfig.canSubmit = true
      return console.log('formData', this.formData);
      
      let o = this.formData,
          param = {
            vouchertemplate_title: o.vouchertemplate_title, 
            vouchertemplate_price: o.vouchertemplate_price,
            vouchertemplate_total: o.vouchertemplate_total,
            vouchertemplate_startdate: new Date(o.dateRange[0]).getTime(),
            vouchertemplate_enddate: new Date(o.dateRage[1]).getTime()
          };
      let res = this.isAddItem ? await api.setClass(param, this) : await api.updateClass(this.detail.storegc_id, param, this);

      this.dialogConfig.canSubmit = true;
      this.isShow = false;

      this.showClass ? this.getTwoList() : this.getList();
      
    },
    change(v) {
      this.listQuery.page = v.page;
      this.listQuery.limit = v.limit; 
      this.getList()
    },
    getDate(stamp){
      let t = new Date(stamp);
      return `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}`;
    },
    async getList() { //获取列表
      this.isLoading = true

      console.log('param', this.listQuery)
      let res = await api.getCouponList(this.listQuery, this);
      // res.data.forEach(v => v.date = `${this.getDate(v.vouchertemplate_startdate)}${this.getDate}` );

      this.list = res.data && res.data || [];
      this.total = this.list.length; // res.pagination ? res.pagination.total : 0;
      this.isLoading = false
      console.log('classList res: ', res, this.list);
    },
    async deleteItem(item){
      let res = await api.deleteClass(item.storegc_id, null, this);

      this.showClass ? this.getTwoList() : this.getList();
      
    },
    
  }
}
</script>