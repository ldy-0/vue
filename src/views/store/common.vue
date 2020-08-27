<style lang="css" scoped>
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @search='search' @emit='handleHeadEmit'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' :data='list' :total='total' @modify='handleTableEmit' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="dialogConfig.status > 0">
    <!-- <el-form label-width='100px'>

      <el-form-item :label="checkDesc.title">
        <editor style='width: 800px;' v-model='checkDesc.value'></editor>
        <el-alert type='error' :title='checkDesc.alert' v-if='checkDesc.alert'></el-alert>
      </el-form-item>     
    </el-form> -->
    <store :obj='store' v-if='[1, 2, 3].indexOf(dialogConfig.status) !== -1'></store> 
    
    <!-- 拒绝 -->
    <refuse :obj='refuse' v-if='dialogConfig.status == 4'></refuse>
    
    <!-- 下架 -->
    <down :obj='down' v-if='dialogConfig.status == 5'></down>

    <!-- 备注 -->
    <remark :obj='remark' v-if='dialogConfig.status == 6'></remark>

    <!-- 排序 -->
    <sort :obj='sort' v-if='dialogConfig.status == 7'></sort>

    <!-- 资产设置 -->
    <asset :obj='asset' v-if='dialogConfig.status == 8'></asset>

    <span slot="footer" class="dialog-footer" v-if='[3].indexOf(dialogConfig.status) === -1'>
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="submited" :loading="submited" @click="submit">确 定</el-button>
    </span>
  </div>
</el-dialog>

</div>
</template>
<script>
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/custom/customHead';
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import editor from '@/components/Tinymce'
import check from './check';
import all from './all';
import recommend from './recommend';
import storeClass from './class';
import store from '@/components/form/store'
import remark from '@/components/form/remark'
import refuse from '@/components/form/refuse'
import down from '@/components/form/down'
import sort from '@/components/form/sort'
import asset from '@/components/form/storeAsset'
import { export_json_to_excel as toExcel } from "@/vendor/Export2Excel";
import { format } from 'url';

export default {
  components: {
    customHead,
    customTable,
    editor,
    store,
    remark,
    refuse,
    down,
    sort,
    asset,
  },

  mixins: [check, all, recommend, storeClass],

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      CLASSLIST: [
        // { title: '美妆饰品', value: 1, },
        // { title: '百货食品', value: 2, }, 
        // { title: '家用电器', value: 3, },
        // { title: '服饰鞋包', value: 4, },
        // { title: '母婴玩具', value: 5, },
        // { title: '蔬果生鲜', value: 6, },
        // { title: '手机数码', value: 7, },
        // { title: '家居生活', value: 8, },
        // { title: '运动户外', value: 9, },
        // { title: '其他/other', value: 10, },
      ],

      companyTypeList: [
        { title: '-', value: 0, },
        { title: '个体户', value: 1, },
        { title: '一般纳税人', value: 2, },
        { title: '小规模纳税人', value: 3, },
      ],

      invoiceList: [
        { title: '是', id: 1, },
        { title: '否', id: 2, },
      ],

      STATELIST: [
        { title: '全部', value: -1, },
        { title: '下架', value: 0, },
        { title: '上架', value: 1, },
        { title: '拒绝', value: 3, },
        { title: '审核中', value: 2, },
      ],

      type: null,

      headConfig: {},

      dialogConfig: {
        title: '',
        status: 0, // 1: 添加，2：编辑 3: 详情 4: 拒绝原因 5: 下架原因 6: 备注 7: 排序
      },

      tableConfig: {},
      list: [],
      total: 0,
      query: { page: 1, limit: 10, },
      submited: false,

      successTip: '操作成功',
      toExcel: null,
    }
  },

  watch: {
  },

  methods: {
    handleHeadEmit(index){},

    getList(){},
    format(v){},
    handleTableEmit(item, index){},

    getUploadToken(){},
    initDialog(item){},
    submit(){},
    
    search(param){
      let query = {},
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

      if(statusList){
        if(statusList.hasOwnProperty('0') && statusList[0] !== -1) query.storeclass_id = statusList[0] || 0;
        if(statusList.hasOwnProperty('1') && statusList[1] !== -1) query.store_state = statusList[1] || 0;
      }

      if(dateList){
        if(dateList[0]){
          query.starttime = this.formatTime(dateList[0][0]);
          query.endtime = this.formatTime(dateList[0][1]);
        }
      }

      // console.error(query);
      this.getList(this.query = query);
    },

    initPage(){
      let route = this.$route,
          name = route.name,
          methodsName = route.name[0].toUpperCase() + route.name.slice(1);

      this.type = name;

      this.headConfig = this[`${name}HeadConfig`];
      this.tableConfig = this[`${name}TableConfig`];

      this.handleHeadEmit = this[`handle${methodsName}HeadEmit`];

      this.getList = this[`get${methodsName}List`];
      this.format = this[`format${methodsName}`] || this.format;
      this.handleTableEmit = this[`handle${methodsName}TableEmit`];

      this.getUploadToken = this[`get${methodsName}UploadToken`];
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

    formatImg(v){ return v ? typeof v == 'string' ? [ { url: v } ] : v.map(v => ({ url: v })) : []; },
    formatTime(v){
      let t = new Date(v); 

      return `${t.getFullYear()}-${(t.getMonth() < 9 ? '0' : '') + (t.getMonth() + 1)}
              -${(t.getDate() < 10 ? '0' : '') + t.getDate()}
              T${(t.getHours() < 10 ? '0' : '') + t.getHours()}
              :${(t.getMinutes() < 10 ? '0' : '') + t.getMinutes()}
              :${(t.getSeconds() < 10 ? '0' : '') + t.getSeconds()}`.replace(/\s/g, '');
    },

  },

  created(){
    this.initPage();

    this.getList();

    this.toExcel = toExcel;
  },
}
</script>