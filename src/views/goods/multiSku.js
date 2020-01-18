export default {
  data(){
    return {
      multiSkuConfig: {
        addable: true,
        deletable: true,
        attributeList: [],
      },

      publicGoodsAttributeList: [
        { key: '商品编号', value: 'sku' },
        { key: '价格(元)', value: 'price' },
        { key: '标价(元)', value: 'marketprice' },
        { key: '库存', value: 'count' },
        { key: '体验代理佣金', value: 'vip0_commission' },
        { key: 'VIP1佣金', value: 'vip1_commission' },
        { key: 'VIP2佣金', value: 'vip2_commission' },
        { key: 'VIP3佣金', value: 'vip3_commission' },
        { key: 'VIP4佣金', value: 'vip4_commission' },
      ],

      vipGoodsAttributeList: [
        { key: '商品编号', value: 'sku' },
        { key: '价格(元)', value: 'price' },
        { key: '标价(元)', value: 'marketprice' },
        { key: '供货价(元)', value: 'supply_price', },
        { key: '建议零售价(元)', value: 'recommended_price', },
        { key: '库存', value: 'count' },
      ],

      storeGoodsAttributeList: [
        { key: '商品编号', value: 'sku' },
        { key: '价格(元)', value: 'price' },
        { key: '标价(元)', value: 'marketprice' },
        { key: '供货价(元)', value: 'supply_price', disabled: true, },
        { key: '建议零售价(元)', value: 'recommended_price', disabled: true, },
        { key: '库存', value: 'count', disabled: true, },
        { key: '体验代理佣金', value: 'vip0_commission' },
        { key: 'VIP1佣金', value: 'vip1_commission' },
        { key: 'VIP2佣金', value: 'vip2_commission' },
        { key: 'VIP3佣金', value: 'vip3_commission' },
        { key: 'VIP4佣金', value: 'vip4_commission' },
      ],

    }
  },

  methods: {
    updateMultiSkuConfig(index){
      let config = this.multiSkuConfig;

      config.addable = config.deletable = true;
      config.attributeList = index == 1 ? this.vipGoodsAttributeList : this.publicGoodsAttributeList; 

      // 店铺商品
      if(index == 2){
        config.addable = config.deletable = false;
        config.attributeList = this.storeGoodsAttributeList;
      }
      
    },

    encodeSingleSku(skuPropArr){
      let o = {
            supply_price: this.basePrice.value || 0,
            recommended_price: this.recommendPrice.value || 0,
            stock: this.amount.value,
            spec_attr: "",
            sp_value: null,
          };

      skuPropArr.forEach(prop => (o[prop] = this[prop].value));

      if(this.dialogConfig.status == 2) o.goods_id = this.detail.SKUList[0].goods_id;

      return [o];
    },

    encodeMultiSku(skuPropArr){
      let spec_name = {},
        spec_value = {},
        status = this.dialogConfig.status;

      this.classList.forEach((v, i) => {
        let o = {};
        v.skus.forEach((sku, skuIndex) => (o[skuIndex] = sku.name));
        spec_value[i] = o;
      });
      this.classList.forEach((v, i) => (spec_name[i] = v.name));

      let spec = this.specList.map(v => {
        let o = {};

        skuPropArr.forEach(prop => (o[prop] = v[prop]));

        o.spec_attr = v.index.join("_");
        o.sp_value = this.formatName(v.name);
        o.stock = v.count;

        o.profit = v.profit || 0;
        o.supply_price = v.supply_price || 0;
        o.recommended_price = v.recommended_price || 0;

        if(status == 2) o.goods_id = v.goods_id;

        return o;
      });

      return [spec_name, spec_value, spec];
    },

  },
}