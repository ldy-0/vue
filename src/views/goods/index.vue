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
      <el-form :inline="true" style="display:inline-block">
        <multiSelect :obj='headConfig.multiSelect' @load='loadClass2' @search="searchByclass"></multiSelect>
      </el-form>
    </el-header>

    <custom-table ref='mainTable' :config='tableConfig' :data='list' :total='total' @update='updateForm' @delete='deleteItem' @change='change' @modify='handleTableEvent'></custom-table>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <el-form label-width='120px' v-if='showGoods'>
        <custom-img :obj='img'></custom-img>

        <custom-img :obj='detailImg'></custom-img>

        <custom-input :obj='name'></custom-input>

        <c-select :obj='category' @change='changeCategory'></c-select>

        <c-select :obj='store' v-if='showStore'></c-select>

        <multiSelect :obj='classify' @load='loadClass'></multiSelect>

        <!-- 活动图标 -->
        <custom-img :obj='activityIcon'></custom-img>

        <!-- 优惠券 -->
        <c-radio :obj='coupon' v-if="isNormalGoods"></c-radio>

        <!-- 新人专享 -->
        <!-- <custom-radio :obj='newPeople' v-if="!isStoreGoods" @change="changeNewPeople"></custom-radio> -->

        <custom-input :obj='sales' v-if="!isStoreGoods"></custom-input>

        <custom-radio :obj='spec' @change="changeSku"></custom-radio>
        <!-- 单规格 -->
        <div v-if="spec.value == 1">
          <custom-input :obj='sku'></custom-input>

          <custom-input :obj='basePrice' v-if='isStoreGoods || showStore'></custom-input>
          <custom-input :obj='recommendPrice' v-if='isStoreGoods || showStore'></custom-input>
          <number :obj='marketprice'></number>
          <number :obj='price'></number>
          <!-- <custom-input :obj='newPeoplePrice' v-if="!isStoreGoods && isNewPeople"></custom-input> -->

          <custom-input :obj='amount'></custom-input>

          <!-- <number :obj='profit'></number> -->
          <div v-if='[0, 2].indexOf(category.value) !== -1 && !isNewPeople'>
            <number :obj='vip0_commission'></number>
            <number :obj='vip1_commission'></number>
            <number :obj='vip2_commission'></number>
            <number :obj='vip3_commission'></number>
            <number :obj='vip4_commission'></number>
          </div>
        </div>
        <!-- 多规格 -->
        <div v-if="spec.value == 2">
          <el-form-item>
            <multi-sku :obj='multiSkuConfig' :type='category.value' :classList='skuClassList' :skuList='skuList' :limit='5' @update='updateMultiSku'></multi-sku>
          </el-form-item>
        </div>

        <!-- 运费 -->
        <c-radio :obj='freightType'></c-radio>

        <number :obj='freight' v-if="freightType.value == 1"></number>
        <c-select :obj='freightTemp' v-if="freightType.value == 2"></c-select>

        <!-- 排序权重 -->
        <custom-input :obj='goods_sort'></custom-input>

        <!-- 促销活动描述 -->
        <custom-input :obj='activityDesc'></custom-input>

        <!-- 返还积分 -->
        <custom-input :obj='integral' v-if='[0, 2].indexOf(category.value) !== -1'></custom-input>

        <!-- 对接人 -->
        <custom-radio :obj='owner' @change='changeOwner'></custom-radio>
        <div v-if="owner.value == 1">
          <custom-input :obj='ownerCode'></custom-input> 

          <custom-input :obj='ownerVip0Award'></custom-input> 
          <custom-input :obj='ownerVip1Award'></custom-input> 
          <custom-input :obj='ownerVip2Award'></custom-input> 
          <custom-input :obj='ownerVip3Award'></custom-input> 
          <custom-input :obj='ownerVip4Award'></custom-input> 
        </div>

        <el-form-item :label="content.title" v-if='dialogConfig.status'>
          <editor style='width: 800px;' v-model='content.value'></editor>
        </el-form-item>
      </el-form>

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
import api from "@/api/goods";
import commonReq from "@/api/common";
import classAPI from "@/api/classify";
import owner from './owner';
import transport from './transport';
import activity from './activity';
import store from './store';
import multisku from '@/components/form/goods/multiSku';
import coupon from '@/components/form/goods/coupon';
import sales from '@/components/form/goods/sales';
import newPeople from './newPeople';

export default {
  mixins: [owner, transport, multisku, activity, store, coupon, newPeople, sales],

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
  },

  computed: {
    showDialog() { return Boolean(this.dialogConfig.status); },
    showGoods(){ return [1, 2].indexOf(this.dialogConfig.status) != -1; },
    isAdd(){ return this.dialogConfig.status === this.ADD; },
    idEdit(){ return this.dialogConfig.status === this.EDIT; },

    isNormalGoods(){ return this.category.value == this.NORMAL_GOOD; },
    isVipGoods(){ return this.category.value == this.VIP_GOOD; }, // 平台和商家所有VIP商品
    // 店铺商品 1. 禁止修改类别 2. 禁止修改规格类别 3. 禁止添加，删除规格 4. 禁止修改规格供货价，推荐价，库存值 5. 禁止修改运费类型
    isStoreGoods(){ return this.category.value == this.STORE_GOOD; },
    // 新人专享商品: 1. 无分销 2. 无对接人 3. 有新人价
    isNewPeople(){ return this.newPeople.value === this.USE_NEWPEOPLE; },

    isSingleSku(){ return this.spec.value === this.SINGLESKU; },
  },

  data() {
    return {
      categoryList: [
        { value: 0, title: "常规商品" }, 
        { value: 1, title: "VIP商品" },
        { value: 2, title: "入驻商家" },
      ],
      ADD: 1,
      EDIT: 2,
      NORMAL_GOOD: 0,
      VIP_GOOD: 1,
      STORE_GOOD: 2,
      dialogConfig: {
        title: "",
        status: 0 // 1:添加商品  2：编辑商品  3：下架原因
      },
      img: { title: "商品图片", value: [], limit: 1, alert: null, url: "https://up-z2.qiniup.com", cdnUrl: "https://cdn.health.healthplatform.xyz", body: {}, width: '120px', },
      detailImg: { title: "详情图片", value: [], limit: 10, alert: null, url: "https://up-z2.qiniup.com", cdnUrl: "https://cdn.health.healthplatform.xyz", body: {}, width: '120px', preventValidate: true, },
      name: { type: 'text', title: "商品名称", value: "", alert: null },
      category: { title: "类别", list: [], value: '', alert: null },
      classify: { title: "分类", source: [], value: [], alert: null },

      spec: { title: "规格", categories: [{ id: 1, title: "单规格" }, { id: 2, title: "多规格" }], value: 1, alert: null, disabled: false, },
      sku: { type: 'text', title: "商品编号", value: "", alert: null },
      marketprice: { title: "原价", value: "", alert: null },
      price: { title: "售价", value: "", alert: null },
      basePrice: { title: "供货价", value: "", alert: null },
      recommendPrice: { title: "建议零售价", value: "", alert: null },
      amount: { type: 'integer', title: "库存", value: "", alert: null },

      goods_sort: { title: "排序权重", value: "", alert: null },
      activityDesc: { type: 'string', title: "促销活动描述", value: "", alert: null, preventValidate: true, },
      integral: { type: 'integer', title: "返还积分", value: "", alert: null },

      profit: { title: "平台利润", value: 0, alert: null },
      vip0_commission: { title: "体验代理奖金", value: "", alert: null },
      vip1_commission: { title: "VIP1奖金", value: "", alert: null },
      vip2_commission: { title: "VIP2奖金", value: "", alert: null },
      vip3_commission: { title: "VIP3奖金", value: "", alert: null },
      vip4_commission: { title: "VIP4奖金", value: "", alert: null },

      content: { title: "商品详情", value: "", alert: null },
      detail: null,
      stopSubmit: false,

      headConfig: {
        title: "添加商品",
        placeHolder: "请输入商品名称或店铺名称",
        btnList: [
          { title: '一键清空', },
        ],
        selectLabelList: ["类别", "状态"],
        multiSelect: { title: "分类", source: [], value: [], alert: null, search: true },
        selectList: [
          [
            { id: null, name: "全部" },
            { id: 0, name: "自营商品" },
            { id: 1, name: "VIP商品" },
            { id: 2, name: "入驻商品" },
          ],
          [
            { id: null, name: "全部" },
            { id: 1, name: "上架" },
            { id: 0, name: "下架" }
          ]
        ]
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        updateTitle: "编辑",
        showDelete: true,
        btnList: [
          { key: 'isDown', value: '上架' },
          { key: 'goods_state', value: '下架' },
          { key: 'isWxShow', value: '隐藏' },
          { key: 'isWxHidden', value: '显示' },
        ],
        classList: [
          { key: "排序序号", value: "goods_sort" },
          { key: "图片", value: "goods_image", isImg: true },
          { key: "商品名称", value: "goods_name" },
          { key: "店铺名称", value: "store_name" },
          { key: "一级分类", value: "gc_name_1" },
          { key: "二级分类", value: "gc_name_2" },
          { key: "三级分类", value: "gc_name_3" },
          { key: "库存", value: "goods_storage" },
          { key: "原价", value: "goods_marketprice" },
          { key: "售价", value: "goods_price" },
          { key: "类别", value: "is_vipStr" },
          { key: "状态", value: "goods_stateStr" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        // goods_verify: 1,
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
      let goods;
      this.spec.value = 1;
      this.dialogConfig.status = typeof status === "number" ? status : 2;

      // Edit
      if (status != 1) {
        let res = await api.getGoods(status.goods_commonid);
        if (res.error) return this.$message.error(res.error);
        goods = res.data;
      }

      // get first class list
      let classRes = await classAPI.getClassList({ parent_id: 0 });
      classRes.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        v.children = [];
      });
      this.classify.source = classRes.data;

      if (goods) {
        await this.loadClass([goods.gc_id_1, 0, 0]);
        await this.loadClass([goods.gc_id_1, goods.gc_id_2, 0]);
      }

      this.img.value = goods ? [{ url: goods.goods_image }] : [];
      this.detailImg.value = goods ? goods.goodsimagesList.map(v => ({ url: v.goodsimage_url })).slice(1) : [];
      this.name.value = goods ? goods.goods_name : "";

      this.category.list = goods && goods.store_id !== 1 ? this.categoryList : this.categoryList.slice(0, 2);
      this.category.value = goods ? goods.is_vip : 0;
      this.category.disabled = false;

      this.amount.disabled = this.recommendPrice.disabled = this.basePrice.disabled = false;
      this.amount.alert = null;
      // 入驻商家商品
      if(goods && goods.store_id !== 1 && !goods.is_vip){
        this.category.disabled = this.amount.disabled = this.recommendPrice.disabled = this.basePrice.disabled = true;
        this.category.value = 2;
      }

      // vip商品
      this.initStore(goods);

      this.classify.value = goods ? [goods.gc_id_1, goods.gc_id_2, goods.gc_id_3] : [];

      this.goods_sort.value = goods ? goods.goods_sort : '';
      this.activityDesc.value = goods ? goods.goods_advword : '';
      this.activityIcon.value = goods && goods.tag_image ? [ { url: goods.tag_image} ] : [];
      this.integral.value = goods ? goods.goods_integral : '';
      this.content.value = goods ? goods.goods_body : "";

      this.spec.value = goods && goods.spec_value ? 2 : 1;
      this.spec.disabled = this.isStoreGoods;
      this.updateMultiSkuConfig(this.isStoreGoods ? 2 : (goods && goods.is_vip ? 1 : 0));
      if (!(goods && goods.spec_value)) {
        this.formatSingleSku(goods);
      } else {
        this.formatMultiSku(goods);
      }

      this.initSales(goods);
      this.initFreight(goods);
      this.initOwner(goods);
      this.initCoupon(goods);
      this.initNewPeople(goods); // 新人专享必须在对接人和优惠券后面初始化

      this.detail = goods;
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },

    formatSingleSku(goods){
      this.skuClassList = this.skuList = [];

      let sku = goods ? goods.SKUList[0] : {};
      this.sku.value = goods ? sku.goods_serial : "";

      this.marketprice.value = goods ? goods.goods_marketprice : "";
      this.price.value = goods ? goods.goods_price : "";
      this.basePrice.value = goods ? sku.supply_price : '';
      this.recommendPrice.value = goods ? sku.recommended_price : '';

      this.amount.value = goods ? sku.goods_storage : "";
      this.profit.value = 0;
      this.vip0_commission.value = goods ? sku.vip0_commission : "";
      this.vip1_commission.value = goods ? sku.vip1_commission : "";
      this.vip2_commission.value = goods ? sku.vip2_commission : "";
      this.vip3_commission.value = goods ? sku.vip3_commission : "";
      this.vip4_commission.value = goods ? sku.vip4_commission : "";
    },

    formatMultiSku(goods){
      this.skuClassList = goods.spec_name.map((v, i) => {
        return {
          name: v,
          skus: goods.spec_value[i].map(name => ({ name, }))
        };
      });

      goods.SKUList.forEach(v => {
        v.price = Number(v.goods_price);
        v.marketprice = Number(v.goods_marketprice);
        v.count = Number(v.goods_storage);
        v.sku = v.goods_serial;
        v.goods_id = v.goods_id;
      });
      this.skuList = goods.SKUList;
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
          { key: "价格", value: "price", custom: /(^[1-9]\d*(\.\d{1,2})?$)|(^0\.\d{1,2}$)/ },
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
            if(!v.custom.test(item[v.value])) err = `${v.key}未填写或填写不正确`;
          }else{
            if(!(item[v.value] >= 0)) err = `${v.key}必须为大于零的数字`;
          }

        });

        if(item.price <= 0) err = '价格未填写或填写不正确!';

        return err;
      });

      return err;
    },

    async submit() {
      // this.mockData();
      let spec = this.spec,
        imgList = this.img.value,
        firstSpec = this.specList[0],
        param;

      // down
      if(this.dialogConfig.status == 3) return this.changeGoods(this.detail, 'offline');

      if (!imgList.length) return (this.img.alert = "请选择图片作为主图");

      if (!this.name.value) return this.name.alert = `请选择${this.name.title}`;
      if (typeof this.category.value !== "number") return (this.category.alert = `请选择${this.category.title}`);
      if (!this.classify.value[2]) return (this.classify.alert = `请选择${this.classify.title}`);

      // sigleSku
      if (spec.value == 1){
        if(this.validateSigleSku()) return ;
      }
        
      // multiSku
      if (spec.value == 2) {
        let multiSkuErr = this.validateMultiSku();
        if(multiSkuErr) return this.$message.error(multiSkuErr);
      }

      // freight
      if (this.freightType.value == 1 && !this.freight.value) return (this.freight.alert = `请选择${this.freight.title}`);
      if (this.freightType.value == 2 && !this.freightTemp.value) return this.freightTemp.alert = `请选择${this.freightTemp.title}`;

      // activityDesc
      if(this.category.value == 0 && this.activityDesc.value.length > 4) return this.$message.error(`普通商品促销活动描述不能超过4个字!`);

      // owner
      if(this.owner.value == 1 && !this.ownerCode.value) return this.ownerCode.alert = `请填写${this.ownerCode.title}`;

      if(!this.validateNewPeople()) return ;

      this.stopSubmit = true;

      imgList = imgList.concat(this.detailImg.value);
      let img = imgList.map(v => v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url);
      if (!img[0]) return console.error("img value :", img);

      param = {
        goods_image: img,
        goods_name: this.name.value,
        is_vip: Number(this.category.value == 1),
        gc_id_1: this.classify.value[0],
        gc_id_2: this.classify.value[1],
        gc_id_3: this.classify.value[2],
        gc_id: this.classify.value[2],
        goods_price: spec.value == 2 ? firstSpec.price : this.price.value,
        goods_marketprice: spec.value == 2 ? firstSpec.marketprice : this.marketprice.value,
        goods_sort: this.goods_sort.value,
        goods_advword: this.activityDesc.value,
        goods_integral: this.integral.value,
        goods_body: this.content.value,
        tag_image: this.fromImg('activityIcon'),
      };

      let skuPropArr = ["sku", "price", "marketprice", "profit", "vip0_commission", "vip1_commission", "vip2_commission", "vip3_commission", "vip4_commission"];
      if (spec.value == 1) {
        param.spec_name = param.spec_value = null;
        param.spec = this.encodeSingleSku(skuPropArr);
      } else {
        [param.spec_name, param.spec_value, param.spec] = this.encodeMultiSku(skuPropArr);
      }

      // vip goods
      if(this.showStore){
        param.store_id = this.store.value;
        param.store_name = this.store.list.filter(v => v.store_id == param.store_id)[0].store_name;
      }

      param.supply_price = param.spec[0].supply_price || 0,
      param.recommended_price = param.spec[0].recommended_price || 0;

      // freight
      param.goods_freight = this.freightType.value == 1 ? this.freight.value : '';
      param.transport_id = this.freightType.value == 2 ? this.freightTemp.value : '';

      // owner
      if(this.owner.value == 1){
        let ownerPropArr = ['ownerCode', 'ownerVip0Award', 'ownerVip1Award', 'ownerVip2Award', 'ownerVip3Award', 'ownerVip4Award'],
            arr = ['agent_mobile', 'agent_commission_0', 'agent_commission_1', 'agent_commission_2', 'agent_commission_3', 'agent_commission_4'];

        ownerPropArr.forEach((prop, i) => { param[arr[i]] = this[prop].value; });

        if(this.dialogConfig.status == 2) param.agent_id = this.detail.SKUList[0].agent_id;
      }

      this.setSales(param);
      this.setCoupon(param);

      // return console.error(img, 'about param : ', param);
      this.save(param);
    },

    fromImg(k){
      let o = this[k],
          values = o.value;

      let arr = values.map(v => v.raw ? { url: `${o.cdnUrl}/${v.response.key}` } : v);

      return o.limit == 1 ? arr[0] ? arr[0].url : '' : arr.map(v => JSON.stringify(v));
    },

    async format(item) {
      let matcher,
        arr = ["is_vip", "goods_state"],
        selectList = this.headConfig.selectList,
        classify;

      item.img = [{ url: item.goods_image }];
      item.detailImg = item.detailImg ? item.detailImg.map(v => { return { url: v }; }) : [];

      // get match
      matcher = this.exchange(selectList, arr.map(v => item[v]), "id", "name");
      arr.forEach((v, i) => (item[`${v}Str`] = matcher[i]));

      // store category
      if(item.store_id != 1 && !item.is_vip) item.is_vipStr = this.categoryList[2].title;

      // 分类名
      this.allClass.filter(v => {
        if (v.storegc_id == item.gc_id_1) item.gc_name_1 = v.storegc_name;
        if (v.storegc_id == item.gc_id_2) item.gc_name_2 = v.storegc_name;
        if (v.storegc_id == item.gc_id_3) item.gc_name_3 = v.storegc_name;
      });

      // 
      item.isDown = item.goods_state == 0 && (item.store_id == 1 || item.is_vip);
      item.only_app == 0 ? item.isWxShow = true : item.isWxHidden = true;
    },
    exchange(sourceList, valueList, filterProperty, destProperty) {
      let res,
        resList = [];

      sourceList.forEach((list, index) => {
        res = list.filter(v => v[filterProperty] == valueList[index])[0];
        resList[index] = res ? res[destProperty] : "";
      });
      return resList;
    },
    //
    async loadClass(val) {
      let param,
        selClass,
        source = this.classify.source;

      selClass = source.find(v => v.value == val[0]);
      if(!selClass) return ;

      if (val[1]) selClass = selClass.children.find(v => v.value == val[1]);
      if(!selClass) return ;

      let res = await classAPI.getClassList({ parent_id: val[1] || val[0] });

      res.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        if (!val[1]) v.children = [];
      });

      selClass.children = res.data;
    },
    async loadClass2(val) {
      let param,
        selClass,
        source = this.headConfig.multiSelect.source;

      selClass = source.find(v => v.value == val[0]);
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
      //获取列表
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

    async getUploadToken() {
      let res = await commonReq.getUploadToken();

      if (res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.detailImg.body.token = this.img.body.token = res.data;
      this.detailImg.body.config = this.img.body.config = "{ useCdnDomain: true }";

      this.activityIcon.url = "https://up-z2.qiniup.com";
      this.activityIcon.cdnUrl = "https://cdn.health.healthplatform.xyz";
      this.activityIcon.body = { token: res.data, config: { useCdnDomain: true, }, };
    },

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

    mockData(){
      if(this.dialogConfig.status == 2) return ;
      this.img.value = [ { url: 'https://cdn.health.healthplatform.xyz/FlmxdWaBToPeFk6yBTFhYQi8Kbay', } ]; 
      this.name.value = '年货大礼包(n-s-n)';
      this.classify.value = [40, 59, 60];

      // this.price.value = 1;
      // this.marketprice.value = 124;
      // this.sku.value = 12345;
      // this.amount.value = 2400,
      // this.freight.value = 1.2;
      // this.vip0_commission.value = this.vip1_commission.value = this.vip2_commission.value = this.vip3_commission.value = this.vip4_commission.value = 1;
    }

  },

  async created() {
    this.getList();

    this.getUploadToken();

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