<style lang="css">
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)'></custom-head> 
</el-header>

<custom-table :config='tableConfig' :data='tableConfig.list' :total='tableConfig.total' :isLoading='tableConfig.loading' @update='updateForm' @delete='deleteItem' @change='change'></custom-table>

<el-dialog append-to-body :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
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

</el-dialog>

</div>
</template>
<script>

import api from '@/api/classify' 
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import customImg from '@/components/customImg'

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类
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
        showDelete: true,
        classList: [
          { key: '名称', value: 'class_name' },
          // { key: '图片', value: 'storegc_pic',isImg:true },
        ],
        loading: false,
        list: [],
        total: 0,
        detail: null,
        query: {
          parent_id: 0,
          page: 1,
          limit: 10,
        }
      },

    }
  },
  methods: {
    updateForm(status){
      let tableConfig = this.tableConfig,
          isAdd = typeof status === 'number';

      this.dialogConfig.status = isAdd ? status : 2;

      tableConfig.detail = isAdd ? null : status;
      this.name.value = status.class_name || ''; 
      // this.img.value = status.img || [];
    },

    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },

    async submit() {
      let paramArr = ['name'],
          status = this.dialogConfig.status,
          imgList = this.img.value,
          param;

      // if(!imgList.length) return this.img.alert = '请选择图片作为主图';

      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;
      
      this.stopSubmit = true;
      // let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      // if(!img[0]) return console.error('img value :', img);

      param = {
        class_name: this.name.value,
        // storegc_pic: img[0],
      };

      this.save(param);
    },

    async save(param) {
      let dialogConfig = this.dialogConfig,
          detail = this.tableConfig.detail,
          res = null;

      res = dialogConfig.status === 1 ? await api.addShareClass(param) : await api.setShareClass(detail.class_id, param);

      if(res.status ==0) this.$message.success('操作成功');
      if(res.error) return this.$message.error(`addClass: ${res.error}`);

      dialogConfig.status = 0;
      this.getList(); 

      this.stopSubmit = false;
      this.$emit('update');
    },

    async getList() {
      let tableConfig = this.tableConfig;

      tableConfig.loading = true;

      let res = await api.getShareClassList(tableConfig.query);

      if(!res || typeof res === 'string' || res.error) {
        this.$message.error(res ? res.error || res : '获取分类列表失败!');
        return tableConfig.loading = false;
      }

      res.data.forEach(v => {
        // v.img = [ { url: v.storegc_pic } ];
      });

      tableConfig.list = res.data || [];
      tableConfig.total = res.pagination ? res.pagination.total : 0;
      tableConfig.loading = false;
    },

    async deleteItem(item) {
      let res = await api.deleteShareClass(item.class_id);

      this.$message.success(res.status == 0 ? '操作成功' : res.error);

      this.getList();
    },
    
    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
      // incorrect region, please use up-z2.qiniup.com  upload domain error
    },
    //分页=========================================
    change(param){
      let query = this.tableConfig.query;

      query.limit = param.limit;
      query.page = param.page;

      this.getList();
    },
  },

  created(){
    this.getUploadToken();
    this.getList();
  },
}
</script>