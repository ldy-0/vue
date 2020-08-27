import api from '@/api/finance';

const TYPE = '交易类型',
      METHOD = '交易方式',
      typeArr = [
        // { title: '全部', value: 'all' },
        { title: '平台充值', value: 'recharge' },
        { title: '用户充值', value: 'recharge_order' },
        { title: '支付', value: 'order', },
        { title: '退款', value: 'refund' },
      ],
      methodArr = {
        order: [
          { title: '全部', value: 'all', },
          { title: '现金支付', value: 'order', },
          { title: '消费德分', value: 'rcblog', },
          { title: '余额', value: 'pdlog', },
          { title: '积分', value: 'pointslog', },
          { title: '优惠卷抵扣', value: 'coupon' },
        ],
        refund: [
          { title: '全部', value: 'all', },
          { title: '现金支付', value: 'refund', },
          { title: '余额', value: 'pdlog', },
          { title: '积分', value: 'pointslog', },
        ],
        recharge: [
          { title: '全部', value: 'all', },
          { title: '互转德分', value: 'recharge', },
          { title: '消费德分', value: 'available_recharge', },
        ],
        recharge_order: [
          { title: '全部', value: 'all' },
        ],
      }

export default {
  data(){
    return {
      dealHeadConfig: {
        btnList: [
          { title: '导出Excel' },
        ],

        inputList: [
          { title: '', placeholder: '请输入关键字（姓名、手机号）', },
          // { title: '', placeholder: '汇总额', width: '150px', },
        ],

        selectList: [
          { title: TYPE, list: typeArr, },
          { title: METHOD, list: methodArr.order, },
        ],
        statusList: ['order', 'all'],

        dateList: [
          { title: '选择日期', value: [], width: '400px', },
        ],
      },

      dealTableConfig: {
        loading: false,
        showOperate: false,
        btnList: [
          // { type: 'danger', key: 'id', value: '删除', },
        ],
        classList: [
          { key: '订单号', value: 'order_sn', },
          { key: '下单时间', value: 'create_time', },
          { key: '头像', value: 'member_avatar', isAvatar: true, },
          { key: '昵称', value: 'member_truename', },
          { key: '姓名', value: 'member_nick', },
          { key: '手机号', value: 'member_mobile', },
          { key: TYPE, value: 'model', },
          { key: METHOD, value: 'type', },
          { key: '金额', value: 'amount', },
          { key: '操作人', value: 'admin_name', },
        ],
      },

      sum: 0,
    };
  },

  methods: {
    async exportDeal(){
      let header, data, list, 
          classList = this.tableConfig.classList,
          filename = `交易列表`,
          loading = this.$loading({ text: '正在导出......' }); 
      
      let query = JSON.parse(JSON.stringify(this.query));
      query.limit = this.total;
      let res = await api.getDealList(query);

      if(typeof res === 'string' || !res || res.error) return this.handleDealError(res ? res.moreInfo || res : '获取交易列表失败', loading);

      if(res && res.data){
        list = res.data.list;

        list.forEach(this.format);

        header = classList.map(v => v.key);
        data = list.map(v => classList.map(v1 => v[v1.value]));
        console.error(data);

        this.toExcel({ header, data, filename, autoWidth: true, });
      }

      loading.close();
    },

    handleDealHeadEmit(index){
      // 
      if(index == 0) this.exportDeal();
    },

    handleDealTableEmit(item, index){
      // 
      if(index == 0) this.importDeal(item);
    },

    async changeDealStatus(item, index){
      let param = { status: index ? 0 : 1 };
      return console.error('change status: ', param);

      let res = await api.changeTransport(item.transport_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

      this.getList();
    },

    // async deleteDeal(item){
    //   return console.error(item);
    //   let res = await api.deleteTransport(item.transport_id);

    //   res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

    //   this.getDealList();
    // },

    async getDealList() {
      this.tableConfig.loading = true

      let res = await api.getDealList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : this.getListErrorTip);

      if(res && res.data){
        res.data.list.forEach(this.format);

        this.list = res.data.list || [];
        this.sum = res.data.sum;
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    formatDeal(v){
      let arr = ['退款'];

      // if(v.type == '积分') v.amount = (v.amount / 10).toFixed(2);
      v.admin_name = v.admin_name || v.member_nick;

      if(arr.indexOf(v.model) !== -1) v.amount = `-${v.amount}`;
    },

    // immutable
    showDeal(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getDealList();
    },

    initDealType(type){
      let selectList = this.headConfig.selectList,
          statusList = this.headConfig.statusList;

      // type change
      if(this.query.model && this.query.model !== type) statusList[1] = 'all';

      if(!type) type = 'order';

      selectList[1].list = methodArr[type];
    },

    handleDealError(err, loading){
      loading.close(); 
      
      this.$message.error(err);
    },

    mockDeal(){
      let img = 'https://cdn.health.healthplatform.xyz/Fj2MUuTZ5UvAG0LqSFBcI__J1U2D';

      let list = [
        { id: 1, name: 'vip1', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 1, img: img, arr: ['1', '2'], },
        { id: 2, name: 'vip2', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 0, img: img, arr: ['1', '2'], },
      ];

      list.forEach(this.format);
      this.list = list;
      this.total = list.length;
    },

  },

}