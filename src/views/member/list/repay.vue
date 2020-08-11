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
  <custom-head :config='headConfig' @emit='emitHandle' @search='search' @export="download"></custom-head> 
</el-header>

<custom-table ref="mainTable" :config='tableConfig' :data='list' :total='total' @judge='lockItem' @modify='dispatch' @delete='deleteItem' @change='change'></custom-table>

<!-- Detail/会员详情 -->
<repay-detail :obj="detail" @submit="submitMember" @close="detail = null;" v-if="detail"></repay-detail>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <!-- ModifyLevel/修改VIP等级 -->
  <div v-if="dialogConfig.status === tableConfig.LEVEL">
    <el-form label-width='100px'>
      <custom-select :obj='level'></custom-select>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeLevelDialog">取消</el-button>
      <el-button type="primary" @click="submitLevel">确 定</el-button>
    </div>
  </div>

  <!-- Remark/备注 -->
  <div v-if="dialogConfig.status === tableConfig.REMARK">
    <el-form label-width='100px'>
      <custom-input :obj='remark'></custom-input>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeRemarkDialog">取消</el-button>
      <el-button type="primary" @click="submitRemark">确 定</el-button>
    </div>
  </div>

  <!-- tip/全局推荐码 -->
  <div v-if="dialogConfig.status === 9">
    <el-form label-width='100px'>
      <mobile :obj='tipInfo'></mobile>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :disabled="clicked" :loading="clicked" @click="saveTip">确 定</el-button>
    </div>
  </div>

  <!-- IncomeDetail/收入明细 -->
  <div v-if="dialogConfig.status === tableConfig.INCOME">
    <custom-head ref='head' :config='incomeHeadConfig' @search='incomeSearch'></custom-head>
    <custom-table ref='incomeTable' :config='incomeTableConfig' :data='incomeList' :total='incomeTotal' :isLoading='incomeLoading' @change='incomeChange'></custom-table>
  </div>

  <!-- LookSubLevel/下级列表 -->
  <div v-if='dialogConfig.status === tableConfig.CHILDREN'>
    <custom-head :config='twoHeadConfig' @search='searchTwo' @export="download($event, twoQuery.inviter_id)"></custom-head> 

    <custom-table :config='twoTableConfig' :data='twoList' :total='twoTotal' @change='changeTwo'></custom-table>
  </div>

  <!-- add/minus 增加/减少 -->
  <div v-if='dialogConfig.status === tableConfig.MODIFY'>
    <el-form label-width='100px'>
      <custom-input :obj='asset' v-if="modifyCategory.value == modifyCategory.ASSET"></custom-input>

      <custom-input :obj='score' v-else></custom-input>
      
      <custom-select :obj="modifyCategory"></custom-select>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <div style="color:red">正数为增加，负数为删减</div>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </div>
  </div>

</el-dialog>

</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/customInput'
import customRadio from '@/components/radio'
import number from '@/components/number'
import mobile from '@/components/mobile'
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
import repayDetail from '@/components/form/repay'
import uploadFn from "@/utils/tencent_cos";
import api from '@/api/member';
import remark from './remark';
import dScore from './dScore';
import level from './level';
import income from './income.js';
import modify from './modify.js';
import { export_json_to_excel as toExcel } from "@/vendor/Export2Excel"
import dl from './download.js'
import fs from '@/utils/fs.js';

export default {
  mixins: [remark, dScore, level, income, modify],

  components: {
    customHead,
    customTable,
    customInput,
    customRadio,
    number,
    mobile,
    customSelect,
    repayDetail,
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
        status: 0, // 1: 查看详情 2: 收入明细 5：备注 6: 下级  7: 等级 9: 温馨提示 10：增加/减少
      },
      img: { title: '主图', value: [], limit: 1, alert: null },
      stopSubmit: false,
      tipInfo: { title: '推荐码', value: '', alert: null, },
      clicked: false,

      headConfig: {
        placeHolder: '请输入手机号或姓名',
        // showExport: true,
        btnList: [
          // { titleKey: 'name', name: '温馨提示' },
        ],
        selectLabelList: ['分类', '状态'],
        selectList: [
          [
            { id:'', title: '全部' },
            { id: 1, title: 'vip1' },
            { id: 2, title: 'vip2' },
            { id: 3, title: 'vip3' },
            { id: 4, title: 'vip4' },
            { id: 5, title: 'vip5' },
          ],
          [
            { id:'', title: '全部' },
            { id: 1, title: '正常' },
            { id: 2, title: '冻结' },
            { id: 3, title: '注销' },
          ],
          // [
          //   { id: 0, title: '升序', },
          //   { id: 1, title: '降序', },
          // ],
        ],
        dateWidth: '400px',
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        showDelete: true,
        judge: [ 'lock_state', '关闭', '开启'],
        btnList: [
           { key: 'member_id', value: '详情' },
           { key: 'member_id', value: '收入明细' },
           { key: 'is_freeze', status: 0, value: '冻结' },
           { key: 'is_freeze', status: 1, value: '解冻' },
           { key: 'member_id', value: '增加/减少', },
           { key: 'member_id', value: '备注' },
           { key: 'member_id', value: '查看下级', },
           { key: 'member_id', value: '修改等级', },
           { key: 'member_id', value: '清除', type: 'danger', },
           { key: 'is_suspend', status: 0, value: '注销账号', type: 'danger', },
           { key: 'is_suspend', status: 1, value: '取消注销', type: 'danger', },
        ],
        classList: [
          // { key: '头像', value: 'member_avatar', isAvatar: true, },
          // { key: '昵称', value: 'member_truename' },
          { key: '姓名', value: 'member_nick' },
          { key: '联系方式', value: 'member_mobile' },
          { key: '等级', value: 'vip_level' },
          // { key: '总互转德分', value: 'total_rc_balance' },
          { key: '当前互转德分', value: 'recharge_rc_balance' },
          // { key: '总消费德分', value: 'total_available_rc_balance' },
          { key: '当前消费德分', value: 'available_rc_balance' },
          { key: '总余额', value: 'total_predeposit' },
          { key: '当前余额', value: 'available_predeposit' },
          { key: '总资产', value: 'total_assets' },
          { key: '当前资产', value: 'available_assets' },
          // { key: '邀请码', value: 'member_mobile' },
          // { key: '上级', value: 'inviter_nick' },
          { key: '注册时间', value: 'time' },
          { key: '分期总额', value: 'repay_total' },
          { key: '逾期总额', value: 'repay_amount' },
          { key: '超时时间', value: 'delay_time' },
          { key: '账号状态', value: 'statusStr' },
        ],
        DETAIL: 1,
        INCOME: 2,
        FREEZE: 3,
        UNFREEZE: 4,
        REMARK: 5,
        CHILDREN: 6,
        LEVEL: 7,
        CLEAR: 8,
        MODIFY: 10,
      },

      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        // is_vip: 1,
        // sort: 0,
        // vip_sort: 'vip_asc',
      },
      detail: null,

      twoHeadConfig: {
        placeHolder: '请输入手机号',
        showExport: true,
        selectList: [
          [
            { id:'', title: '全部' },
            { id: 1, title: 'vip1' },
            { id: 2, title: 'vip2' },
            { id: 3, title: 'vip3' },
            { id: 4, title: 'vip4' },
          ],
        ],
      },
      // two List
      twoTableConfig: {
        loading: false,
        classList: [
          { key: '头像', value: 'member_avatar', isImg: true, },
          { key: '昵称', value: 'member_truename' },
          { key: '姓名', value: 'member_nick' },
          { key: '联系方式', value: 'member_mobile' },
          { key: '等级', value: 'vip_level' },
          // { key: '总互转德分', value: 'total_rc_balance' },
          { key: '互转德分', value: 'recharge_rc_balance' },
          // { key: '总消费德分', value: 'total_available_rc_balance' },
          { key: '消费德分', value: 'available_rc_balance' },
          { key: '总余额', value: 'total_predeposit' },
          { key: '当前余额', value: 'available_predeposit' },
          { key: '总资产', value: 'total_assets' },
          { key: '当前资产', value: 'available_assets' },
          { key: '注册时间', value: 'member_addtime' },
        ],
      },
      twoList: [],
      twoTotal: 0,
      twoQuery: {
        page: 1,
        limit: 10,
        is_vip: 1,
      },
    }
  },
  methods: {
    // 列表
    async getList() { 
      this.tableConfig.loading = true;
      let res = await api.getRepayMemberList(this.query);

      if(!res || typeof res === 'string' || res.error){
        this.tableConfig.loading = false;
        return this.$message.error(res ? res.error || res : '获取列表失败!');
      }

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data;
      }
      
      this.total = res.pagination ? res.pagination.total : this.list.length;
      this.tableConfig.loading = false;
    },

    async getTwoList(id) {
      this.twoTableConfig.loading = true;

      let send = Object.assign({},this.twoQuery);

      if(id) this.twoQuery.inviter_id = send.inviter_id = id

      let res = await api.getMember_api(send, this);
      res.data.forEach(this.formatMember);

      this.twoList = res.data;
      this.twoTotal = res.pagination.total;
      this.twoTableConfig.loading = false;
    },

    formatMember(item){
      item.img = [ {url: item.image }];
      if(item.card_mall == 1){
        item.lock_state = true;
      } else{
        item.lock_state = false;
      }

      // 注册时间
      let t = new Date(item.member_addtime * 1000);
      item.time = `${t.getFullYear()}-${t.getMonth() < 9 ? '0' : ''}${t.getMonth() + 1}-${t.getDate() < 10 ? '0' : ''}${t.getDate()} 
                    ${t.getHours() < 10 ? '0' : ''}${t.getHours()}:${t.getMinutes() < 10 ? '0' : ''}${t.getMinutes()}:${t.getSeconds() < 10 ? '0' : ''}${t.getSeconds()}`;
    },

    initTwoQuery(){
      this.twoQuery.page = 1;
      if(this.twoQuery.search) delete this.twoQuery.search;
      if(this.twoQuery.vip_level) delete this.twoQuery.vip_level;
    },

    format(item){
      let memberInfoList = ['member_id', 'member_nick', 'member_mobile', 'vip_level', 'recharge_rc_balance', 'available_rc_balance', 'total_predeposit', 'available_predeposit', 'total_assets', 
            'available_assets', 'is_freeze', 'is_suspend', 'card_mall', 'member_avatar', 'member_truename', 'member_remark'];
      
      // 会员信息
      memberInfoList.forEach(v => item[v] = item.member[v]);
      item.statusStr = item.is_freeze == 1 ? '冻结' : item.is_suspend == 1 ? '注销中' : '正常';

      item.img = [ {url: item.image }];
      if(item.card_mall == 1){
        item.lock_state = true;
      } else{
        item.lock_state = false;
      }

      // 注册时间
      let t = new Date(item.member.member_addtime * 1000);
      item.time = `${t.getFullYear()}-${t.getMonth() < 9 ? '0' : ''}${t.getMonth() + 1}-${t.getDate() < 10 ? '0' : ''}${t.getDate()} 
                    ${t.getHours() < 10 ? '0' : ''}${t.getHours()}:${t.getMinutes() < 10 ? '0' : ''}${t.getMinutes()}:${t.getSeconds() < 10 ? '0' : ''}${t.getSeconds()}`;
    },
    // member table 操作
    emitHandle(index){
      if(index === 0){
        this.getTip();
        this.dialogConfig.status = 9;
      }
    },

    async showDetail(item){
      let dialogConfig = this.dialogConfig,
          tableConfig = this.tableConfig;

      this.getRepayMember(item);
    },

    async getRepayMember(item){
      let res = await api.getRepayMember(item.member_id);
      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取详情信息失败!');

      if(res.data) this.detail = res.data;
    },

    submitMember(param) {
      this.detail = null;
      this.getList();
    },

    lookItem(item){
      let dialogConfig = this.dialogConfig,
          tableConfig = this.tableConfig;  

      dialogConfig.status = tableConfig.CHILDREN;

      this.initTwoQuery();
      this.getTwoList(item.member_id);
    },

    // 名片商城上下架
    async lockItem(item){
      let send = {
        type: 'card_mall',
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

      this.$message({ message: res.error || '操作成功', type: typeof res == 'string' || res.error ? 'error' : 'success', });
      
      this.getList();
    },

    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },

    // 修改积分
    async submit(){
      let aValidate = ['modifyCategory'],
          category = this.modifyCategory,
          query = this.query,
          isAsset = false,
          param, error;

      if(category.value === category.ASSET) {
        isAsset = true;
        aValidate.unshift('asset');
      }

      if(category.value === category.EXCHANGE || category.value === category.CONSUME) aValidate.unshift('score');

      aValidate.forEach(v => { if(!this[v].value) this[v].alert = `${this[v].title}不能为空`; });

      if(aValidate.filter(v => this[v].alert)[0]) return ;

      this.stopSubmit = true;

      param = {
        member_id:this.member_id,
        value: isAsset ? this.asset.value : this.score.value,
        model: isAsset ? 2 : 1,
      };

      // dscore
      if(param.model === 1) param.type = this.modifyCategory.value;

      let res = await api.changeMember_api(param);

      this.$message(res.status === 0 ? { message:'修改成功', type:'success' } : { message: res ? res.error || res : '修改失败', type:'error' });

      this.dialogConfig.status = 0;
      this.stopSubmit = false;
      this.getList();
    },

    async deleteItem(item){
      let res = await api.deleteMember(item.member_id, null);

      if(res) this.$message({
        type: res.error ? 'error' : 'success',
        message: res.error || '删除成功',
      });

      this.getList();
    },

    dispatch(item, index){
      let tableConfig = this.tableConfig;
      // detail
      if(index === 0) return this.showDetail(item);

      // 收入明细
      if(index === 1){
        this.dialogConfig.status = tableConfig.INCOME;
        this.incomeParam.id = item.member_id;
        this.incomeParam.status = this.incomeHeadConfig.status = 1;
        this.incomeParam.page = 1;

        this.getIncomeList(true);
      }

      // 冻结
      if(index === 2) this.changeStatus(item, 1, 'freeze');
      // 解冻
      if(index === 3) this.changeStatus(item, 0, 'freeze');

      // add/minute
      if(index === 4) return this.showModify(item);

      // 备注
      if(index === 5) this.openRemarkDialog(item);

      // 查看下级
      if(index === 6) this.lookItem(item);

      // 修改会员等级
      if(index === 7) this.openLevelDialog(item);

      // 清除德分记录
      if(index === 8) this.clearDScoreRecord(item);

      // 注销
      if(index === 9) this.changeStatus(item, 1, 'suspend');
      if(index === 10) this.changeStatus(item, 0, 'suspend');
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

    async changeStatus(item, status, type){
      let param = { status };
      if(type) param.type = type;

      let res = await api.changeStatus(item.member_id, param);

      this.$message({ type: res.error ? 'error' : 'success', message: res.error || '修改成功' });

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
      let statusList = param.statusList,
          date = param.date,
          arr = ['vip_asc', 'vip_desc'];

      this.query.search = param.search || null;
      this.query.vip_level = statusList[0] || null;

      // this.query.vip_sort = arr[statusList[1] || 0];
      // 状态
      if(statusList[1]){
        this.query.is_freeze = statusList[1] == 2 ? 1 : statusList[1] == 1 ? 0 : null;
        this.query.is_suspend = statusList[1] == 3 ? 1 : statusList[1] == 1 ? 0 : null;
      }else{
        this.query.is_freeze = this.query.is_suspend = null;
      }

      this.query.starttime = date ? date.startDate : null;
      this.query.endtime = date ? date.endDate : null;

      this.query.page = 1;
      this.$refs.mainTable.initPage();

      this.getList();
    },

    searchTwo(param){
      let statusList = param.statusList;

      this.initTwoQuery();

      this.twoQuery.search = param.search;
      this.twoQuery.vip_level = statusList[0] || null;

      this.getTwoList();
    },
    
    changeTwo(param){
      this.twoQuery.limit = param.limit;
      this.twoQuery.page = param.page;

      this.getTwoList();
    },

    async download(loading, id) {
      let param = { is_vip: 1, },
          query = this.query;

      if(id) {
        param.inviter_id = id;
        query = this.twoQuery;
      }

      if(query.search) param.search = query.search;
      if(query.vip_level) param.vip_level = query.vip_level;
      if(query.vip_sort) param.vip_sort = query.vip_sort;

      let res = await api.exportMember(param);

      
      if(!res || typeof res === 'string' || res.error){
        loading.close();
        return this.$message.error(res ? res.error || res : '获取列表失败!');
      }

      // if(res && res.data){
      //   res.data.forEach(this.format);
      // }
      // toExcel({ header: dl.head, data: dl.getData(res.data), filename: '会员列表' });

      fs.download(res, '会员列表.xlsx');
      loading.close();
    }
  },

  created(){
    this.getList();
  },

}
</script>