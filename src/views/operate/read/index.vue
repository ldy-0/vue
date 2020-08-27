<style lang="css">
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @add='openDialog(1)' @search='search'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' 
                :data='list' 
                :total='total' 
                @update='openDialog'
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-img :obj='img'></custom-img>

      <custom-input :obj='name'></custom-input>
      <custom-input :obj='desc'></custom-input>

      <el-form-item :label="content.title">
        <editor style='width: 800px;' v-model='content.value'></editor>
        <el-alert type='error' :title='content.alert' v-if='content.alert'></el-alert>
      </el-form-item>

      <custom-select :obj='goods'></custom-select>
      
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
    <custom-table :config='tableConfig' 
                :data='twoList' 
                :total='twoTotal' 
                :isLoading='twoIsLoading' 
                @update='updateFormTwo'
                @delete='deleteItemTwo'
                @change='changeTwo'></custom-table>

  </div>

</el-dialog>


</div>
</template>
<script>

import api from '@/api/goods' 
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
// import uploadFn from "@/utils/tencent_cos";

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
    customSelect,
    editor,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    twoShowDialog(){ return Boolean(this.twoDialogConfig.status); },
  },

  data() {
    return {
      storegc_id:null,
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      name: { type: 'string', title: '标题', value: '', alert: null, },
      desc: { type: 'string', title: '介绍', value: '', alert: null, },
      content: { title: '内容', value: '', alert: null, },
      goods: { title: '关联商品', categories: [], value: '', alert: null, },
      img: { title: '主图', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      stopSubmit: false,

      headConfig: {
        title: '添加解读',
        placeHolder: '名称搜索',
      },

      tableConfig: {
        showOperate: true,
        updateTitle: '编辑',
        showDelete: true,
        classList: [
          { key: '标题', value: 'title' },
          { key: '图片', value: 'image', isImg:true },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },

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

    }
  },

  watch: {
    content: {
      deep: true,
      handler(v1, v2){ this.content.alert = this.content.value ? null : `${this.content.title}不能为空!`; }
    },
  },

  methods: {
    openDialog(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      
      this.initGoodsForm(status);
    },
    
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },

    search(param){
      this.query.page = 1;
      this.$refs.table.initPage();

      param.search ? this.query.search = param.search : delete this.query.search;
      
      this.getList();
    },

    

    initGoodsForm(item){
      let inputArr = [ ['name', 'title'], ['desc', 'desc'], ['content', 'explain'] ];

      if(typeof item == 'object') this.detail = item;

      inputArr.forEach(v => {
        this[v[0]].value = item[v[1]] || '';
        this[v[0]].alert = null;
      });

      this.img.value = item.image ? [ { url: item.image } ] : [];
      this.img.alert = null;

      this.goods.value = item.goods_commonid || '';
      this.goods.alert = null;

    },

    validate(){
      let validArr = ['name', 'desc', 'content', 'goods'];
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(this[key].alert) return true;

        if(!this[key].value){
          return this[key].alert = `${this[key].title}不能为空!`;
        }
      }

      if(!this.img.value.length) return this.img.alert = '请选择图片作为主图';
    },

    async submit(){
      let status = this.twoDialogConfig.status || this.dialogConfig.status,
          imgList = this.img.value,
          param;

      if(this.validate()) return ;
      
      this.stopSubmit = true;

      let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        title: this.name.value,
        desc: this.desc.value,
        explain: this.content.value,
        goods_commonid: this.goods.value,
        image: img[0],
      };

      this.save(param);
    },

    // 
    async save(param){
      let status = this.twoDialogConfig.status || this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addRead(param) : await api.setRead(this.detail.goodsexplain_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '保存解读信息失败'}`);
      }

      if(res.status ==0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      this.stopSubmit = false;
    },

    async getList() { 
      this.tableConfig.loading = true

      let res = await api.getVipReadList(this.query, this);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取VIP解读列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },

    format(v){ },

    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;

      this.getList();
    },

    async deleteItem(item){
      let res = await api.deleteRead(item.goodsexplain_id, null, this);

      res.status == 0 ? this.$message.success('操作成功') : this.$message.error(res.error);

      this.getList();
    },

    // 
    async getGoodsList() {
      let res = await api.getGoodsList({ is_vip: 1, }, this);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取VIP商品列表失败');

      if(res && res.data){
        res.data.forEach(this.goodsFormat);

        this.goods.categories = res.data.reverse() || [];
      }
    },

    goodsFormat(v){
      v.id = v.goods_commonid;
      v.title = v.goods_name;
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
      // incorrect region, please use up-z2.qiniup.com  upload domain error
    },

    //
    updateFormTwo(status){
      // this.twoDialogConfig.status = typeof status === 'number' ? status : 5;
      // this.storegc_id = status.storegc_id;
      // this.name.value = status.name || ''; 
      // this.img.value = status.img || [];
    },   
    
    async deleteItemTwo(item){
      // let res = await api.deleteClassList(item.storegc_id, null, this);
      // if(res.status ==0) this.$message.success('操作成功');
      // if(res.status !=0) this.$message.success(res.error);
      // this.getTwoList();
    },
    
    changeTwo(param){
      // this.twoQuery.limit = param.limit;
      // this.twoQuery.page = param.page;
      // this.getTwoList();
    },
  },

  created(){
    this.getUploadToken();

    this.getGoodsList();

    this.getList();
  },
}
</script>