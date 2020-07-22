<style scoped>
.preview_img{
  width:  100%;  
}

.form_img{
  width: 120px;
  margin-right: 10px;
}
</style>

<template>
  <div>
    <el-dialog :title="obj.title || ''" :visible="obj.show" width="80%" @close='closeDialog'>

      <el-form label-width='120px' :disabled="obj.disabled">
        <custom-img :obj='goodsImg'></custom-img>
        <custom-img :obj='detailImg'></custom-img>

        <custom-input :obj='name'></custom-input>

        <custom-select :obj='category' @change='changeCategory'></custom-select>

        <custom-select :obj='store' v-if='showStore'></custom-select>

        <multiSelect :obj='classify' @load='loadClass'></multiSelect>

        <!-- 活动图标 -->
        <custom-img :obj='activityIcon'></custom-img>


        <!-- 优惠券 -->
        <custom-radio :obj='coupon' v-if="isNormalGoods"></custom-radio>

        <!-- 新人专享 -->
        <custom-radio :obj='newPeople' v-if="showNewPeople" @change="changeNewPeople"></custom-radio>

        <custom-input :obj='sales' v-if="!isStoreGoods"></custom-input>

        <custom-radio :obj='spec' @change="changeSku"></custom-radio>
        <!-- 单规格 -->
        <div v-if="isSingleSku">
          <custom-input :obj='sku'></custom-input>

          <custom-input :obj='basePrice'></custom-input>
          <custom-input :obj='recommendPrice' v-if='isStoreGoods || showStore'></custom-input>
          <number :obj='marketprice'></number>
          <number :obj='price' v-if="!isNewPeople"></number>
          <custom-input :obj='newPeoplePrice' v-if="!isStoreGoods && isNewPeople"></custom-input>
          <custom-input :obj='amount'></custom-input>
          <!-- <div v-if='[0, 2].indexOf(category.value) !== -1 && !isNewPeople'>
            <number :obj='vip0_commission'></number>
            <number :obj='vip1_commission'></number>
            <number :obj='vip2_commission'></number>
            <number :obj='vip3_commission'></number>
            <number :obj='vip4_commission'></number>
          </div> -->
        </div>
        <!-- 多规格 -->
        <div v-if="isMultiSku">
          <el-form-item>
            <multi-sku :obj='multiSkuConfig' :classList='skuClassList' :skuList='skuList' :limit='5' @update='updateMultiSku'></multi-sku>
          </el-form-item>
        </div>

        <!-- 运费 -->
        <custom-radio :obj='freightType'></custom-radio>
        <number :obj='freight' v-if="freightType.value == 1"></number>
        <custom-select :obj='freightTemp' v-if="freightType.value == 2"></custom-select>

        <!-- 排序权重 -->
        <custom-input :obj='goods_sort'></custom-input>

        <!-- 促销活动描述 -->
        <custom-input :obj='activityDesc'></custom-input>

        <!-- 返还积分 -->
        <!-- <custom-input :obj='integral' v-if='[0, 2].indexOf(category.value) !== -1'></custom-input> -->

        <!-- 对接人 -->
        <custom-radio :obj='owner' @change='changeOwner'></custom-radio>
        <div v-if="owner.value == 1">
          <custom-input :obj='ownerCode'></custom-input> 

          <div v-if="isVipGoods">
            <custom-input :obj='ownerVip0Award'></custom-input> 
            <custom-input :obj='ownerVip1Award'></custom-input> 
            <custom-input :obj='ownerVip2Award'></custom-input> 
            <custom-input :obj='ownerVip3Award'></custom-input> 
            <custom-input :obj='ownerVip4Award'></custom-input> 
            <custom-input :obj='ownerVip5Award'></custom-input> 
          </div>
        </div>

        <el-form-item :label="content.title">
          <editor style='width: 800px;' v-model='content.value'></editor>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="submited" :loading="submited" @click="submit" v-if="obj.submit">{{obj.submit}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible="isPreview" width="80%" @close='closePreview'>
      <img class='preview_img' :src='img' @click='closePreview' v-if='img' />
    </el-dialog>
  </div>
</template>
<script>
import customInput from "@/components/customInput";
import customImg from "@/components/customImg";
import customSelect from "@/components/customSelect";
import customRadio from "@/components/customRadio";
import multiSelect from "@/components/multiSelect";
import number from "@/components/number";
import integer from "@/components/integer";
import dateTimeRange from "@/components/dateTimeRange";
import editor from "@/components/Tinymce";
import multiSku from "@/components/multiSku";
import owner from './owner';
import multisku from './multiSku';
import transport from './transport';
import activity from './activity';
import store from './store';
import coupon from './coupon';
import newPeople from './newPeople';
import sales from './sales';
import commonReq from "@/api/common";
import api from "@/api/goods";
import classAPI from "@/api/classify";

export default {
  name: 'form-goods',

  mixins: [owner, multisku, transport, activity, store, coupon, newPeople, sales],

  props: {
    obj: {
      type: Object,
      default: {
        title: '',
      }
    }
  },

  components: {
    customInput,
    customImg,
    customSelect,
    customRadio,
    multiSelect,
    number,
    integer,
    dateTimeRange,
    editor,
    multiSku,
  },

  data(){
    return {
      SINGLESKU: 1,
      MULTISKU: 2,
      NORMALGOODS: 0,
      VIPGOODS: 1,
      STOREGOODS: 2,
      categoryList: [
        { id: 0, title: "常规商品" }, 
        { id: 1, title: "VIP商品" },
        { id: 2, title: "入驻商家" },
      ],

      goodsImg: { title: "商品图片", value: [], limit: 1, alert: null, url: "", cdnUrl: "", body: {} },
      detailImg: { title: "详情图片", value: [], limit: 10, alert: null, url: "", cdnUrl: "", body: {} },
      name: { type: 'text', title: "商品名称", value: "", alert: null },
      category: { title: "类别", list: [], value: 2, alert: null, disabled: false, },
      classify: { title: "分类", source: [], value: [], alert: null },

      spec: { title: "规格", list: [{ title: "单规格", id: 1, }, { title: "多规格", id: 2,  }], value: 1, alert: null, disabled: false, },
      sku: { type: 'text', title: "商品编号", value: "", alert: null },
      detail: null,

      marketprice: { title: "原价(元)", value: "", alert: null },
      price: { title: "售价(元)", value: "", alert: null },
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

      img: null,
      submited: false,
    };
  },

  computed: {
    isPreview(){ return this.img ? true : false; },

    isEdit(){ return Boolean(this.obj.detail); },

    isNormalGoods(){ return this.category.value == this.NORMALGOODS; },
    isVipGoods(){ return this.category.value == this.VIPGOODS; }, // 包含店铺VIP商品
    isStoreGoods(){ return this.category.value == this.STOREGOODS; },
    // 新人专享商品: 1. 无分销 2. 无对接人 3. 有新人价
    isNewPeople(){ return this.newPeople.value === this.USE_NEWPEOPLE; },

    isSingleSku(){ return this.spec.value === this.SINGLESKU; },
    isMultiSku(){ return this.spec.value === this.MULTISKU; },
  },

  methods: {
    closeDialog(done){ this.$emit('close', this.obj); },

    init() {
      let obj = this.obj,
          goods = this.obj.detail;

      this.spec.value = 1;

      this.goodsImg.value = goods ? [{ url: goods.goods_image }] : [];
      this.detailImg.value = goods ? goods.goodsimagesList.map(v => ({ url: v.goodsimage_url })).slice(1) : [];
      this.name.value = goods ? goods.goods_name : "";
      // 商品类别
      this.category.list = goods && goods.store_id !== 1 ? this.categoryList : this.categoryList.slice(0, 2);
      this.category.value = goods ? goods.is_vip : 0;
      this.category.disabled = false;

      this.amount.disabled = this.recommendPrice.disabled = this.basePrice.disabled = false;
      this.amount.alert = null;
      // 入驻商家商品
      if(goods && goods.store_id !== 1 && !goods.is_vip){
        this.category.disabled = this.amount.disabled = this.recommendPrice.disabled = this.basePrice.disabled = true;
        this.category.value = this.STOREGOODS;
      }

      // vip商品
      this.initStore(goods);

      this.classify.source = obj.classList;
      this.classify.value = goods ? obj.classify : [];

      this.goods_sort.value = goods ? goods.goods_sort : '';
      this.activityDesc.value = goods ? goods.goods_advword : '';
      this.activityIcon.value = goods && goods.tag_image ? [ { url: goods.tag_image} ] : [];
      this.integral.value = goods ? goods.goods_integral : '';
      this.content.value = goods ? goods.goods_body : "";

      this.spec.value = goods && goods.spec_value ? this.MULTISKU : this.SINGLESKU;
      this.spec.disabled = this.isStoreGoods;
      this.updateMultiSkuConfig(this.isStoreGoods ? this.MULTISKU : (goods && goods.is_vip ? this.SINGLESKU : 0));
      goods && goods.spec_value ? this.formatMultiSku(goods) : this.formatSingleSku(goods);

      this.initSales(goods); 
      this.initFreight(goods);
      this.initOwner(goods);
      this.initCoupon(goods);
      this.initNewPeople(goods); // 新人专享初始化必须在优惠券，对接人后面

      this.detail = goods;
    },

    formatSingleSku(goods){
      let sku = goods ? goods.SKUList[0] : {};
      this.sku.value = goods ? sku.goods_serial : "";

      this.marketprice.value = goods ? goods.goods_marketprice : "";
      this.price.value = goods ? goods.goods_price : "";
      this.basePrice.value = goods ? sku.supply_price : '',
      this.recommendPrice.value = goods ? sku.recommended_price : '',

      this.amount.value = goods ? sku.goods_storage : "";
      this.profit.value = 0;
      this.vip0_commission.value = goods ? sku.vip0_commission : "";
      this.vip1_commission.value = goods ? sku.vip1_commission : "";
      this.vip2_commission.value = goods ? sku.vip2_commission : "";
      this.vip3_commission.value = goods ? sku.vip3_commission : "";
      this.vip4_commission.value = goods ? sku.vip4_commission : "";

      this.amount.disabled = this.recommendPrice.disabled = this.basePrice.disabled = false;
      this.amount.alert = null;
      // 入驻商家
      if(goods && goods.store_id !== 1){
        this.amount.disabled = this.recommendPrice.disabled = this.basePrice.disabled = true;
      }
    },

    formatMultiSku(goods){
      let multiSkuConfig = this.multiSkuConfig;

      multiSkuConfig.attributeList = goods.is_vip ? this.publicGoodsAttributeList.slice(0, 4) : this.publicGoodsAttributeList;
      if(this.isStoreGoods){
        multiSkuConfig.addable = multiSkuConfig.deletable = false;
        multiSkuConfig.attributeList = this.storeGoodsAttributeList;
      }

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

    isIllegalGoods() {
      let spec = this.spec,
        goodsImg = this.goodsImg,
        name = this.name,
        category = this.category,
        classify = this.classify,
        firstSpec = this.specList[0];

      if (!goodsImg.value.length) return goodsImg.alert = "请选择图片作为主图";

      if (!name.value) return name.alert = `请选择${name.title}`;
      if (typeof category.value !== "number") return category.alert = `请选择${category.title}`;
      if (!classify.value[2]) return classify.alert = `请选择${classify.title}`;

      // Sku
      if (this.isSingleSku){
        if(this.validateSigleSku()) return true;
      }else{
        let multiSkuErr = this.validateMultiSku();
        if(multiSkuErr) return this.$message.error(multiSkuErr), true;
      }
        
      // freight
      if (this.freightType.value == 1 && !this.freight.value) return this.freight.alert = `请选择${this.freight.title}`;
      if (this.freightType.value == 2 && !this.freightTemp.value) return this.freightTemp.alert = `请选择${this.freightTemp.title}`;

      // activityDesc
      if(this.isNormalGoods && this.activityDesc.value.length > 4) return this.$message.error(`普通商品促销活动描述不能超过4个字!`);

      // 对接人
      if(this.owner.value == this.HAS_OWNER && !this.ownerCode.value) return this.ownerCode.alert = `请填写${this.ownerCode.title}`;
      // vip商品对接返利检验
      if(this.isVipGoods && this.owner.value == 1){
        let arr = [this.ownerVip0Award, this.ownerVip1Award, this.ownerVip2Award, this.ownerVip3Award, this.ownerVip4Award, this.ownerVip5Award]; 

        if( arr.some(v => v.value && Number(v.value) >= 0 ? false : (this.$message.error(`${v.title}未填写或填写不正确!`), true) ) ) return ;
      }

      if(!this.validateNewPeople()) return true;
    },

    validateSigleSku(){
      // let paramArr = [ "sku", "marketprice", "price", "amount", "vip0_commission", "vip1_commission", "vip2_commission", "vip3_commission", "vip4_commission" ];
      let paramArr = [ 'basePrice', "marketprice", "price", "amount"];

      // 新人专享不显示价格
      if(this.isNewPeople){
        this.price.value = 1;
      }

      // vip商品|新人专享
      if(this.isVipGoods || this.isNewPeople){
        paramArr = paramArr.slice(0, 4);
        this.vip0_commission.value = this.vip1_commission.value = this.vip2_commission.value = this.vip3_commission.value = this.vip4_commission.value = 0;
      }

      if ( this.sku.value ? false : (this.sku.alert = `${this.sku.title}未填写或填写不正确`) ) return true;
      if ( paramArr.some(v => Number(this[v].value) > 0 ? false : (this[v].alert = `${this[v].title}未填写或填写不正确`) )) return true;
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
          { key: "价格", value: "price", custom: /^(([1-9]\d*(\.\d{1,2})?)|(0\.\d{1,2}))$/ },
          { key: "供货价", value: "supply_price", custom: /^(([1-9]\d*(\.\d{1,2})?)|(0\.\d{1,2}))$/ },
          { key: "商品标价", value: "marketprice" },
          { key: "商品编号", value: "sku", custom: /^\w+$/ },
        ];

        // 新人专享不显示价格
        if(this.isNewPeople){
          item.price = 1;
        }

        // vip商品|新人专享 |普通商品|店铺商品
        if(this.isVipGoods || this.isNewPeople || this.isNormalGoods || this.isStoreGoods){
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

        if(item.price <= 0) err = `价格未填写或填写不正确!`;
        if(item.supply_price <= 0) err = `供货价未填写或填写不正确!`;

        return err;
      });

      return err;
    },

    submit() {
      let spec = this.spec,
          goodsImg = this.goodsImg,
          imgList = this.goodsImg.value,
          classify = this.classify,
          firstSpec = this.specList[0],
          param;

      if(this.isIllegalGoods()) return ;
      this.submited = true;

      imgList = imgList.concat(this.detailImg.value);
      let img = imgList.map(v => v.raw ? `${goodsImg.cdnUrl}/${v.response.key}` : v.url);
      if (!img[0]) return console.error("img value :", img);

      param = {
        goods_image: img,
        goods_name: this.name.value,
        is_vip: Number(this.category.value == 1),
        gc_id_1: classify.value[0],
        gc_id_2: classify.value[1],
        gc_id_3: classify.value[2],
        gc_id: classify.value[2],
        goods_price: this.isSingleSku ? this.price.value : firstSpec.price,
        goods_marketprice: this.isSingleSku ? this.marketprice.value : firstSpec.marketprice,
        goods_sort: this.goods_sort.value,
        goods_advword: this.activityDesc.value,
        goods_integral: this.integral.value,
        goods_body: this.content.value,
        tag_image: this.fromImg('activityIcon'),
      };

      let skuPropArr = ["sku", "price", "marketprice", "profit", "vip0_commission", "vip1_commission", "vip2_commission", "vip3_commission", "vip4_commission"];
      if(this.isSingleSku){
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

      let firstSku = param.spec[0];
      param.supply_price = firstSku.supply_price || 0,
      param.recommended_price = firstSku.recommended_price || 0;
      // param.newcomer_price = firstSku.newcomer_price || '';

      // 运费
      param.goods_freight = this.freightType.value == 1 ? this.freight.value : '';
      param.transport_id = this.freightType.value == 2 ? this.freightTemp.value : '';

      // 对接人
      if(this.owner.value == this.HAS_OWNER){
        let ownerPropArr = ['ownerCode', 'ownerVip0Award', 'ownerVip1Award', 'ownerVip2Award', 'ownerVip3Award', 'ownerVip4Award', 'ownerVip5Award'],
            arr = ['agent_mobile', 'agent_commission_0', 'agent_commission_1', 'agent_commission_2', 'agent_commission_3', 'agent_commission_4', 'agent_commission_5'];

        ownerPropArr.forEach((prop, i) => { param[arr[i]] = this[prop].value; });

        if(this.isEdit) param.agent_id = this.detail.SKUList[0].agent_id;
      }

      this.setSales(param);
      this.setCoupon(param);
      // 新人专享
      if(this.isNewPeople) this.setNewPeople(param);

      // return console.error(img, 'about param : ', param);
      this.save(param);
    },

    async save(param) {
      // console.log("save: ", param);
      let res = !this.isEdit ? await api.addGoods(param) : await api.setGoods(this.detail.goods_commonid, param);

      if(typeof res == 'string' || res.error) this.$message.error(res.error || res);

      this.submited = false;
      // this.dialogConfig.status = 0;
      this.$emit('submit', param);
    },

    fromImg(k){
      let o = this[k],
          values = o.value;

      let arr = values.map(v => v.raw ? { url: `${o.cdnUrl}/${v.response.key}` } : v);

      return o.limit == 1 ? arr[0] ? arr[0].url : '' : arr.map(v => JSON.stringify(v));
    },

    changeCategory(index) {
      this.showStore = index == this.VIPGOODS;
      this.freightType.disabled = [1, 2].indexOf(index) !== -1 ? true : false;

      if(this.showStore){
        if(!this.store.list.length) this.getStoreList();
        this.freightType.value = 1;        
      }

      this.updateOwner(index);
      this.updateMultiSkuConfig(index);
      this.updateCoupon(index);
    },

    // Update multi sku goods
    updateMultiSku(classList, skus) {
      // console.log("update", classList, skus);
      this.classList = classList;
      this.specList = skus;
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

    async getUploadToken() {
      let res = await commonReq.getUploadToken();

      if (res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.detailImg.url = this.goodsImg.url = this.activityIcon.url = commonReq.uploadUrl;
      this.detailImg.cdnUrl = this.goodsImg.cdnUrl = this.activityIcon.cdnUrl = commonReq.cdnUrl;
      this.goodsImg.body = this.detailImg.body = this.activityIcon.body = { token: res.data, config: { useCdnDomain: true, }, };
    },

    
    preview(item){  this.img = typeof item == 'object' ? item.value : item; },
    closePreview(){ this.img = null; },
  },

  created(){
    this.getUploadToken();

    this.category.list = this.categoryList;
    this.init();
  },
}
</script>