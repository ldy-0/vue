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
  width: 88px;
  height: 88px;
  border-radius: 50%;
}
</style>

<template>
<div>

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)' @search='search' @emit="handleHead"></custom-head> 
</el-header>

<custom-table ref='mainTable' 
                :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @show='updateForm'
                @finish='authItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="30%">
    <el-form label-width='100px'>
      <!-- <custom-img :obj='formData.img'></custom-img> -->

      <!-- <custom-input :obj='name'></custom-input> -->

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
      <el-button type="success" v-if="formData.state" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(1)">已处理</el-button>
    </span>
</el-dialog>

<el-dialog :title="dialogConfig.title" :visible.sync="isRemainSetting" :before-close='closeDialog' width="80%">
  <el-form label-width='68px' v-if="isRemainSetting">
    <el-form-item :label='remain.title' label-width='110px' v-if='remain.title'></el-form-item>

    <c-input :obj='remain.start'></c-input>

    <c-input :obj='remain.fee'></c-input>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog" >取消</el-button>
    <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submitRemain">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import cInput from '@/components/customInput'
import customInput from '@/components/input'
import customSelect from '@/components/select'
import customRadio from '@/components/radio'
import number from '@/components/number'
import integer from '@/components/integer'
import dateTimeRange from '@/components/dateTimeRange'
import customImg from '@/components/customImg'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';
import api from '@/api/withDraw';
import Moment from '@/utils/moment';
export default {
  components: {
    customHead,
    customTable,
    cInput,
    customInput,
    customSelect,
    customRadio,
    number,
    integer,
    dateTimeRange,
    customImg,
    editor,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },

    isRemainSetting(){ return this.dialogConfig.status == 3; },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 2:详情  3:余额提现设置
      },
      keys: ['member_truename', 'member_nick', 'pdc_addtime', 'member_mobile', 'pdc_amount','statusStr','pdc_bank_no','pdc_bank_name'],
      formData: {
        img: { title: '主图', value:'', limit: 1, alert: null },
        member_truename: { title: '昵称', value: '', alert: null, },
        member_nick: { title: '姓名', value: '', alert: null, },
        pdc_addtime: { title: '日期', value: '', alert: null, },
        member_mobile: { title: '手机号', value: '', alert: null, },
        pdc_amount: { title: '提现金额(￥)', value: '', alert: null, },
        statusStr: { title: '状态', value: '', alert: null, },
        pdc_bank_no: { title: '提现账号', value: '', alert: null, },
        pdc_bank_name: { title: '开户支行', value: '', alert: null, },
      },
      stopSubmit: false,

      headConfig: {
        dateWidth: 100,
        placeHolder: '请输入手机号',
        // categories: [
        //   { id: null, title: '全部' },
        //   { id: 0, title: '未处理' },
        //   { id: 1, title: '已处理' },
        // ],
        selectLabelList: ['状态', '账户类别'],
        selectList: [
          [
            { id: -1, title: '全部' },
            { id: 0, title: '未处理' },
            { id: 1, title: '已处理' },
          ],
          [
            { id: -1, title: '全部' },
            { id: 1, title: '银行卡' },
            { id: 2, title: '支付宝' },
            { id: 3, title: '微信' },
          ],
        ],
        btnList: [
          { title: '设置',  },
        ],
      },

      tableConfig: {
        showOperate: true,
        showDetail: true,
        showFinish:['state','处理'],
        classList: [
          { key: '日期', value: 'pdc_addtime' },
          { key: '头像', value: 'member_avatar', isAvatar: true, },
          { key: '昵称', value: 'member_truename' },
          { key: '姓名', value: 'accountName' },
          { key: '账户', value: 'account', },
          { key: '账户类型', value: 'typeStr', },
          { key: '联系方式', value: 'member_mobile' },
          { key: '实际金额', value: 'arrival_amount' },
          { key: '可提现金额', value: 'available_predeposit' },
          { key: '状态', value: 'statusStr' },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },
      isLoading: false,

      remainTypeMap: {
        1: '银行卡',
        2: '支付宝',
        3: '微信',
      },

      remain: {
        title: '设置',
        start:    { title: '起提数值', value: '', alert: null, width: '120px', from: 'min', },
        fee:      { title: '手续费', value: '', alert: null, width: '120px', from: 'ratio', },
      },
    }
  },
  methods: {
    handleHead(index){
      // setting
      if(index == 0){
        this.dialogConfig.status = 3;

        this.getSetting();
      }
    },

    submitRemain(){
      let status = this.dialogConfig.status,
          o = this.remain,
          param;

      if(!(Number(o.start.value) > 0)) return this.$message.error(`${o.start.title}填写不正确!`);
      if(isNaN(Number(o.fee.value)) || o.fee.value < 0 || o.fee.value > 100) return this.$message.error(`${o.fee.title}在0-100之间!`);

      let loading = this.$loading({ text: '提交中...', });

      param = {
        min: o.start.value,
        ratio: o.fee.value,
      };

      this.saveRemain(param, loading);
    },

    async saveRemain(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = await api.setRemainSetting(param);
      this.dialogConfig.status = 0;
      loading.close();
      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '修改失败', loading);

      if(res.status == 0) this.$message.success('操作成功');
      
      this.getSetting();
    },

    //数据
    async getList(){
      this.isLoading = true;
      let res = await api.getWithdrawList(this.query,this);
      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.isLoading = false;
    },
    format(item){
      let categories = this.headConfig.selectList[0];
      Object.keys(item.member).forEach(v=>{item[v] = item.member[v]});
      if(item.pdc_payment_state== 1){
        item.state = false;
      }else{
        item.state= true;
      }
      categories.forEach(i=>{
        if(i.id == item.pdc_payment_state){
          item.statusStr = i.title
        }
      })

      // 账户类型
      item.typeStr = this.remainTypeMap[item.pdc_type];
      item.account = item.pdc_account || item.pdc_bank_no;
      item.accountName = item.pdc_account_name || item.pdc_bank_user;
    },

    async getSetting(){
      let o = this.remain,
          res = await api.getRemainSetting();

      if(typeof res == 'string' || !res || res.error) return this.handleDscoreError(res ? res.error || res : '获取余额提现设置失败');

      ['start', 'fee'].forEach(v => o[v].value = res.data[o[v].from]);
    },

    //操作==============================================
    updateForm(item){
      let formData = this.formData;
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      formData.img.value =item.member_avatar;
      formData.pdc_id = item.pdc_id;
      formData.state = item.state;
      this.keys.forEach(v => { formData[v].value =item[v]; });
    },

    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },
    async authItem(item){
      let send = {
        id:item.pdc_id,
        status:1
      }
      let res = await api.changeStatus(send);
      if(res.status ==0) this.$message.success('操作成功');
      if(res.error) return this.$message.error(`${res.error}`);
      this.getList();
    },
    async submit(){
      let send = {
        id:this.formData.pdc_id,
        status:1
      }
      let res = await api.changeStatus(send);
      if(res.status ==0) this.$message.success('操作成功');
      if(res.error) return this.$message.error(`${res.error}`);
      this.getList();
    },
    //分页-查询==========================================
    search(param){
      let statusList = param.statusList;

      this.query.page = 1;
      this.$refs.mainTable.initPage();

      this.query.telephone = param.search;

      // this.query.status = param.status;
      if(statusList[0] != -1){
        this.query.status = statusList[0];
      }else{
        delete this.query.status;
      }

      // 账户类型
      if(statusList[1] != -1){
        this.query.type = statusList[1];
      }else{
        delete this.query.type;
      }

      if(param.date){
        this.query.starttime = new Date(param.date.startDate);
        this.query.endtime = new Date(param.date.endDate);
      }else{
        delete this.query.starttime;
        delete this.query.endtime;
      }

      this.getList();
    },
    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
  },

  created(){
    this.getList();
  },
}
</script>