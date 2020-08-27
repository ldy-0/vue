import api from '@/api/member';

export default {

  data(){
    return {
      remarkItem: null,
      remark: { type: 'string', title: '备注', value: '', alert: null, },
    };
  },

  methods: {

    openRemarkDialog(item){
      let aValidate = ['remark'],
          tableConfig = this.tableConfig;

      aValidate.forEach(v => {
        this[v].value = '';
        this[v].alert = null;
      });

      // this.showDialog = true;
      this.dialogConfig.status = tableConfig.REMARK;

      this.remark.value = item.member_remark;

      this.remarkItem = item;

    },

    submitRemark(){
      let aValidate = ['remark'];

      this.validate(aValidate);

      if(aValidate.some(v => this[v].alert)) return ;

      let loading = this.$loading({ text: '正在提交...' });

      let param = {
        type: 'member_remark',
        member_remark: this.remark.value,
      };

      this.saveRemark(param, loading);
    },

    validate(arr){
      let remark = this.remark,
          item = this.remarkItem;

      arr.forEach(v => {
        if(!this[v].value) this[v].alert = `请输入${this[v].title}`;
      });

      // if(remark.value > item.order_amount) remark.alert = `退款支付金额不能大于${item.order_amount}`;
    },

    async saveRemark(param, loading){
      let res = await api.changeStatus(this.remarkItem.member_id, param);

      if(res && res.data){
        this.$message.success('操作成功');
      }

      if(typeof res == 'string' || res.error) this.$message.error(res.error || res);
      
      loading.close();
      // this.showDialog = false;
      this.dialogConfig.status = 0;

			this.getList()
    },

    closeRemarkDialog(){
      this.dialogConfig.status = 0;
    }

  },

}