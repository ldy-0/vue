<style lang="css" scoped>
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @search='search' @emit='handleHeadEmit'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' :data='list' :total='total' @modify='handleTableEmit' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div>
    <el-form label-width='100px' v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
      <custom-img :obj='shareImg'></custom-img>

      <custom-input :obj='shareTitle'></custom-input>

      <el-form-item :label="shareDesc.title">
        <editor style='width: 800px;' v-model='shareDesc.value'></editor>
        <el-alert type='error' :title='shareDesc.alert' v-if='shareDesc.alert'></el-alert>
      </el-form-item>     
    </el-form>

    <dScore-activity :obj='dScoreActivity' v-if='isDScoreActivity'></dScore-activity>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
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
import dScoreActivity from '@/components/form/dscoreActivity'
import share from './share';
import dScore from './dScore';
import { export_json_to_excel as toExcel } from "@/vendor/Export2Excel";

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
    editor,
    dScoreActivity,
  },

  mixins: [share, dScore],

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    isDScoreActivity(){ return [3, 4].indexOf(this.dialogConfig.status) !== -1; },
  },

  data() {
    return {
      type: null,

      dialogConfig: {
        title: '',
        status: 0, // 1: app分享添加，2：app分享编辑 3. 德分活动添加 4. 德分活动编辑
      },

      dialogList: [
        { name: 'name', value: 'name', },
      ],

      stopSubmit: false,

      headConfig: {},
      tableConfig: {},
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },

      successTip: '操作成功',
      toExcel: null,
    }
  },

  watch: {
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

    // getTimeStr(t){ return `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()}`; },

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