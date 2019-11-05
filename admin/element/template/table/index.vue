<style lang="css" scoped>
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @search='search' @emit='handleHeadEmit'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' :data='list' :total='total' @modify='handleTableEmit' @change='change'></custom-table>

<!-- <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-img :obj='img'></custom-img>

      <custom-input :obj='name'></custom-input>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>
</el-dialog> -->

</div>
</template>
<script>
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/custom/customHead';
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import deal from './deal';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
  },

  mixins: [deal],

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      type: null,

      dialogConfig: {
        title: '',
        status: 0, // 1: 添加，2：编辑
      },

      dialogList: [
        { name: 'name', value: 'name', },
      ],
      // validArr: ['name'],

      // img: { title: '主图', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      // name: { type: 'string', title: '', value: '', alert: null, },
      // status: { title: '是否启用', list: [ { title: '是', value: 1, }, { title: '否', value: 2 } ], value: 1, alert: null, },

      // stopSubmit: false,

      headConfig: {},
      tableConfig: {},
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },

      successTip: '操作成功',
    }
  },

  watch: {
  },

  methods: {
    handleHeadEmit(index){},
    handleTableEmit(item, index){},

    // initDialog(item){
    //   let itemArr = this.dialogList;

    //   if(typeof item == 'object') this.detail = item;

    //   itemArr.forEach(v => {
    //     this[v.name].value = item[v.value] != null ? item[v.value] : '';
    //     this[v.name].alert = null;
    //   });

    //   // this.img.value = item.image ? [ { url: item.image } ] : [];
    //   // this.img.alert = null;
    // },

    // validError(){
    //   let validArr = this.validArr;
      
    //   for(let i = 0, len = validArr.length; i < len; i++){
    //     let key = validArr[i];

    //     if(!this[key].value){ this[key].alert = `${this[key].title}不能为空!`; }

    //     if(this[key].alert) return true;
    //   }

    //   // if(!this.img.value.length) return this.img.alert = '请选择图片作为主图';
    // },

    // async submit(){
    //   let status = this.dialogConfig.status,
    //       imgList = this.img.value,
    //       param;

    //   if(this.validError()) return ;
      
    //   this.stopSubmit = true;

    //   // let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
    //   // if(!img[0]) return console.error('img value :', img);

    //   param = {
    //     name: this.name.value,
    //   };

    //   console.error(param);
    //   // this.save(param);
    // },

    // 
    // async save(param){
    //   let status = this.dialogConfig.status;
    //   let res = null;

    //   res = status == 1 ? await api.addTransport(param) : await api.setTransport(this.detail.transport_id, param);

    //   if(typeof res == 'string' || !res || res.error){
    //     this.stopSubmit = false;
    //     return this.$message.error(`${res ? res.error || res : '保存信息失败'}`);
    //   }

    //   if(res.status == 0) this.$message.success('操作成功');

    //   this.dialogConfig.status = 0;
    //   this.getList(); 

    //   this.stopSubmit = false;
    // },

    format(v){},
    async getList() {},
    
    // async getUploadToken(){
    //   let res = await commonReq.getUploadToken();

    //   if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

    //   this.img.body.token = res.data;
    //   this.img.body.config = "{ useCdnDomain: true }";
    // },

    search(param){
      let query = {},
          inputList = param.inputList,
          statusList = param.statusList,
          dateList = param.dateList;

      query.page = 1;
      query.limit = this.query.limit;
      this.$refs.table.initPage();

      // keyword search
      if(param.search) query.search = param.search;

      if(inputList){
        if(inputList[0]) query.search = inputList[0]; 
        if(inputList[1]) query.num = inputList[1]; 
      }

      if(statusList){
        if(statusList[0] >= 0) query.status = statusList[0];
        if(statusList[1] >= 0) query.method = statusList[1];
      }

      if(dateList){
        if(dateList[0]) query.date = dateList[0];
      }
      
      this.query = query;
      return console.error(this.query);
      this.getList();
    },

    // immutable
    // openDialog(status){
    //   this.dialogConfig.status = typeof status === 'number' ? status : 2;
      
    //   this.initDialog(status);
    // },
    
    // closeDialog(){ this.dialogConfig.status = 0; },

    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;

      this.getList();
    },

    initPage(){
      let route = this.$route,
          name = route.name,
          methodsName = route.name[0].toUpperCase() + route.name.slice(1);

      this.type = name;

      this.headConfig = this[`${name}HeadConfig`];
      this.tableConfig = this[`${name}TableConfig`];

      this.getList = this[`get${methodsName}List`];
      this.handleHeadEmit = this[`handle${methodsName}HeadEmit`];
      this.handleTableEmit = this[`handle${methodsName}TableEmit`];
    },

  },

  created(){
    this.initPage();

    this.getList();
  },
}
</script>