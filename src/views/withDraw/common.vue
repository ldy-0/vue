<style lang="css" scoped>
</style>

<template>
<div class="notice">
  
  <el-header class="header">
    <custom-head :config='headConfig' @search='search' @emit='handleHeadEmit' @change="changeSwitch"></custom-head> 
  </el-header>

  <custom-table ref='table' :config='tableConfig' :data='list' :total='total' @modify='handleTableEmit' @change='change'></custom-table>


  <form-view :obj='sellerWithdraw' @close='closeWithdrawDialog'></form-view>

  <form-view :obj='dscoreWithdraw' @close='closeDscoreWithdrawDialog'></form-view>

  <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
    <remark :obj='remark' v-if='isRemark'></remark>

    <form-dscore :obj='dscore' v-if='isDscore'></form-dscore>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/custom/customHead';
import customInput from '@/components/customInput'
import formView from '@/components/form/view'
import remark from '@/components/form/remark'
import formDscore from '@/components/form/dscore'
import dscore from './dscore';
import seller from './seller';
import { export_json_to_excel as toExcel } from "@/vendor/Export2Excel";
import format from '@/utils/format';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    formView,
    remark,
    formDscore,
  },

  mixins: [dscore, seller],

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    isRemark(){ return this.dialogConfig.status == 3; },
    isDscore(){ return this.dialogConfig.status == 4; },
  },

  data() {
    return {
      type: null,

      dialogConfig: {
        title: '',
        status: 0, // 1: 添加  3: 商家提现备注  4: 德分提现设置
      },

      dialogList: [
        { name: 'name', value: 'name', },
      ],

      stopSubmit: false,

      headConfig: {},
      tableConfig: {},
      list: [],
      total: 0,
      query: { page: 1, limit: 10, },

      successTip: '操作成功',
      toExcel: null,

      remark: {
        remark: { title: '备注', value: '', type: 'text', alert: null, },
      },
    }
  },

  methods: {
    handleHeadEmit(index){},
    handleTableEmit(item, index){},
    initDialog(item){},
    submit(){},

    format(v){},
    async getList() {},
    
    search(param){
      let query = {},
          type = this.type,
          inputList = param.inputList,
          statusList = param.statusList,
          dateList = param.dateList,
          selectList = this.headConfig.selectList;

      query.page = 1;
      query.limit = this.query.limit;
      this.$refs.table.initPage();

      if(inputList){
        if(inputList[0]) query.search = inputList[0]; 
      }

      if(dateList){
        if(dateList[0]){
          query.starttime = format.formatDate(dateList[0][0]);
          query.endtime = format.formatDate(dateList[0][1]);
        }
      }

      if(type == 'seller' && statusList){
        if(statusList.hasOwnProperty('0') && statusList[0] !== -1) query.state = statusList[0] || 0;
      }

      if(type == 'dscore' && statusList){
        if(statusList.hasOwnProperty('0') && statusList[0] !== -1) query.status = statusList[0] || 0;
        if(statusList.hasOwnProperty('1') && statusList[1] !== -1) query.type = statusList[1] || 0;
      }

      // console.error(query);
      this.getList(this.query = query);
    },

    changeSwitch(type, index) {
      // 控制发票
      if(this.type == 'seller' && index == 0) this.setSellerInvoice();
    },

    initPage(){
      let route = this.$route,
          name = route.name,
          methodsName = route.name[0].toUpperCase() + route.name.slice(1);

      this.type = name;

      this.headConfig = this[`${name}HeadConfig`];
      this.tableConfig = this[`${name}TableConfig`];

      this.getList = this[`get${methodsName}List`];
      this.format = this[`format${methodsName}`] || this.format;
      this.handleHeadEmit = this[`handle${methodsName}HeadEmit`];
      this.handleTableEmit = this[`handle${methodsName}TableEmit`];
      this.initDialog = this[`init${methodsName}Dialog`];
      this.submit = this[`submit${methodsName}`];
    },

    // immutable
    openDialog(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      
      this.initDialog(status);
    },
    
    closeDialog(){ this.dialogConfig.status = 0; },

    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;

      this.getList();
    },

  },

  created(){
    this.initPage();

    this.getList();

    this.toExcel = toExcel;

    if(this.type === 'seller') this.getSellerInvoice();
  },
}
</script>