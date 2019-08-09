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
                @modify='dispatch'
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

      <custom-img :obj='img'></custom-img>
      
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>

  <div v-if="dialogConfig.status === 3">
    <el-header class="header">
      <custom-head :config='twoHeadConfig' @add='updateFormTwo(4)' @search='searchTwo'></custom-head> 
    </el-header>
    <custom-table ref='goodsTable' :config='twoTableConfig' 
                :data='twoList' 
                :total='twoTotal' 
                :isLoading='twoIsLoading' 
                @update='updateFormTwo'
                @modify='dispatchTwo'
                @change='changeTwo'></custom-table>

  </div>

</el-dialog>

<!-- two class -->
<!-- <el-dialog :title="twoDialogConfig.title" :visible.sync="twoShowDialog" :before-close='closeDialogTwo' width="80%">
  <div v-if="[4, 5].indexOf(twoDialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

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

</el-dialog> -->

<!-- </el-container> -->


</div>
</template>
<script>

import api from '@/api/classify' 
import commonReq from '@/api/common' 
import goodsApi from "@/api/goods";
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import customImg from '@/components/customImg'
// import uploadFn from "@/utils/tencent_cos";

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
  },

  data() {
    return {
      storegc_id:null,
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
        // lookTitle: '查看下级',
        // showDetail: true,
        showDelete: true,
        btnList: [
          { key: 'customcatalog_id', value: '选择' },
          { key: 'customcatalog_id', value: '商品' },
        ],
        classList: [
          { key: '名称', value: 'name' },
          { key: '图片', value: 'customcatalog_image',isImg:true },
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
      detail: null,
      operateIndex: null,
      // two classify
      twoDialogConfig: {
        title: '',
        status: 0, // 4:添加分类，5：编辑分类， 6：三级分类列表
      },

      twoHeadConfig: {
        // title: '添加分类' 
        placeHolder: '请输入商品名称',
      },
      twoTableConfig: {
        loading: false,
        showOperate: true,
        btnList: [],
        classList: [
          { key: '商品名', value: 'goods_name' },
          { key: "商品图片", value: "goods_image", isImg: true },
          { key: "售价", value: "goods_price" },
          { key: "状态", value: "stateStr" },
        ],
      },
      twoList: [],
      twoTotal: 0,
      twoQuery: {
        page: 1,
        limit: 10,
      },
      twoIsLoading: true,
      stateArr: ['下架', '上架'],

    }
  },
  methods: {
    updateForm(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      this.storegc_id = status.customcatalog_id;
      this.name.value = status.name || ''; 
      this.img.value = status.img || [];
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },

    dispatch(item, index){
      let config = this.dialogConfig;

      config.status = 3;

      this.detail = item;
      this.operateIndex = index;

      // 选择商品
      if(index == 0){
        this.twoTableConfig.btnList = [ { key: 'goods_commonid', value: '添加', } ];
        return this.getGoodList();
      }

      // 分类中商品列表
      if(index == 1){
        this.twoTableConfig.btnList = [ { type: 'danger', key: 'goods_commonid', value: '删除', } ];
        return this.getClassGoodsList();
      }

      // this.twoQuery.parent_id = item.storegc_id;
      // this.getTwoList();
    },

    dispatchTwo(item, index){
      // 添加商品至分类
      if(this.operateIndex == 0) this.addGoods(item);

      if(this.operateIndex == 1) this.deleteGoods(item);
    },

    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;

      this.twoQuery.page = 1;
      this.twoQuery.limit = 10;
    },
    //=====================================
    searchTwo(o){
      this.twoQuery.page = 1;
      this.$refs.goodsTable.initPage();

      o.search ? this.twoQuery.search = o.search : delete this.twoQuery.search;

      this.getGoodList();
    },

    updateFormTwo(status){
      this.twoDialogConfig.status = typeof status === 'number' ? status : 5;
      this.storegc_id = status.storegc_id;
      this.name.value = status.name || ''; 
      this.img.value = status.img || [];
      console.error('updateform two', this.twoDialogConfig.status, this.name.value, this.img.value);
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

    async submit(){
      let paramArr = ['name',],
          status = this.twoDialogConfig.status || this.dialogConfig.status,
          imgList = this.img.value,
          param;
      if(!imgList.length) return this.img.alert = '请选择图片作为主图';

      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;
      
      this.stopSubmit = true;
      let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        customcatalog_name: this.name.value,
        customcatalog_image: img[0],
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
        param.customcatalog_id = this.storegc_id;
        res = await api.editCustomClass(param);
      }else{
        res = await api.addCustomClass(param);
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
    format(v){
      v.name = v.customcatalog_name;
      v.img = [ { url: v.customcatalog_image } ];
    },

    async getList() { //获取列表
      this.isLoading = true

      console.error('getclassList param: ', this.query)
      let res = await api.getCustomClassList(this.query, this);

      if(res.error) return this.isLoading = false;

      res.data.forEach(this.format);
      this.list = res.data || [];
      this.total = res.pagination ? res.pagination.total : 0;
      this.isLoading = false
    },

    // 某一分类的商品列表
    async getClassGoodsList() {
      this.twoTableConfig.loading = true;

      let res = await api.getClassGoodsList(this.detail.customcatalog_id, this.twoQuery);

      if (typeof res == 'string' || res.error) return this.$message.error(res.error);

      res.data.forEach(this.classGoodsFormat);

      this.twoList = res.data;
      this.twoTotal = res.pagination.total;
      this.twoTableConfig.loading = false;
    },

    classGoodsFormat(v){
      let goods = v.goodscommon;

      for(let key in goods) v[key] = goods[key];

      v.stateStr = this.stateArr[v.goods_state];
    },

    async getTwoList() { //获取列表
      this.twoIsLoading = true

      console.error('getclassList param: ', this.twoQuery)
      let res = await api.getClassList(this.twoQuery, this);

      if(res.error) return this.twoIsLoading = false;

      res.data.forEach(this.format);

      this.twoList = res.data || [];
      this.twoTotal = res.pagination ? res.pagination.total : 0;
      this.twoIsLoading = false
    },

    //delete=======================================
    async deleteItem(item){
      let res = await api.deleteCustomClass(item.customcatalog_id, null, this);

      if(res.status ==0) this.$message.success('操作成功');
      if(res.status !=0) this.$message.success(res.error);

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
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },

    changeTwo(param){
      this.twoQuery.limit = param.limit;
      this.twoQuery.page = param.page;

      if(this.operateIndex == 0) return this.getGoodList();
      if(this.operateIndex == 1) return this.getClassGoodsList();
    },

    // Goods
    async addGoods(item){
      let param = {
        customcatalog_id: this.detail.customcatalog_id,
        goods_commonid: item.goods_commonid,
      };

      let res = await api.addGoods(param);

      res && res.data ? this.$message.success(`添加成功`) : this.$message.error(res.error || res);

    },

    async deleteGoods(item){
      let res = await api.deleteGoods(item.cataloggoods_id, null, this);

      if(res.status ==0) this.$message.success('操作成功');
      if(res.status !=0) this.$message.success(res.error);

      this.getClassGoodsList();
    },

    async getGoodList() {
      this.twoTableConfig.loading = true;
      this.twoQuery.type = 'sort'
      let res = await goodsApi.getGoodsList(this.twoQuery, this);

      if (res.error) return this.$message.error(res.error);

      // get all class list
      // let allClass = await classAPI.getClassList();
      // if (allClass.error) this.$message.error(allClass.error);
      // this.allClass = allClass.data;

      res.data.forEach(this.goodsFormat);

      this.twoList = res.data;
      this.twoTotal = res.pagination.total;
      this.twoTableConfig.loading = false;
    },

    goodsFormat(v){
      v.stateStr = this.stateArr[v.goods_state];
    },
    
  },

  created(){
    this.getUploadToken();
    this.getList();
  },
}
</script>