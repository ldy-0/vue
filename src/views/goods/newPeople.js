export default {
  data(){
    return {
      USE_NEWPEOPLE: 1,
      NOT_USE_NEWPEOPLE: 2,
      showNewPeople: false, // 是否显示新人专享选项

      newPeople: { 
        title: "新人价", 
        categories: [
          { id: 1, title: '是' }, 
          { id: 2, title: "否" },
        ], 
        value: 2, 
        alert: null, 
        disabled: false,
      },

      newPeoplePrice: { type: 'positive', title: "新人价", value: "", alert: null },
    };
  },

  methods: {
    initNewPeople(o) {
      let config = this.obj,
          category = this.category,
          coupon = this.coupon,
          owner = this.owner,
          newPeople = this.newPeople,
          newPeoplePrice = this.newPeoplePrice;

      newPeople.disabled = true;
      newPeoplePrice.value = ''; 

      if(config && config.showNewPeople) this.showNewPeople = config.showNewPeople;

      let isUse = o ? o.newcomer == 1 : this.showNewPeople;

      newPeople.value = isUse ? this.USE_NEWPEOPLE : this.NOT_USE_NEWPEOPLE;
      if(isUse){
        if(this.isSingleSku){
          newPeoplePrice.value = o ? o.SKUList[0][newPeoplePrice.from] : '';
        }else{
          this.updateMultiSkuConfig(this.multiSkuConfig.NEWPEOPLE);
        }

        category.disabled = coupon.disabled = owner.disabled = true;
        category.value = this.NORMALGOODS;
        coupon.value = this.NOT_USE_COUPON;
        owner.value = this.NOT_OWNER;
      }
    },

    updateNewPeople(item) {
      let isVip = item.value === this.VIP_GOOD,
          newPeople = this.newPeople;

      newPeople.value = this.NOT_USE_NEWPEOPLE;
    },

    changeNewPeople(index) {
      let config = this.multiSkuConfig,
          newPeoplePrice = this.newPeoplePrice;

      if(this.isSingleSku){
        newPeoplePrice.value = ''; 
      }else{
        this.updateMultiSkuConfig(this.isNewPeople ? config.NEWPEOPLE : this.isNormalGoods ? config.NORMAL : this.isVipGoods ? config.VIP : config.STORE);
      }

      if(this.isAdd){
        this.owner.disabled = this.isNewPeople;
        this.owner.value = this.NOT_OWNER;
      }
    },

    validateNewPeople() {
      let newPeoplePrice = this.newPeoplePrice,
          skuList = this.specList;

      if(this.isNewPeople){
        if(this.isSingleSku){
          if(!newPeoplePrice.value) return this.$message.error(`新人价未设置!`), false;
        }else{
          let item = skuList.filter(v => !v.newPeoplePrice)[0];
          if(item) return this.$message.error(`新人价未设置!`), false;
        }
      }

      return true;
    },

    setNewPeople(o) {
      let newPeople = this.newPeople,
          newPeoplePrice = this.newPeoplePrice;

      o.newPeople = newPeople.value;

      if(this.isNewPeople){
        if(this.isSingleSku){
          
        }else{

        }
      }
    }
  },
}