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

  .close{
    position: relative;
    left: calc(100% - 30px);
  }
  .dialog-footer{
    display:block;
    margin-left 10%;
  }
</style>

<template>
<div class="notice">
<!-- <el-container class="notice"> -->

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @update='updateForm'
                @look='look'
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

      <!-- <custom-img :obj='img'></custom-img> -->
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>

  <!-- <div v-if="dialogConfig.status === 3">
    <el-header class="header">
      <custom-head :config='twoHeadConfig' @add='updateFormTwo(4)'></custom-head> 
    </el-header>
    <custom-table :config='tableConfig' 
                :data='twoList' 
                :total='twoTotal' 
                :isLoading='twoIsLoading' 
                @update='updateFormTwo'
                @delete='deleteItemTwo'
                @change='changeTwo'></custom-table>

  </div> -->

</el-dialog>

<!-- </el-container> -->
</div>
</template>
<script>

import api from '@/api/classify' 
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import customImg from '@/components/customImg'
// import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    twoShowDialog(){ return Boolean(this.twoDialogConfig.status); },
  },

  data() {
    return {
      storegc_id: null,
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      name: { title: '名称', value: '', alert: null, },
      img: { title: '主图', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      stopSubmit: false,

      headConfig: {
        title: '添加分类' 
      },

      tableConfig: {
        showOperate: true,
        updateTitle: '编辑',
        // showDetail: true,
        showDelete: true,
        classList: [
          { key: '名称', value: 'name' },
          // { key: '图片', value: 'storegc_pic',isImg:true },
        ],
      },
      list: [],
      total: 0,
      query: {
        parent_id: 0,
        page: 1,
        limit: 10,
      },
      isLoading: true,
      // two classify
      // twoDialogConfig: {
      //   title: '',
      //   status: 0, // 4:添加分类，5：编辑分类， 6：三级分类列表
      // },

      // twoHeadConfig: {
      //   title: '添加分类' 
      // },
      // twoList: [],
      // twoTotal: 0,
      // twoQuery: {
      //   parent_id: 0,
      //   page: 1,
      //   limit: 10,
      // },
      // twoIsLoading: true,
    }
  },
  methods: {
    updateForm(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;

      // 
      this.storegc_id = status.classify_id;

      this.name.value = status.name || ''; 
      this.img.value = status.img || [];
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },

    look(item){
      let config = this.dialogConfig;

      config.status = 3;
      this.twoQuery.parent_id = item.storegc_id;

      this.getTwoList();
    },

    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;

      this.twoQuery.page = 1;
      this.twoQuery.limit = 10;
    },
    

    async submit(){
      let paramArr = ['name',],
          status = this.twoDialogConfig.status || this.dialogConfig.status,
          imgList = this.img.value,
          param;
      // if(!imgList.length) return this.img.alert = '请选择图片作为主图';

      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;
      
      this.stopSubmit = true;
      let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      // if(!img[0]) return console.error('img value :', img);

      param = {
        classify_name: this.name.value,
        // storegc_pic: img[0],
      };

      if(status == 4 || status == 5){
        param.storegc_parent_id = this.twoQuery.parent_id;
      }

      this.save(param);
    },
    // 
    async save(param){
      let status = this.twoDialogConfig.status || this.dialogConfig.status;
      let res = null;

      if(status ==2||status ==5 ||status ==8){
        res = await api.editNewsClass(this.storegc_id, param);
      }else{
        res = await api.addNewsClass(param);
      }

      if(res.status ==0) this.$message.success('操作成功');
      if(res.error) return this.$message.error(`addClass: ${res.error}`);

      if(status == 4 || status == 5){
        this.twoDialogConfig.status = 0;
        this.getTwoList();
      }else{
        this.dialogConfig.status = 0;
        this.getList(); 
      }

      this.stopSubmit = false;
    },
    //get =========================================
    async getList() { //获取列表
      this.isLoading = true

      console.error('getclassList param: ', this.query)
      let res = await api.getNewsClassList(this.query, this);

      if(res.error) return this.isLoading = false;

      res.data.forEach(v => {
        v.name = v.classify_name;
        v.img = [ { url: v.storegc_pic } ];
      });
      this.list = res.data || [];
      this.total = res.pagination ? res.pagination.total : 0;
      this.isLoading = false
    },

    async deleteItem(item){
      let res = await api.deleteNewsClass(item.classify_id, null, this);
      if(res.status ==0) this.$message.success('操作成功');
      if(res.status !=0) this.$message.success(res.error);
      this.getList();
    },

    // Two
    async getTwoList() { //获取列表
      this.twoIsLoading = true

      console.error('getclassList param: ', this.twoQuery)
      let res = await api.getClassList(this.twoQuery, this);

      if(res.error) return this.twoIsLoading = false;

      res.data.forEach(v => {
        v.name = v.storegc_name;
        v.img = [ { url: v.storegc_pic } ];
      });

      this.twoList = res.data || [];
      this.twoTotal = res.pagination ? res.pagination.total : 0;
      this.twoIsLoading = false
    },

    updateFormTwo(status){
      this.twoDialogConfig.status = typeof status === 'number' ? status : 5;
      this.storegc_id = status.storegc_id;
      this.name.value = status.name || ''; 
      this.img.value = status.img || [];
      console.error('updateform two', this.twoDialogConfig.status, this.name.value, this.img.value);
    },
    
    async deleteItemTwo(item){
      let res = await api.deleteClassList(item.storegc_id, null, this);
      if(res.status ==0) this.$message.success('操作成功');
      if(res.status !=0) this.$message.success(res.error);
      this.getTwoList();
    },

    // common
    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
      // incorrect region, please use up-z2.qiniup.com  upload domain error
    },

    //分页=========================================
    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    changeTwo(param){
      this.twoQuery.limit = param.limit;
      this.twoQuery.page = param.page;
      this.getTwoList();
    },
  },

  created(){
    this.getUploadToken();
    this.getList();
  },
}
</script>