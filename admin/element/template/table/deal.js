const typeArr = [
        { title: '全部', value: -1 },
        { title: '平台充值', value: 0, },
        { title: '支付', value: 1, },
        { title: '退款', value: 2, },
      ],
      methodArr = [
        { title: '全部', value: -1 },
        { title: '现金支付', value: 0, },
        { title: '消费德分', value: 1, },
        { title: '互转德分', value: 2, },
        { title: '积分', value: 3, },
        { title: '余额', value: 4, },
        { title: '优惠卷抵扣', value: 5, },
      ];

export default {
  data(){
    return {
      dealHeadConfig: {
        btnList: [
          { title: '导出Excel' },
        ],

        inputList: [
          { title: '', placeholder: '请输入关键字（姓名、手机号）', },
          { title: '', placeholder: '汇总额', width: '150px', },
        ],

        selectList: [
          { title: '交易类型', list: typeArr, },
          { title: '交易方式', list: methodArr, },
        ],
        statusList: [-1, -1],

        dateList: [
          { title: '选择日期', value: [], width: '400px', },
        ],
      },

      dealTableConfig: {
        loading: false,
        showOperate: true,
        btnList: [
          // { type: 'danger', key: 'id', value: '删除', },
        ],
        classList: [
          { key: '头像', value: 'img', isAvatar: true, },
          { key: '昵称', value: 'name', },
          { key: '姓名', value: 'name', },
          { key: '手机号', value: 'mobile', },
          { key: '地址', value: 'area', },
          { key: '分组', value: 'group', },
        ],
      },
      // dealList: [],
      // dealTotal: 0,
      // dealQuery: {
      //   page: 1,
      //   limit: 10,
      // },

    };
  },

  methods: {
    importDeal(){
      console.error('import--');
    },

    handleDealHeadEmit(index){
      // 
      if(index == 0) this.importDeal();
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

    async deleteDeal(item){
      return console.error(item);
      let res = await api.deleteTransport(item.transport_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

      this.getDealList();
    },

    async getDealList() {
      return this.mockDeal();
      this.tableConfig.loading = true

      let res = await api.getTransportList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : this.getListErrorTip);

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    // immutable
    showDeal(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getDealList();
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