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
.dialog-footer{
  margin-left: 10%;
}
</style>

<template>
<div>

<el-header class="header">
  <custom-head :config='headConfig' @emit='emitHandle' @search='search'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @show='showDetail'
                @update='updateForm'
                @look='lookItem'
                @judge='lockItem'
                @modify='dispatch'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="dialogConfig.status === 5">
    <el-form label-width='100px'>
      <mobile :obj='tipInfo'></mobile>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :disabled="clicked" :loading="clicked" @click="saveTip">确 定</el-button>
    </div>
  </div>

  <div v-if="dialogConfig.status === 4">
    <custom-head ref='head' :config='incomeHeadConfig' @search='incomeSearch'></custom-head>
    <custom-table ref='incomeTable' :config='incomeTableConfig' :data='incomeList' :total='incomeTotal' :isLoading='incomeLoading' @change='incomeChange'></custom-table>
  </div>

  <!-- look -->
  <div v-if='dialogConfig.status === 3'>
    <el-header class="header">
      <custom-head :config='twoHeadConfig' @search='searchTwo'></custom-head> 
    </el-header>

    <custom-table :config='twoTableConfig' 
                    :data='twoList' 
                    :total='twoTotal' 
                    :isLoading='twoIsLoading' 
                    @change='changeTwo'></custom-table>
      
  </div>

  <!-- add/minus score -->
  <div v-if='dialogConfig.status === 2'>
    <el-form label-width='100px'>
      <number :obj='score'></number>
      
      <custom-select :obj="scoreCategory"></custom-select>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <div style="color:red">正数为增加积分，负数为删减积分</div>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </div>
  </div>

  <!-- detail -->
  <div v-if='dialogConfig.status === 1' style="display:flex;">
    <el-form label-width='100px' style="flex:1">
      <div>
        <span class='form_title'>{{formData.member_avatar.title}}</span>
        <img class='form_img' :src='formData.member_avatar.value' />
      </div>
      <div v-for='(item, index) in keys' :key='index'>
        <span class='form_title'>{{formData[item].title}}</span>
        <span class='form_ctn'>{{formData[item].value}}</span>
      </div>
    </el-form>
    <el-form label-width='100px' style="flex:1;" v-if="formData.card_mall">
      <div v-for='(item, index) in keys2' :key='index'>
        <span class='form_title'>{{formData2[item].title}}</span>
        <span class='form_ctn'>{{formData2[item].value}}</span>
      </div>
      <div v-if='formData2.imgs.value'>
        <span class='form_title'>{{formData2.imgs.title}}</span>
        <img class='form_img' :src='item' v-for='(item, index) in formData2.imgs.value' :key='index' />
      </div>

      <div v-if='formData2.video.value'>
        <span class='form_title'>{{formData2.video.title}}</span>
        <video :src='formData2.video.value'></video>
      </div>

    </el-form>
  </div>
</el-dialog>


</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import customRadio from '@/components/radio'
import number from '@/components/number'
import mobile from '@/components/mobile'
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';
import api from '@/api/member';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customRadio,
    number,
    mobile,
    customSelect,
    editor,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      member_id:null,
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表 4: 收入明细 5: 温馨提示
      },
      img: { title: '主图', value: [], limit: 1, alert: null },
      score: { title: '德分数量', value: '', alert: null, },
      scoreCategory: { title: '类别', value: '', alert: null, categories: [
        { id: 1, name: '互助德分' },
        { id: 2, name: '消费德分' },
      ], },
      stopSubmit: false,
      tipInfo: { title: '推荐码', value: '', alert: null, },
      clicked: false,

      headConfig: {
        placeHolder: '请输入手机号',
        categories: [
          { id:'', title: '全部' },
          { id: 1, title: 'vip1' },
          { id: 2, title: 'vip2' },
          { id: 3, title: 'vip3' },
          { id: 4, title: 'vip4' },
        ],
        btnList: [
          { titleKey: 'name', name: '温馨提示' },
        ],
      },

      keys: ['member_truename', 'vip_level', 'total_rc_balance', 'available_rc_balance','member_mobile','inviter_nick'],
      formData: {
        member_avatar: { title: '头像', value: '', alert: null, },
        member_truename: { title: '昵称', value: '', alert: null, },
        vip_level: { title: '等级', value: '', alert: null, },
        total_rc_balance: { title: '累计德分', value: '', alert: null, },
        available_rc_balance: { title: '当前德分', value: '', alert: null, },
        member_mobile: { title: '推荐码', value: '', alert: null, },
        inviter_nick: { title: '上级名称', value: '', alert: null, },
      },
      keys2:['member_nick', 'member_mobile', 'member_ww','member_ww','member_qq','company','job','email','address','video','imgs','content'],
      formData2:{
        member_nick: { title: '姓名', value: '', alert: null, },
        member_mobile: { title: '联系方式', value: '', alert: null, },
        member_ww: { title: '微信号码', value: '', alert: null, },
        member_qq: { title: 'QQ号码', value: '', alert: null, },
        company: { title: '公司', value: '', alert: null, },
        job: { title: '职位', value: '', alert: null, },
        email: { title: '邮箱', value: '', alert: null, },
        address: { title: '地址', value: '', alert: null, },
        video: { title: '视频', value: '', alert: null, },
        imgs: { title: '图片', value: [], alert: null, },
        content: { title: '内容', value: '', alert: null, },
      },
      tableConfig: {
        showOperate: true,
        updateTitle: '增加/减少德分',
        detailTitle: '详情',
        lookTitle: '查看下级',
        judge: [ 'lock_state', '关闭', '开启'],
        btnList: [
           { key: 'member_id', value: '收入明细' },
           { key: 'is_freeze', status: 0, value: '冻结' },
           { key: 'is_freeze', status: 1, value: '解冻' },
          //  { key: 'card_mall', status: 2, value: '上架' },
          //  { key: 'card_mall', status: 1, value: '下架' },
        ],
        classList: [
          { key: '头像', value: 'member_avatar', isAvatar: true, },
          { key: '昵称', value: 'member_truename' },
          { key: '姓名', value: 'member_nick' },
          { key: '联系方式', value: 'member_mobile' },
          { key: '等级', value: 'vip_level' },
          { key: '总互转德分', value: 'total_rc_balance' },
          { key: '当前互转德分', value: 'recharge_rc_balance' },
          { key: '总消费德分', value: 'total_available_rc_balance' },
          { key: '当前消费德分', value: 'available_rc_balance' },
          { key: '总余额', value: 'total_predeposit' },
          { key: '当前余额', value: 'available_predeposit' },
          { key: '邀请码', value: 'member_mobile' },
          { key: '上级', value: 'inviter_nick' },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        is_vip: 1,
      },
      isLoading: true,
      twoHeadConfig: {
        placeHolder: '请输入手机号',
        categories: [
          { id:'', title: '全部' },
          { id: 1, title: 'vip1' },
          { id: 2, title: 'vip2' },
          { id: 3, title: 'vip3' },
          { id: 4, title: 'vip4' },
        ]
      },
      // two List
      twoTableConfig: {
        classList: [
          { key: '头像', value: 'member_avatar', isImg: true, },
          { key: '昵称', value: 'member_truename' },
          { key: '姓名', value: 'member_nick' },
          { key: '联系方式', value: 'member_mobile' },
          { key: '等级', value: 'vip_level' },
          { key: '总互转德分', value: 'total_rc_balance' },
          { key: '互转德分', value: 'recharge_rc_balance' },
          { key: '总消费德分', value: 'total_available_rc_balance' },
          { key: '消费德分', value: 'available_rc_balance' },
          { key: '总余额', value: 'total_predeposit' },
          { key: '当前余额', value: 'available_predeposit' },
        ],
      },
      twoList: [],
      twoTotal: 0,
      twoQuery: {
        page: 1,
        limit: 10,
        is_vip: 1,
      },
      twoIsLoading: true,
      incomeHeadConfig: {
        status: null,
        selectLabel: '类型',
        categories: [
          { id: 1, name: '余额明细' },
          { id: 2, name: '德分明细' },
          { id: 3, name: '充值德分明细' },
          { id: 4, name: '激活德分明细' },
        ]
      },
      incomeTableConfig: {
        classList: [
          { key: '描述', value: 'desc', },
          { key: '金额', value: 'price', },
          { key: '时间', value: 'time', },
        ],
      },
      incomeParam: {},
      incomeList: [],
      incomeTotal: 10,
      incomeLoading: false,
    }
  },
  methods: {
    //列表============================================
    async getList() { 
      this.isLoading = true
      let res = await api.getMember_api(this.query, this);
      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.isLoading = false
    },
    async getTwoList(id) {
      this.twoIsLoading = true
      let send = Object.assign({},this.twoQuery);
      send.inviter_id = id
      let res = await api.getMember_api(send, this);
      // res.data.forEach(this.format);
      console.error(res.data);

      this.twoList = res.data;
      this.twoTotal = res.pagination.total;
      this.twoIsLoading = false
    },
    format(item){
      item.img = [ {url: item.image }];
      if(item.card_mall == 1){
        item.lock_state = true;
      } else{
        item.lock_state = false;
      }
    },
    //操作============================================
    emitHandle(index){
      if(index === 0){
        this.getTip();
        this.dialogConfig.status = 5;
      }
    },
    showDetail(item){
      let dialogConfig = this.dialogConfig,
          formData2 = this.formData2,
          formData = this.formData;  

      dialogConfig.status = 1;

      this.keys.forEach(v => formData[v].value = item[v]);  
      this.keys2.forEach(v => formData2[v].value = item[v]);  
      this.formData.member_avatar.value = item.member_avatar;
      this.formData.card_mall = item.card_mall;
    },

    updateForm(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      this.member_id = status.member_id;

      this.score.value = '';
      this.score.alert = null;

      this.scoreCategory.value = '';
      this.scoreCategory.alert = null;
    },

    lookItem(item){
      let dialogConfig = this.dialogConfig;  

      dialogConfig.status = 3;

      this.getTwoList(item.member_id);
    },

    async lockItem(item){
      let send = {
        member_id:item.member_id,
      }
      if(item.card_mall == 1) {
        send.status = 2;
      }else if(item.card_mall ==2) {
        send.status = 1;
      }else{
        return this.$message({message:'名片商城未开启，无法操作'})
      }
      let res = await api.UpDownMember_api(send,this);
      if(res.status == 0){
        this.$message({message:'操作成功',type:'success'});
      }else{
        this.$message({message:res.error,type:'error'});
      }
      this.getList();
    },

    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },
    async submit(){
      let aValidate = ['score', 'scoreCategory'],
          query = this.query,
          param, error;

      aValidate.forEach(v => { if(!this[v].value) this[v].alert = `${this[v].title}不能为空`; });

      if(aValidate.filter(v => this[v].alert)[0]) return ;

      this.stopSubmit = true;

      param = {
        member_id:this.member_id,
        value: this.score.value,
        type: this.scoreCategory.value,
      };

      let res = await api.changeMember_api(param,this);
      if(res.status ==0){
        this.$message({message:'修改成功',type:'success'});
      }else{
        this.$message({message:'修改失败',type:'error'});
      }

      this.dialogConfig.status = 0;
      this.stopSubmit = false;
      this.getList();
    },
    async deleteItem(id){
      console.error('delete Item', id);
      // let res = await api.deleteClass(id, null, this);

      this.getList();
    },
    dispatch(item, index){
      // console.error(item, index);
      // 收入明细
      if(index === 0){
        this.dialogConfig.status = 4;
        this.incomeParam.id = item.member_id;
        this.incomeParam.status = this.incomeHeadConfig.status = 1;
        this.incomeParam.page = 1;

        this.getIncomeList(true);
      }

      // 冻结
      if(index === 1) this.changeStatus(item, 1);

      // 解冻
      if(index === 2) this.changeStatus(item, 0);

      // 下架
      // if(index === 3) this.changeMallStatus(item, 1);

      // 上架
      // if(index === 4) this.changeMallStatus(item, 2);

    },

    incomeFormat(item){
      item.time = item.lg_addtime || item.rcblog_addtime;
      item.price = item.lg_av_amount || item.recharge_amount;
      item.desc = item.lg_desc || item.rcblog_description;
    },

    async getIncomeList(isReset){
      let param = { 
        page: this.incomeParam.page,
        limit: this.incomeParam.limit, 
        type: this.incomeParam.status,
      };

      let res = await api.getIncomeList(this.incomeParam.id, param);
      
      if(res && res.data){
        res.data.forEach(this.incomeFormat);

        this.incomeList = res.data;
        this.incomeTotal = res.pagination.total;
      }

    },

    async changeStatus(item, status){
      let param = { status };

      let res = await api.changeStatus(item.member_id, param);

      this.$message({ type: res.error ? 'error' : 'success', message: res.error || '修改成功' });

      this.getList();
    },
    
    async changeMallStatus(item, status){
      let param = { status };

      let res = await api.changeMallStatus(item.member_id, param);

      this.$message({ type: res.error ? 'error' : 'success', message: res.error || '修改成功' });
      console.error(res);
      this.getList();
    },

    async getTip(){
      let res = await api.getTip();

      if(res && (res.data || typeof res.data === 'string')){
        this.tipInfo.value = res.data;
        this.tipInfo.alert = null;
      }

      if(res.error){
        this.$message.error(res.error);
      }
    },

    async saveTip(){
      let tip = this.tipInfo,
          param = {};

      if(tip.alert) return ;

      this.clicked = true;

      param.value = tip.value;

      let res = await api.saveTip(param); 

      if(res && res.data) this.$message.success('修改成功');

      if(res.error) this.$message.error(res.error);

      this.clicked = false;
      this.closeDialog();
    },
    //分页 查询==========================================
    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    search(param){
      this.query.search = param.search;
      this.query.vip_level = param.status;
      this.getList();
    },
    searchTwo(param){
      this.twoQuery.search = param.search;
      this.twoQuery.vip_level = param.status;
      this.getTwoList();
    },
    incomeSearch(param){
      this.incomeParam.page = 1;
      this.incomeHeadConfig.status = this.incomeParam.status = param.status;

      this.$refs.incomeTable.init();

      this.getIncomeList(true);
    },
    changeTwo(param){
      this.twoQuery.limit = param.limit;
      this.twoQuery.page = param.page;
      this.getTwoList();
    },
    incomeChange(param){
      this.incomeParam.limit = param.limit;
      this.incomeParam.page = param.page;
      this.getIncomeList();
    },
  },

  created(){
    this.getList();
  },
}
</script>