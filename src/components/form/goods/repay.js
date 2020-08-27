export default {
  data(){
    return {
      REPAY: 1,
      NOT_REPAY: 2,
      showRepay: false, // 是否显示分期模块

      repay: { 
        title: "能否分期付款", 
        list: [
          { id: 1, title: '是' }, 
          { id: 2, title: "否" },
        ], 
        value: 2, 
        alert: null, 
        disabled: false,
      },

      prePayPrice: { type: 'positive', title: "分期首付", value: "", alert: null },
      repayTime: { type: 'positive', title: "分期时长", value: "", alert: null },
    };
  },

  methods: {
    initRepay(o) {
      let config = this.obj,
          category = this.category,
          store = this.store,
          repay = this.repay,
          prePayPrice = this.prePayPrice,
          repayTime = this.repayTime;

      prePayPrice.value = '';
      // 分期商品
      if(config && config.showRepay){
        this.showRepay = config.showRepay;
        // 分期商品必须是平台VIP商品
        category.disabled = store.disabled = true;
        category.value = this.VIPGOODS;
        this.changeCategory(this.VIPGOODS, true);
      }

      if(this.showRepay){
        if(this.isSingleSku){
          let firstSku = o && o.SKUList[0];
          
          repay.value = firstSku && firstSku.is_repay ? this.REPAY : this.NOT_REPAY;
          prePayPrice.value = firstSku ? firstSku.prepay_price : '';
          repayTime.value = firstSku ? firstSku.repay_day : '';
        }else{
          o.SKUList.forEach(v => v.isRepay = v.is_repay == 1 ? 1 : 2);
          this.updateMultiSkuConfig(this.multiSkuConfig.REPAY);
        }
      }

    },

    updateRepay(item) {
      let isVip = item.value === this.VIP_GOOD,
          newPeople = this.newPeople;

      newPeople.value = this.NOT_USE_NEWPEOPLE;
    },

    // 分期状态改变
    changeRepay(index) {
      let config = this.multiSkuConfig,
          prePayPrice = this.prePayPrice,
          repayTime = this.repayTime;

      if(this.isSingleSku){
        prePayPrice.value = repayTime.value = ''; 
        prePayPrice.alert = repayTime.alert = null;
      }

    },

    validateRepay() {
      let prePayPrice = this.prePayPrice,
          repayTime = this.repayTime,
          pattern = /^[1-9]\d*$/,
          skuList = this.specList;

      if(this.showRepay){
        if(this.isSingleSku){
          if(!this.isRepay) return true;
          if(isNaN(Number(prePayPrice.value)) || prePayPrice.value <= 0) return prePayPrice.alert = `${prePayPrice.title}未设置或设置不正确!`, false;
          if(!pattern.test(repayTime.value)) return repayTime.alert = `${repayTime.title}未设置或设置不正确!`, false;
        }else{
          let item = skuList.filter(v => v.isRepay == this.REPAY && (isNaN(Number(v.prepay_price)) || v.prepay_price <= 0))[0];
          if(item) return this.$message.error(`分期价未设置或设置值不正确!`), false;
          item = skuList.filter(v => v.isRepay == this.REPAY && !pattern.test(v.repay_day))[0];
          if(item) return this.$message.error(`分期时长未设置或设置值不正确!`), false;
        }
      }

      return true;
    },
    // 设置分期相关属性
    setRepay(o) {
      let repay = this.repay,
          prePayPrice = this.prePayPrice,
          repayTime = this.repayTime;

      if(this.isSingleSku){
        o.spec[0].is_repay = this.isRepay ? 1 : 0;
        o.spec[0].prepay_price = prePayPrice.value;
        o.spec[0].repay_day = repayTime.value;
      }else{
        this.specList.forEach((v, i) => {
          o.spec[i].is_repay = v.isRepay == 1 ? 1 : 0;
          o.spec[i].prepay_price = v.prepay_price;
          o.spec[i].repay_day = v.repay_day;
        });
      }

      o.is_repay = 1;
    }
  },
}