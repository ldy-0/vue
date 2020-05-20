<style lang="stylus">
  .notice
    .header
      margin-top 20px
    .big-icon
      font-size 30px
      color #409EFF
</style>

<template>
<div>

<el-container class="notice">

  <el-header class="header">

    <custom-head :config='headConfig'
                  @add='showForm'></custom-head> 

  </el-header>

  <custom-table :config='tableConfig' :data='list' :classList='classList' :total='total' :isLoading='isLoading' @change='change'></custom-table>

  <!-- add user -->
  <custom-dialog :config='dialogConfig'
                  :visible='isShowForm'
                  :detail='formData'
                  @submit='submit'
                  @cancel='cancel'></custom-dialog>

</el-container>
</div>
</template>
<script>

import api from '@/api/api' 
import customHead from '@/components/customHead'
import customTable from '@/components/customTable'
import customDialog from '@/components/customDialog'

export default {
  components: {
    customHead,
    customTable,
    customDialog,
  },

  data() {
    return {
      headConfig: {
        showAdd: true,
        title: '添加成员',
      },
      dialogConfig: {
        width: '80%',    
        labelWidth: '100px',
        canSubmit: true,
        classList: [
          { key: '姓名', value: 'seller_name', isText: true, },
          { key: '账号', value: 'seller_nick', isText: true },
          { key: '密码', value: 'seller_password', isText: true },
          { key: '权限', value: 'auth', isRadio: true, },
        ],
        rules: {
          'seller_name': [ { required: true, message: '请输入姓名!' } ],
          'seller_nick': [ 
            { required: true, message: '请输入账号!', },
            { message: '账号名称必须是3~15位!', min: 3, max: 15 } 
          ],
          'seller_password': [ 
            { required: true, message: '请输入密码!' },
            { message: '密码不能少于6位!', min: 6 } 
          ],
        }
      },
      formData: {},
      isShowForm: false,
      isAdd: true,
      tableConfig: {
        showOperate: true,
      },
      classList: [
        { key: '姓名', value: 'seller_name', },
        { key: '设计师', value: '' },
        { key: '设计师审核', value: '' },
        { key: '提现审核', value: '' },
        { key: '订单', value: '' },
        { key: '退款订单', value: '' },
        { key: '作品审核', value: '' },
        { key: '问卷', value: '' },
        { key: '优惠券', value: '' },
        { key: '运营', value: '' },
        { key: '权限', value: 'auth' },
      ],
      list: [],
      param: {
        page: 1,
        limit: 10,
      },
      total: 0,
      isLoading: false,
    }
  },

  methods: {
    showForm(item) {
      this.isShowForm = true; 

      if(item){
        this.isAdd = false;
      }else{
        this.isAdd = true;
      }

    },
    cancel(){ this.isShowForm = false; },
    submit(){
      console.log('formData :', this.formData);
      this.saveUser();
    },
    change(v){
      this.param.page = v.page;
      this.param.limit = v.limit;
      this.getList();
    },
    async getList(){
      this.isLoading = true;
      let res = await api.getUserList(this.param, this);

      this.list = res.data ? res.data : [];
      this.total = res.pagination ? res.pagination.total : 0;
      console.log('get list res: ', res, this.list);
      this.isLoading = false;
    },
    async saveUser(){
      let o = this.formData,
          param = {
            seller_name: o.seller_name,
            seller_name: o.seller_nick,
            seller_password: o.seller_password,
            sellergroup_id: 0, 
            seller_limits: this.getAuthList(o),
          };
      console.log('user param : ', param);

      let res = this.isAdd ? await api.setUser(param) : await api.updateUser();
    },
    getAuthList(obj){
      let arr = [];

      for(let key in obj){
        if(!/seller/.test(key) && obj[key] === '1') arr.push(key);
      }

      return arr;
    }
  },

  created(){
    this.getList()
  },
}
</script>