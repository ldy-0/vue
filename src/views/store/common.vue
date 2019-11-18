<style lang="css" scoped>
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @search='search' @emit='handleHeadEmit'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' :data='list' :total='total' @modify='handleTableEmit' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <!-- <el-form label-width='100px'>

      <el-form-item :label="checkDesc.title">
        <editor style='width: 800px;' v-model='checkDesc.value'></editor>
        <el-alert type='error' :title='checkDesc.alert' v-if='checkDesc.alert'></el-alert>
      </el-form-item>     
    </el-form> -->
    <store :obj='store'></store> 

    <span slot="footer" class="dialog-footer">
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
import { export_json_to_excel as toExcel } from "@/vendor/Export2Excel";
import store from '@/components/form/store'

export default {
  components: {
    customHead,
    customTable,
    editor,
    store,
  },

  mixins: [check],

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      type: null,

      headConfig: {},

      dialogConfig: {
        title: '',
        status: 0, // 1: 添加，2：编辑
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

      // keyword search
      if(param.search) query.search = param.search;

      if(inputList){
        if(inputList[0]) query.search = inputList[0]; 
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
  },
}
</script>