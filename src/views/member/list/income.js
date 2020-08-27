import api from '@/api/member';

export default {

  data(){
    return {
      incomeHeadConfig: {
        status: null,
        selectLabel: '类型',
        categories: [
          { id: 1, name: '余额明细' },
          { id: 2, name: '互转德分明细' },
          { id: 3, name: '互转德分充值明细' },
          { id: 4, name: '消费德分明细' },
          { id: 5, name: '消费德分充值明细' },
          // { id: 6, name: '积分明细' },
          { id: 7, name: '资产明细' },
        ]
      },
      incomeTableConfig: {
        classList: [
          { key: '描述', value: 'desc', },
          { key: '金额', value: 'price', },
          { key: '时间', value: 'time', },
        ],
      },
      incomeParam: {},
      incomeList: [],
      incomeTotal: 10,
      incomeLoading: false,
    };
  },

  methods: {
    incomeSearch(param){
      let classList = this.incomeTableConfig.classList;
      
      this.incomeParam.page = 1;
      this.incomeHeadConfig.status = this.incomeParam.status = param.status;

      if(param.status > 1 && classList.length == 3) classList.push({ key: '操作者', value: 'admin_name', });

      if([1, 7].indexOf(param.status) !== -1 && classList.length == 4) classList.pop();

      this.$refs.incomeTable.init();

      this.getIncomeList(true);
    },

    incomeFormat(item){
      item.time = item.lg_addtime || item.rcblog_addtime || item.log_addtime;
      item.price = item.lg_av_amount || item.recharge_amount || item.available_amount;
      item.desc = item.lg_desc || item.rcblog_description || item.log_description;
    },

    incomeChange(param){
      this.incomeParam.limit = param.limit;
      this.incomeParam.page = param.page;
      this.getIncomeList();
    },

  },

}