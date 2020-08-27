<style lang="css">
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)'></custom-head> 
</el-header>

<custom-table :config='tableConfig' :data='list' :total='total' :isLoading='isLoading' @update='updateForm' @look='look' @delete='deleteItem' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

      <custom-input :obj='desc'></custom-input>

      <custom-input :obj='sort'></custom-input>

      <custom-img :obj='img'></custom-img>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>

  <div v-if="dialogConfig.status === 3">
    <el-header class="header">
      <custom-head :config='twoHeadConfig' @add='updateFormTwo(4)'></custom-head> 
    </el-header>

    <custom-table :config='tableConfig' :data='twoList' :total='twoTotal' :isLoading='twoIsLoading' @update='updateFormTwo' @look='lookTwo' @delete='deleteItemTwo' @change='changeTwo'></custom-table>
  </div>

</el-dialog>

<!-- two class -->
<el-dialog :title="twoDialogConfig.title" :visible.sync="twoShowDialog" :before-close='closeDialogTwo' width="80%">
  <div v-if="[4, 5].indexOf(twoDialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

      <custom-input :obj='desc'></custom-input>

      <custom-input :obj='sort'></custom-input>

      <custom-img :obj='img'></custom-img>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialogTwo" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>

  <div v-if="twoDialogConfig.status === 6">
    <el-header class="header">
      <custom-head :config='thirdHeadConfig' @add='updateFormThird(7)'></custom-head> 
    </el-header>
    <custom-table :config='tableConfig' 
                :data='thirdList' 
                :total='thirdTotal' 
                :isLoading='thirdIsLoading' 
                @update='updateFormThird'
                @delete='deleteItemThird'
                @change='changeThird'></custom-table>

  </div>

</el-dialog>

<el-dialog :title="thirdDialogConfig.title" :visible.sync="thirdShowDialog" :before-close='closeDialogThird' width="80%">
  <div v-if="[7, 8].indexOf(thirdDialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

      <custom-img :obj='img'></custom-img>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialogThird" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>
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
import uploadFn from "@/utils/tencent_cos";
import vd from '@/utils/validate'

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
    thirdShowDialog(){ return Boolean(this.thirdDialogConfig.status); },

    isAdd(){ return this.dialogConfig.status == 1; },
    isEdit(){ return this.dialogConfig.status == 2; },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      name: { title: '分类名称', value: '', alert: null, err: '分类名称不能为空!', },
      desc: { title: '简介', value: '', alert: null, err: '简介不能为空!', },
      sort: { title: '排序', value: '', alert: null, err: '排序不能为空!', },
      img: { title: '上传图片', value: [], limit: 1, alert: null, err: '图片不能为空', },
      stopSubmit: false,

      headConfig: {
        title: '添加分类' 
      },

      tableConfig: {
        showOperate: true,
        updateTitle: '编辑',
        lookTitle: '查看下级',
        // showDetail: true,
        showDelete: true,
        classList: [
          { key: '分类名称', value: 'classify_name' },
          { key: '简介', value: 'classify_brief' },
          { key: '图片', value: 'classify_image', isImg:true },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        parent_id: 0,
      },
      detail: null,
      isLoading: true,
      // two classify
      twoDialogConfig: {
        title: '',
        status: 0, // 4:添加分类，5：编辑分类， 6：三级分类列表
      },

      twoHeadConfig: {
        title: '添加分类' 
      },
      twoList: [],
      twoTotal: 0,
      twoQuery: {
        parent_id: 0,
        page: 1,
        limit: 10,
      },
      twoIsLoading: true,
      // third classify
      thirdDialogConfig: {
        title: '',
        status: 0, // 7:添加分类，8：编辑分类， 9：四级分类列表
      },

      thirdHeadConfig: {
        title: '添加分类' 
      },
      thirdList: [],
      thirdTotal: 0,
      thirdQuery: {
        parent_id: 0,
        page: 1,
        limit: 10,
      },
      thirdIsLoading: true,

    }
  },
  methods: {
    updateForm(item){
      this.dialogConfig.status = typeof item === 'number' ? item : 2;

      if(this.isEdit) this.detail = item;

      this.name.value = item.classify_name || ''; 
      this.desc.value = item.classify_brief || ''; 
      this.sort.value = item.classify_sort || ''; 
      this.img.value = item.classify_image ? [ { url: item.classify_image } ] : [];
    },

    look(item){
      let config = this.dialogConfig;

      config.status = 3;
      this.twoQuery.parent_id = item.classify_id;
      this.tableConfig.lookTitle = null;

      this.getTwoList();
    },
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;

      this.twoQuery.page = 1;
      this.twoQuery.limit = 10;
      this.tableConfig.lookTitle = '查看下级';
    },
    //=====================================
    updateFormTwo(item){
      this.twoDialogConfig.status = typeof item === 'number' ? item : 5;

      if(typeof item === 'object') this.detail = item;

      this.name.value = item.classify_name || ''; 
      this.desc.value = item.classify_brief || ''; 
      this.sort.value = item.classify_sort || ''; 
      this.img.value = item.classify_image ? [ { url: item.classify_image } ] : [];
    },

    lookTwo(item){
      let config = this.twoDialogConfig,
          tableConfig = this.tableConfig;

      config.status = 6;
      this.thirdQuery.parent_id = item.storegc_id;
      tableConfig.lookTitle = null;

      this.getThirdList();
    },

    closeDialogTwo(){
      let config = this.twoDialogConfig,
          tableConfig = this.tableConfig;

      config.status = 0;

      this.thirdQuery.page = 1;
      this.thirdQuery.limit = 10;

      tableConfig.lookTitle = '查看下级';
    },
    //======================================
    updateFormThird(status){
      this.thirdDialogConfig.status = typeof status === 'number' ? status : 8;
      this.storegc_id = status.storegc_id;
      this.name.value = status.name || ''; 
      this.img.value = status.img || [];
    },
    closeDialogThird(){
      let config = this.thirdDialogConfig;

      config.status = 0;
    },

    async submit(){
      let paramArr = ['name',],
          status = this.thirdDialogConfig.status || this.twoDialogConfig.status || this.dialogConfig.status,
          imgList = this.img.value,
          param;

      this.img.value = [{ url: 'https://blkx-1302950457.file.myqcloud.com/1600478960740%E5%88%87%E5%9B%BE%402x(38).png'}];

      if(vd.isEmpty(this.name.value)) return this.$message.error(this.name.err);

      if(vd.isEmpty(this.desc.value)) return this.$message.error(this.desc.err);

      if(!vd.isPositiveInteger(this.sort.value)) return this.$message.error(this.sort.err);

      this.img.alert = this.img.value.length ? null : this.img.err;
      if(this.img.alert) return ;
      
      let loading = this.$loading();
      this.stopSubmit = true;

      imgList = await uploadFn(this.img.value.filter(v => v.raw).map(v => v.raw));
      imgList = imgList.concat(this.img.value.filter(v => !v.raw).map(v => v.url));

      param = {
        classify_name: this.name.value,
        classify_brief: this.desc.value,
        classify_sort: this.sort.value,
        classify_image: imgList[0],
      };

      param.parent_id = this.isAdd || this.isEdit ? 0 : this.twoQuery.parent_id;

      this.save(param, loading);
    },
    //
    async save(param, loading){
      let status = this.thirdDialogConfig.status || this.twoDialogConfig.status || this.dialogConfig.status;
      let res = null;

      if(status ==2||status ==5 ||status ==8){
        res = await api.editClassList(this.detail.classify_id, param);
      }else{
        res = await api.addClass(param);
      }

      loading.close();
      this.stopSubmit = false;

      if(res && res.status == 0){
        this.$message.success('操作成功')

        if(status == 7 || status == 8){
          this.thirdDialogConfig.status = 0;
          this.getThirdList();
        }else if(status == 4 || status == 5){
          this.twoDialogConfig.status = 0;
          this.getTwoList();
        }else{
          this.dialogConfig.status = 0;
          this.getList(); 
        }
        return ;
      }

      return this.$message.error(`addClass: ${res.error}`);
    },
    //get =========================================
    async getList() { //获取列表
      this.isLoading = true

      let res = await api.getClassList(this.query);

      if(!res || res.error) return this.isLoading = false, this.$message.error('获取产品类目信息失败!');

      res.data.forEach(v => {});
      this.list = res.data || [];
      this.total = res.pagination ? res.pagination.total : 0;
      this.isLoading = false
    },

    async getTwoList() { //获取列表
      this.twoIsLoading = true

      let res = await api.getClassList(this.twoQuery, this);

      if(!res || res.error) return this.twoIsLoading = false, this.$message.error('获取二级产品类目信息失败!');

      res.data.forEach(v => {});

      this.twoList = res.data || [];
      this.twoTotal = res.pagination ? res.pagination.total : 0;
      this.twoIsLoading = false
    },

    async getThirdList() { //获取列表
      this.thirdIsLoading = true

      console.error('getclassList param: ', this.thirdQuery)
      let res = await api.getClassList(this.thirdQuery, this);

      if(res.error) return this.thirdIsLoading = false;

      res.data.forEach(v => {
        v.name = v.storegc_name;
        v.img = [ { url: v.storegc_pic } ];
      });

      this.thirdList = res.data || [];
      this.thirdTotal = res.pagination ? res.pagination.total : 0;
      this.thirdIsLoading = false;
    },
    //delete=======================================
    async deleteItem(item){
      let res = await api.deleteClassList(item.classify_id);

      res.status == 0 ? this.$message.success('操作成功') : this.$message.error(res.error);

      this.getList();
    },
    async deleteItemTwo(item){
      let res = await api.deleteClassList(item.classify_id);

      res.status == 0 ? this.$message.success('操作成功') : this.$message.error(res.error);

      this.getTwoList();
    },
    async deleteItemThird(item){
      let res = await api.deleteClassList(item.storegc_id, null, this);
      if(res.status ==0) this.$message.success('操作成功');
      if(res.status !=0) this.$message.success(res.error);
      this.getThirdList();
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
    changeThird(param){
      this.thirdQuery.limit = param.limit;
      this.thirdQuery.page = param.page;
      this.getThirdList();
    },
  },

  created(){
    this.getList();
  },
}
</script>