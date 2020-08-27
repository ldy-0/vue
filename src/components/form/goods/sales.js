export default {
  data(){
    return {
      // goods_salenum
      sales: { type: 'integer', title: "销量", value: 0, from: 'goods_faker_salenum', to: 'goods_faker_salenum', alert: null, disabled: false, },
    };
  },

  methods: {
    initSales(o) {
      let config = this.obj,
          sales = this.sales;

      sales.alert = sales.disabled = false;
      sales.value = '';

      sales.value = o ? o[sales.from] : '';
      if(this.isSingleSku){
        // sales.value = o ? o.SKUList[0][sales.from] : '';
      }else{
        // this.updateMultiSkuConfig(this.multiSkuConfig.NEWPEOPLE);
      }
    },

    updateSales(item) {
      let isVip = item.value === this.VIP_GOOD;
          
    },

    validateSales() {
      let sales = this.sales,
          pattern = /^\d+(\.\d{1,2})?$/,
          skuList = this.specList;

      if(this.isSingleSku){
        // if(!sales.value) return sales.alert = `销量未设置!`, false;
      }else{
        // let item = skuList.filter(v => !pattern.test(v.newcomer_price))[0];
        // if(item) return this.$message.error(`新人价未设置或设置值不正确!`), false;
      }

      return true;
    },

    setSales(o) {
      let sales = this.sales;
          
      o[sales.to] = sales.value;
      // if(this.isSingleSku){
      //   o.spec[0][sales.to] = sales.value;
      // }else{
      //   this.specList.forEach((v, i) => o.spec[i][sales.to] = v[sales.to]);
      // }
    }
  },
}