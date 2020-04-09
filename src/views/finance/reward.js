import api from '@/api/finance';

const TYPE = '奖励类型',
      METHOD = '奖励方式',
      typeArr = [
        // { title: '全部', value: 'all' },
        { title: '德分', value: 'rcblog' },
        { title: '余额', value: 'pdlog', },
        { title: '积分', value: 'pointslog', },
      ],
      methodArr = {
        rcblog: [
          { title: '全部', value: 'all', },
          { title: '销售奖', value: 'order_inviter', },
          { title: '对接奖', value: 'agent_commission', },
          { title: '红包雨奖', value: 'luckymoney', },
        ],
        pdlog: [
          { title: '全部', value: 'all', },
          { title: '分润奖', value: 'order_inviter', },
          { title: '对接奖', value: 'agent_commission', },
        ],
        pointslog: [
          { title: '全部', value: 'all', },
          { title: '销售奖', value: 'order_inviter', },
          { title: '返积分', value: 'order', },
          { title: '红包雨奖', value: 'luckymoney', },
        ],
        // default: [
        //   { title: '全部', value: 'all' },
        // ],
      }

export default {
  data(){
    return {
      rewardHeadConfig: {
        btnList: [
          { title: '导出Excel' },
        ],

        inputList: [
          { title: '', placeholder: '请输入关键字（姓名、手机号）', },
        ],

        selectList: [
          { title: TYPE, list: typeArr, },
          { title: METHOD, list: methodArr.rcblog, },
        ],
        statusList: ['rcblog', 'all'],

        dateList: [
          { title: '选择日期', value: [], width: '400px', },
        ],
      },

      rewardTableConfig: {
        loading: false,
        classList: [
          { key: '下单时间', value: 'create_time', },
          { key: '头像', value: 'member_avatar', isAvatar: true, },
          { key: '昵称', value: 'member_truename', },
          { key: '姓名', value: 'member_nick', },
          { key: '手机号', value: 'member_mobile', },
          { key: TYPE, value: 'model', },
          { key: METHOD, value: 'type', },
          { key: '金额', value: 'amount', },
        ],
      },

      sum: 0,
    };
  },

  methods: {
    async exportReward(){
      let header, data, list, 
          classList = this.tableConfig.classList,
          filename = `奖励列表`,
          loading = this.$loading({ text: '正在导出......' }); 
      
      let query = JSON.parse(JSON.stringify(this.query));
      query.limit = this.total;
      let res = await api.getRewardList(query);

      if(typeof res === 'string' || !res || res.error) return this.handleRewardError(res ? res.moreInfo || res : '获取奖励列表失败', loading);

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

    handleRewardHeadEmit(index){
      // 
      if(index == 0) this.exportReward();
    },

    handleRewardTableEmit(item, index){
      // 
      if(index == 0) this.importReward(item);
    },

    async changeRewardStatus(item, index){
      let param = { status: index ? 0 : 1 };
      return console.error('change status: ', param);

      let res = await api.changeTransport(item.transport_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

      this.getList();
    },

    // async deleteReward(item){
    //   return console.error(item);
    //   let res = await api.deleteTransport(item.transport_id);

    //   res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

    //   this.getRewardList();
    // },

    async getRewardList() {
      this.tableConfig.loading = true

      let res = await api.getRewardList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : this.getListErrorTip);

      if(res && res.data){
        res.data.list.forEach(this.format);

        this.list = res.data.list || [];
        this.sum = res.data.sum;
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    formatReward(v){
      let arr = ['退款'];

      if(arr.indexOf(v.model) !== -1) v.amount = `-${v.amount}`;
    },

    // immutable
    showReward(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getRewardList();
    },

    initRewardType(type){
      let selectList = this.headConfig.selectList,
          statusList = this.headConfig.statusList;

      // type change
      if(this.query.model && this.query.model !== type) statusList[1] = 'all';

      if(!type) type = 'rcblog';

      selectList[1].list = methodArr[type];
    },

    handleRewardError(err, loading){
      loading.close(); 
      
      this.$message.error(err);
    },

    // mockReward(){
    //   let img = 'https://cdn.health.healthplatform.xyz/Fj2MUuTZ5UvAG0LqSFBcI__J1U2D';

    //   let list = [
    //     { id: 1, name: 'vip1', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 1, img: img, arr: ['1', '2'], },
    //     { id: 2, name: 'vip2', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 0, img: img, arr: ['1', '2'], },
    //   ];

    //   list.forEach(this.format);
    //   this.list = list;
    //   this.total = list.length;
    // },

  },

}