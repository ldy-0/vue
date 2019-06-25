import api from '@/api/common';

export default {
  
  data(){
    return {
      goods_salenum: '',
      saleObj: null,
      showSaleDialog: false,
      loading: null,
    };
  },

  methods: {
    openDialog(index, item){  
      this.goods_salenum = '';
      this.saleObj = item;

      this.showSaleDialog = true; 
    },

    submitSale(){
      let loading, param;

      if(!this.goods_salenum || isNaN(Number(this.goods_salenum)) || this.goods_salenum < 0) return this.$message.error(`请输入正确的销量值`);

      loading = this.$loading();

      param = {
        rule_id: [this.saleObj.id],
        sales_num: this.goods_salenum,
      };

      this.saveSale(param, loading);
    },

    async saveSale(param, loading){

      let res = api.changeGroupSale(param);
      
      res.error ? this.$message.error(res.error) : this.$message.success('修改成功');
      
      loading.close();
      this.showSaleDialog = false;
    },

  }

}