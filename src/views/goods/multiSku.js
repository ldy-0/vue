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
    
  },
}