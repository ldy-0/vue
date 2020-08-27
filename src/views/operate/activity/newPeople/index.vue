<style lang="css">
.header {
  margin: 20px 0;
  height: 88px !important;
}
</style>

<template>
  <div>

    <el-header class="header">
      <custom-head style="display:inline-block" :config='headConfig' @add='updateForm(1)' @search='search' @emit='handleHeadEvent'></custom-head>
      <!-- <el-form :inline="true" style="display:inline-block">
        <multiSelect :obj='headConfig.multiSelect' @load='loadClass2' @search="searchByclass"></multiSelect>
      </el-form> -->
    </el-header>

    <custom-table ref='mainTable' :config='tableConfig' :data='list' :total='total' @update='updateForm' @delete='deleteItem' @change='change' @modify='handleTableEvent'></custom-table>

    <goods :obj="goodsConfig" @submit="submitGoods" @close="closeGoodsDialog" v-if="showGoods"></goods>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <down :obj='down' v-if='dialogConfig.status == 3'></down>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import customInput from "@/components/customInput";
import customSelect from "@/components/select";
import cSelect from "@/components/customSelect";
import multiSelect from "@/components/multiSelect";
import customRadio from "@/components/radio";
import cRadio from "@/components/customRadio";
import number from "@/components/number";
import integer from "@/components/integer";
import dateTimeRange from "@/components/dateTimeRange";
import customImg from "@/components/customImg";
import editor from "@/components/Tinymce";
import multiSku from "@/components/multiSku";
import down from '@/components/form/down'
import goods from '@/components/form/goods';
import api from "@/api/goods";
import commonReq from "@/api/common";
import classAPI from "@/api/classify";

export default {
  mixins: [],

  components: {
    customHead,
    customTable,
    customInput,
    customSelect,
    cSelect,
    multiSelect,
    customRadio,
    cRadio,
    number,
    integer,
    dateTimeRange,
    customImg,
    editor,
    multiSku,
    down,
    goods,
  },

  computed: {
    showDialog() { return this.dialogConfig.status ? this.dialogConfig.status < 100 : false; },
    showGoods(){ return [this.ADDGOODS, this.EDITGOODS].indexOf(this.dialogConfig.status) !== -1 },
  },

  data() {
    return {
      CLOSEDIALOG: 0,
      ADDGOODS: 100,
      EDITGOODS: 101,
      UP: 1,
      DOWN: 0,
      goodsConfig: {
        show: true,
        submit: '确 定',
        showNewPeople: true, // 新人专享
        detail: null,
      },

      categoryList: [
        { value: 0, title: "常规商品" }, 
        { value: 1, title: "VIP商品" },
        { value: 2, title: "入驻商家" },
      ],
      NORMAL_GOOD: 0,
      VIP_GOOD: 1,
      STORE_GOOD: 2,
      dialogConfig: {
        title: "",
        status: 0 // 1:添加商品  2：编辑商品  3：下架原因
      },

      classList: [],
      specList: [],
      detail: null,
      stopSubmit: false,

      headConfig: {
        title: "添加商品",
        placeHolder: "请输入商品名称",
        btnList: [
          // { title: '一键清空', },
        ],
        // selectLabelList: ["状态"],
        multiSelect: { title: "分类", source: [], value: [], alert: null, search: true },
        // selectList: [
        //   [
        //     { id: null, name: "全部" },
        //     { id: 1, name: "上架" },
        //     { id: 0, name: "下架" }
        //   ]
        // ]
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        updateTitle: "编辑",
        showDelete: true,
        btnList: [
          { key: 'isDown', value: '上架' },
          { key: 'goods_state', value: '下架' },
          // { key: 'isWxShow', value: '隐藏' },
          // { key: 'isWxHidden', value: '显示' },
        ],
        classList: [
          { key: "排序序号", value: "goods_sort" },
          { key: "图片", value: "goods_image", isImg: true },
          { key: "商品名称", value: "goods_name" },
          // { key: "店铺名称", value: "store_name" },
          // { key: "一级分类", value: "gc_name_1" },
          // { key: "二级分类", value: "gc_name_2" },
          // { key: "三级分类", value: "gc_name_3" },
          { key: "原价", value: "goods_marketprice" },
          { key: "新人价", value: "newcomer_price" },
          { key: "库存", value: "goods_storage" },
          { key: "销量", value: "goods_faker_salenum" },
          // { key: "店铺类型", value: "is_vipStr" },
          { key: "状态", value: "goods_stateStr" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        newcomer: 1,
      },

      allClass: [],

      down: {
        title: '确认下架商家？',
        down:  { title: '下架原因', value: '', type: 'text', alert: null, },
      },

    };
  },
  methods: {
    search(param) {
      this.query.page = 1;
      this.$refs.mainTable.initPage();

      let statusList = param.statusList,
          category = statusList[0];

      this.query.search = param.search;

      delete this.query.is_vip;
      delete this.query.store_id;
      delete this.query.store_goods;
      if(category == 2) this.query.store_goods = true;

      if(category == 0) this.query.store_id = 1;
      if(category != null) this.query.is_vip = category % 2;

      this.query.goods_state = statusList[1];

      this.getList();
    },
    searchByclass(param) {
      this.query.page = 1;
      this.query.gc_id = param[2];
      this.getList();
    },

    handleHeadEvent(index){
      if(index == 0) this.clearActivity('tag_cancel');
    },

    handleTableEvent(item, index){
      // up
      if(index == 0) return this.changeGoods(item, 'online');
      // down
      if(index == 1) return this.changeGoods(item, 'offline');
      // if(index == 1) return item.store_id != 1 ? this.openDownDialog(item) : this.changeGoods(item, 'offline');
      // wx show
      if(index == 2) return this.changeGoods(item, 'only_app');
      // wx hidden
      if(index == 3) return this.changeGoods(item, 'all_end');
    },

    openDownDialog(item){
      let down = this.down.down;  

      this.dialogConfig.status = 3;
      this.detail = item;
      
      down.value = '';
      down.alert = null;
    },

    async updateForm(status) {
      let goods,
          config = this.goodsConfig;

      // Edit
      if (status != 1) {
        let res = await api.getGoods(status.goods_commonid);
        if (res.error) return this.$message.error(res.error);
        goods = res.data;
      }

      // get first class list
      let classRes = await classAPI.getClassList({ parent_id: 0 });
      if(!classRes || typeof classRes === 'string' || classRes.error) return this.$message.error(classRes ? classRes.error || classRes : '获取分类列表失败!')
      classRes.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        v.children = [];
      });

      if (goods) {
        await this.loadClass([goods.gc_id_1, 0, 0], classRes.data);
        await this.loadClass([goods.gc_id_1, goods.gc_id_2, 0], classRes.data);
      }

      config.classList = classRes.data;
      config.classify = goods ? [goods.gc_id_1, goods.gc_id_2, goods.gc_id_3] : [];

      config.detail = this.detail = goods;

      this.dialogConfig.status = typeof status === "number" ? this.ADDGOODS : this.EDITGOODS;
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },

    changeCategory(index){
      this.showStore = index == 1;
      this.freightType.disabled = [1, 2].indexOf(index) !== -1 ? true : false;

      if(this.showStore){
        if(!this.store.list.length) this.getStoreList();
        this.freightType.value = 1;        
      }

      this.updateOwner(index);
      this.updateMultiSkuConfig(index);
      this.updateCoupon(index);
    },

    change(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    // Update multi sku goods
    updateMultiSku(classList, skus) {
      // console.log("update", classList, skus);
      this.classList = classList;
      this.specList = skus;
    },
    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },

    validateSigleSku(){
      let paramArr = [ "sku", "marketprice", "price", "amount", "vip0_commission", "vip1_commission", "vip2_commission", "vip3_commission", "vip4_commission" ];

      // Vip商品|新人专享商品
      if(this.isVipGoods || this.isNewPeople){
        paramArr = paramArr.slice(0, 4);
        this.vip0_commission.value = this.vip1_commission.value = this.vip2_commission.value = this.vip3_commission.value = this.vip4_commission.value = 0;
      }

      if ( paramArr.some(v => this[v].value ? false : (this[v].alert = `请输入${this[v].title}`) )) return true;
    },

    validateMultiSku(){
      let err = "";
      if (!this.specList.length) return `规格类别不能为空`;

      this.specList.some(item => {
        let arr = [
          { key: "VIP4佣金", value: "vip4_commission" },
          { key: "VIP3佣金", value: "vip3_commission" },
          { key: "VIP2佣金", value: "vip2_commission" },
          { key: "VIP1佣金", value: "vip1_commission" },
          { key: "体验代理佣金", value: "vip0_commission" },
          { key: "库存数量", value: "count" },
          { key: "价格", value: "price" },
          { key: "商品标价", value: "marketprice" },
          { key: "商品编号", value: "sku", custom: /^\w+$/ },
        ];

        // Vip商品|新人专享商品
        if(this.isVipGoods || this.isNewPeople){
          arr = arr.slice(4);
          item.vip0_commission = item.vip1_commission = item.vip2_commission = item.vip3_commission = item.vip4_commission = 0;
        }

        arr.forEach((v, i) => {
          if(v.custom){
            if(!v.custom.test(item[v.value])) err = `${v.key}必须为字母或数字`;
          }else{
            if(!(item[v.value] >= 0)) err = `${v.key}必须为大于零的数字`;
          }

        });

        return err;
      });

      return err;
    },

    async submit() {
      let spec = this.spec,
        imgList = this.img.value,
        firstSpec = this.specList[0],
        param;

      // refuse 
      if(this.dialogConfig.status == 3) return this.changeGoods(this.detail, 'refuse');
    },

    submitGoods(param) {
      this.getList();
      this.dialogConfig.status = this.CLOSEDIALOG;
    },

    closeGoodsDialog() {
       this.dialogConfig.status = this.CLOSEDIALOG;
    },

    fromImg(k){
      let o = this[k],
          values = o.value;

      let arr = values.map(v => v.raw ? { url: `${o.cdnUrl}/${v.response.key}` } : v);

      return o.limit == 1 ? arr[0] ? arr[0].url : '' : arr.map(v => JSON.stringify(v));
    },

    async format(item) {
      let selectList = this.headConfig.selectList,
          isStoreGoods = item.store_id != 1,
          skuList = item.SKUList,
          classify;

      item.img = [{ url: item.goods_image }];
      item.detailImg = item.detailImg ? item.detailImg.map(v => { return { url: v }; }) : [];
      // item.newcomer_price = skuList[0] ? skuList[0].newcomer_price : '';

      // store category
      if(item.store_id != 1 && !item.is_vip) item.is_vipStr = this.categoryList[2].title;

      // 分类名
      this.allClass.filter(v => {
        if (v.storegc_id == item.gc_id_1) item.gc_name_1 = v.storegc_name;
        if (v.storegc_id == item.gc_id_2) item.gc_name_2 = v.storegc_name;
        if (v.storegc_id == item.gc_id_3) item.gc_name_3 = v.storegc_name;
      });

      // 
      item.goods_stateStr = item.goods_state == this.UP ? '上架' : '下架';
      item.isDown = item.goods_state == 0 && (item.store_id == 1 || item.is_vip);
      item.only_app == 0 ? item.isWxShow = true : item.isWxHidden = true;
    },

    async loadClass(val, source) {
      let param, selClass;

      if(!source) source = this.classify.source;

      selClass = source.find(v => v.value == val[0]);
      if(!selClass) return ;

      if (val[1]) selClass = selClass.children.find(v => v.value == val[1]);

      let res = await classAPI.getClassList({ parent_id: val[1] || val[0] });

      res.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        if (!val[1]) v.children = [];
      });

      selClass.children = res.data;
    },   

    async save(param) {
      let status = this.dialogConfig.status;

      let res = status == 1 ? await api.addGoods(param) : await api.setGoods(this.detail.goods_commonid, param);

      if(typeof res == 'string' || res.error) this.$message.error(res.error || res);

      this.getList();
      this.stopSubmit = false;
      this.dialogConfig.status = 0;
    },

    async getList() {
      this.tableConfig.loading = true;
      this.query.type = 'sort';
      let res = await api.getGoodsList(this.query, this);

      if (res.error) return this.$message.error(res.error);

      // get all class list
      let allClass = await classAPI.getClassList();
      if (allClass.error) this.$message.error(allClass.error);
      this.allClass = allClass.data;

      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.tableConfig.loading = false;
    },

    async deleteItem(item) {
      let res = await api.deleteGoods(item.goods_commonid);

      this.getList();
    },

    async changeGoods(item, type){
      let down = this.down.down;

      let send = {
        goods_commonid: ['online', 'offline'].indexOf(type) !== -1 ? [item.goods_commonid] : item.goods_commonid,
        type,
      };

      // down
      if(this.dialogConfig.status == 3){
        if(!down.value) return down.alert = `${down.title}不能为空!`;
        send = down.value;
      }
      // return console.error(send);

      let loading = this.$loading({ text: '正在更新状态...', });

      let res = await api.changeGoods(send);

      if(typeof res === 'string' || !res || res.error) return this.handleError(res ? res.error || res : '修改失败', loading);

      this.$message.success("操作成功");
      loading.close();
      this.getList();
    },

    // async getUploadToken() {
    //   let res = await commonReq.getUploadToken();

    //   if (res.error) return this.$message.error(`getUploadToken: ${res.error}`);

    //   this.detailImg.body.token = this.img.body.token = res.data;
    //   this.detailImg.body.config = this.img.body.config = "{ useCdnDomain: true }";

    //   this.activityIcon.url = "https://up-z2.qiniup.com";
    //   this.activityIcon.cdnUrl = "https://cdn.health.healthplatform.xyz";
    //   this.activityIcon.body = { token: res.data, config: { useCdnDomain: true, }, };
    // },

    // utils
    formatClass() {
      let arr = this.classify.value,
        source = this.classify.source;
      return source[arr[0]].children[arr[1]].children[arr[2]];
    },

    handleError(text, loading){
      if(loading) loading.close();

      this.$message.error(text);
    },

  },

  async created() {
    this.getList();

    // this.getUploadToken();

    let classRes = await classAPI.getClassList({ parent_id: 0 });
    classRes.data.forEach(v => {
      v.label = v.storegc_name;
      v.value = v.storegc_id;
      v.children = [];
    });
    this.headConfig.multiSelect.source = classRes.data;

    // this.category.list = this.categoryList;
  }
};
</script>