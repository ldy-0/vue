<style lang="css">
.header{
  margin: 20px 0;
}

.goods_image{
  width: 200px;
  height: 150px;
}

.dialog-footer{
  display: block;
  margin-left: 10%;
}
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @add='openDialog(1)' @search='search'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                @update='openDialog'
                @modify='dispatch'
                @delete='deleteItem'
                @change='updateList'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <!-- 编辑 -->
  <div v-if="[2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <el-form-item label='商品名称'>{{detail.goods_name}}</el-form-item>
      <el-form-item label='商品图片'>
        <img class='goods_image' :src='detail.goods_image' />
      </el-form-item>
      <el-form-item label='商品分类'>{{detail.gc_name_1}}/{{detail.gc_name_2}}/{{detail.gc_name_3}}</el-form-item>
      <el-form-item label='商品原价'>{{detail.goods_marketprice}}</el-form-item>
      <el-form-item label='商品售价'>{{detail.goods_price}}</el-form-item>
      <el-form-item label='活动文字'>{{detail.goods_advword}}</el-form-item>

      <custom-select :obj='sku' v-if='sku.categories.length > 1'></custom-select>

      <custom-input :obj='price'></custom-input>

      <date-time-range :obj='dateTime'></date-time-range>
      
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>

  <!-- 商品列表 -->
  <div v-if="dialogConfig.status === 1">
    <el-header class="header">
      <custom-head style="display:inline-block" :config='twoHeadConfig' @add='updateFormTwo(4)' @search='searchGoods'></custom-head> 
      <el-form :inline="true" style="display: inline-block;">
        <multiSelect :obj='twoHeadConfig.multiSelect' @load='loadClass' @search="searchByClass"></multiSelect>
      </el-form>
    </el-header>

    <custom-table ref='goodsTable' :config='twoTableConfig' 
                :data='goodsList' 
                :total='goodsTotal' 
                @update='updateFormTwo'
                @modify='dispatchTwo'
                @change='updateGoodsList'></custom-table>

  </div>

</el-dialog>

</div>
</template>
<script>

import api from '@/api/goods' 
import classApi from '@/api/classify' 
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import multiSelect from "@/components/multiSelect";
import customSelect from "@/components/select";
import dateTimeRange from "@/components/dateTimeRange";
// import uploadFn from "@/utils/tencent_cos";

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
    customSelect,
    multiSelect,
    dateTimeRange,
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
        status: 0, // 1:添加商品，2：编辑，
      },
      price: { type: 'positive', title: '活动价格', value: '', alert: null, },
      dateTime: { title: '活动时间', value: [], alert: null, strict: true, },
      sku: { title: '规格', value: '', categories: [], alert: null, },
      img: { title: '主图', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      stopSubmit: false,

      headConfig: {
        title: '添加商品', 
        placeHolder: '商品名称搜索',
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        updateTitle: '编辑',
        showDelete: true,
        btnList: [
          // { key: 'showUp', value: '上架' },
          // { key: 'goods_state', value: '下架' },
        ],
        classList: [
          { key: '图片', value: 'goods_image', isImg: true },
          { key: '名称', value: 'goods_name' },
          { key: '一级分类', value: 'gc_name_1' },
          { key: '二级分类', value: 'gc_name_2' },
          { key: '三级分类', value: 'gc_name_3' },
          { key: '原价', value: 'goods_marketprice' },
          { key: '售价', value: 'price' },
          { key: '活动价', value: 'goods_price' },
          { key: '库存', value: 'goods_storage' },
          { key: '状态', value: 'stateStr' },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },
      isLoading: true,
      detail: null,
      operateIndex: 0,
      classList: [],

      // two classify
      twoDialogConfig: {
        title: '',
        status: 0,
      },

      twoHeadConfig: {
        multiSelect: { title: "分类", source: [], value: [], alert: null, search: true },
        placeHolder: '请输入商品名称',
      },
      twoTableConfig: {
        loading: false,
        showOperate: true,
        btnList: [
          { key: 'goods_commonid', value: '选择', },
        ],
        classList: [
          { key: '商品ID', value: 'goods_commonid' },
          { key: "商品图片", value: "goods_image", isImg: true },
          { key: '商品名', value: 'goods_name' },
          { key: "售价", value: "goods_price" },
          { key: "状态", value: "stateStr" },
        ],
      },
      goodsList: [],
      goodsTotal: 0,
      goodsQuery: {
        page: 1,
        limit: 10,
        type: 'sort',
        is_vip: 1,
        goods_state: 1,
      },
      stateArr: ['下架', '上架'],

    }
  },
  methods: {
    openDialog(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;

      // 商品列表
      if(status == 1) this.initGoodsList();

      // 添加|编辑
      if(typeof status == 'object') this.initGoodsForm(status);
    },

    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },

    dispatch(item, index){
      let config = this.dialogConfig;

      this.detail = item;
      this.operateIndex = index;

      // 上架
      if(index < 2) return this.changeState(index);

      config.status = 3;
    },

    changeState(index){
      console.error(index);
    },

    dispatchTwo(item, index){
      // 添加商品至特惠
      if(this.operateIndex == 0 && index == 0) this.addGoods(item);
    },
    
    updateFormTwo(status){
      // this.twoDialogConfig.status = typeof status === 'number' ? status : 5;
      // this.storegc_id = status.storegc_id;
      // this.name.value = status.name || ''; 
      // this.img.value = status.img || [];
    },

    initGoodsForm(item){
      console.error(item);
      this.detail = item;  

      // 编辑
      if(item.bargains_id) this.sku.value = item.goods_id;

      this.price.value = item.bargains_id ? item.goods_price : '';
      this.price.alert = null;

      this.dateTime.value = [item.start_time || '', item.end_time || ''];
      this.dateTime.alert = null;
    },

    validate(){
      let validArr = ['price'];
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(this[key].alert) return true;

        if(!this[key].value){
          return this[key].alert = `${this[key].title}不能为空!`;
        }
      }

      if(!this.dateTime.value[1]) return this.dateTime.alert = `请完善${this.dateTime.title}`;
    },

    async submit(){
      let paramArr = ['price',],
          status = this.twoDialogConfig.status || this.dialogConfig.status,
          imgList = this.img.value,
          param;
      // if(!imgList.length) return this.img.alert = '请选择图片作为主图';

      if(this.validate()) return ;
      
      this.stopSubmit = true;

      // let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      // if(!img[0]) return console.error('img value :', img);

      param = {
        goods_id: this.sku.value,
        goods_price: this.price.value,
        start_time: this.dateTime.value[0],
        end_time: this.dateTime.value[1],
      };

      this.save(param);
    },
    // 
    async save(param){
      let status = this.twoDialogConfig.status || this.dialogConfig.status;
      let res = null;

      if(status == 2){
        res = this.detail.bargains_id ? await api.setSpecial(this.detail.bargains_id, param) : await api.addSpecial(param);
      }

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '更新特惠失败'}`);
      }

      if(res.status ==0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      this.stopSubmit = false;
      this.sku.categories = [];
    },

    format(v){
      let stateList = ['下架', '上架'],
          copyList = [
            ['goods_image', 'goods_image'],
            ['price', 'goods_price'],
            ['goods_marketprice', 'goods_marketprice'],
            ['goods_advword', 'goods_advword'],
            ['goods_state', 'goods_state'],
            ['gc_id_1', 'gc_id_1'],
            ['gc_id_2', 'gc_id_2'],
            ['gc_id_3', 'gc_id_3'],
            ['goods_storage', 'goods_storage'],
          ],
          goods = v.goodscommon; 

      if(v.goods){
        copyList.forEach(key => v[key[0]] = v.goods[key[1]]);
      }

      v.stateStr = stateList[v.goods_state];

      v.showUp = v.goods_state == 0;

      this.addClassName(v);
    },

    // 获取Vip特惠列表
    async getList() {
      this.tableConfig.loading = true

      let res = await api.getVipSpecialList(this.query, this);

      if(typeof res == 'string' || !res || res.error){ this.$message.error(res ? res.error || res : '获取Vip特惠失败'); }

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : 0;
      }

      this.tableConfig.loading = false;
    },

    async deleteItem(item){
      let res = await api.deleteSpecial(item.bargains_id, null, this);

      res && res.status == 0 ? this.$message.success('操作成功') : this.$message.error(res.error || res);

      this.getList();
    },

    search(param){
      param.search ? this.query.search = param.search : delete this.query.search;

      this.getList();
    },

    updateList(param){
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },

    // Goods
    async addGoods(item){

      let res = await api.getGoods(item.goods_commonid, null);

      if(typeof res == 'string' || !res || res.error){ this.$message.error(res ? res.error || res : '获取商品详情失败'); }

      if(res && res.data){
        let skulist = res.data.SKUList;

        skulist.forEach(v => { v.specStr = v.goods_spec ? Object.keys(v.goods_spec).map(key => v.goods_spec[key]).join('-') : ''; });

        this.sku.categories = skulist.map(v => ({ id: v.goods_id, title: v.specStr, }));
        this.sku.value = skulist[0].goods_id;

        this.addClassName(res.data);

        this.openDialog(res.data);
      }
    },

    // async deleteGoods(item){
    //   let res = await api.deleteGoods(item.cataloggoods_id, null, this);

    //   if(res.status ==0) this.$message.success('操作成功');
    //   if(res.status !=0) this.$message.success(res.error);

    //   this.getClassGoodsList();
    // },

    async initGoodsList(){
      this.goodsQuery.page = 1;

      // init classify
      let classRes = await classApi.getClassList({ parent_id: 0 });
      classRes.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        v.children = [];
      });
      this.twoHeadConfig.multiSelect.source = classRes.data;

      this.getGoodsList();
    },

    searchGoods(o){
      this.goodsQuery.page = 1;
      this.$refs.goodsTable.initPage();

      o.search ? this.goodsQuery.search = o.search : delete this.goodsQuery.search;

      this.getGoodsList();
    },

    async loadClass(val){
        let param, selClass,
        source = this.twoHeadConfig.multiSelect.source;

      selClass = source.find(v => v.value == val[0]);
      if (val[1]) selClass = selClass.children.find(v => v.value == val[1]);

      let res = await classApi.getClassList({ parent_id: val[1] || val[0] });

      res.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        if (!val[1]) v.children = [];
      });

      selClass.children = res.data;
    },

    searchByClass(param){
      this.goodsQuery.page = 1;
      this.$refs.goodsTable.initPage();

      this.goodsQuery.gc_id = param[2];

      this.getGoodsList();
    },

    updateGoodsList(param){
      this.goodsQuery.limit = param.limit;
      this.goodsQuery.page = param.page;

      if(this.operateIndex == 0) return this.getGoodsList();
    },

    async getGoodsList() {
      this.twoTableConfig.loading = true;

      let res = await api.getGoodsList(this.goodsQuery, this);

      if (typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取商品失败');

      if(res && res.data){
        res.data.forEach(this.goodsFormat);

        this.goodsList = res.data || [];
        this.goodsTotal = res.pagination ? res.pagination.total : this.goodsList.length;
      }

      this.twoTableConfig.loading = false;
    },

    goodsFormat(v){
      v.stateStr = this.stateArr[v.goods_state];
    },

    // common
    addClassName(v){
      let res;

      // 一级分类
      res = this.classList.filter(item => item.storegc_id == v.gc_id_1)[0];
      v.gc_name_1 = res ? res.storegc_name : '-';

      res = this.classList.filter(item => item.storegc_id == v.gc_id_2)[0];
      v.gc_name_2 = res ? res.storegc_name : '-';

      res = this.classList.filter(item => item.storegc_id == v.gc_id_3)[0];
      v.gc_name_3 = res ? res.storegc_name : '-';
    },

    async getClassList(){
      let res = await classApi.getClassList();

      if(typeof res == 'string' || !res || res.error){ this.$message.error(res ? res.error || res : '获取分类失败'); }

      if(res && res.data){
        res.data.forEach(v => { v.id = v.storegc_id; v.title = v.storegc_name; });
        this.classList = res.data;

        this.getList();
      }
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
    },
    
  },

  created(){
    this.getClassList();

    this.getUploadToken();
  },
}
</script>