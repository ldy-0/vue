import api from '@/api/withDraw';
import commonReq from '@/api/common' 

export default {
  data(){
    return {
      dscoreHeadConfig: {
        btnList: [
          { title: '设置',  },
        ],

        inputList: [
          { title: '', placeholder: '请输入手机号', },
        ],

        dateList: [
          { title: '选择日期', width: '400px', },
        ],

        selectList: [
          { title: '状态', list: [] },
          { title: '账户类别', list: [] },
        ],
        statusList: [-1, -1],

      },

      dscore: {
        title: '设置',
        max:      { title: '当天限额最大值', value: '', type: 'positive', alert: null, width: '120px', from: 'day_max', },
        multiple: { title: '起提倍数', value: '', custom: { pattern: /^([1-9]\d{0,1}|100)$/, alert: '起提倍数在1-100之间', }, alert: null, width: '120px', from: 'multiple', },
        start:    { title: '起提数值', value: '', custom: { pattern: /^[1-9]\d{1,}$/, alert: '起提数值必须大于10', }, alert: null, width: '120px', from: 'min', },
        fee:      { title: '手续费', value: '', custom: { pattern: /^(\d{1,2}(\.\d{0,2})?|100)$/, alert: '手续费在0-100之间', }, alert: null, width: '120px', from: 'ratio', },
      },

      dscoreImg: { title: '活动图片', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {}, limit: 1, tip: '*活动图片不超过100Kb' },
      // dscoreMoney: { type: 'positive', title: '提现金额', value: '', alert: null, },

      dscoreTableConfig: {
        loading: false,
        showOperate: true,
        classList: [
          { key: '日期', value: 'rcbc_addtime', },
          { key: '头像', value: 'avatar', isAvatar: true, },
          { key: '昵称', value: 'nickName', },
          { key: '姓名', value: 'accountName', },
          { key: '账户', value: 'account', },
          { key: '账户类型', value: 'typeStr', },
          { key: '联系方式', value: 'mobile', },
          { key: '实际德分', value: 'arrival_amount', },
          { key: '可提现德分', value: 'total_amount', },
          { key: '状态', value: 'stateStr', },
        ],
        btnList: [
          { key: 'rcbc_id', value: '详情' },
          { key: 'isAuthing', value: '处理', isConfirm: true, },
          { key: 'isAuthing', value: '拒绝', type: 'danger', },
        ],
      },

      dscoreStateList: [
        { title: '全部', value: -1, },
        { title: '审核中', value: 0, },
        { title: '已完成', value: 1, },
        { title: '已拒绝', value: 2, },
      ],
      dscoreStateMap: {
        0: '审核中',
        1: '已完成',
        2: '已拒绝',
      },

      typeList: [
        { id: -1, title: '全部' },
        { id: 1, title: '银行卡' },
        { id: 2, title: '支付宝' },
        { id: 3, title: '微信' },
      ],
      dscoreTypeMap: {
        1: '银行卡',
        2: '支付宝',
        3: '微信',
      },

      dscoreWithdraw: {
        show: false,
        list: [
          { title: '头像', value: '', key: 'avatar', type: 'img', style: { width: '100px', height: '80px' }, },
          { title: '昵称', value: '', key: 'nickName', },
          { title: '姓名', value: '', key: 'accountName', },
          { title: '联系方式', value: '', key: 'mobile', },
          { title: '银行卡号', value: '', key: 'rcbc_bank_no', },
          { title: '开户银行', value: '', key: 'rcbc_bank_name', },
          { title: '提现德分', value: '', key: 'rcbc_amount', },
          { title: '实际德分', value: '', key: 'arrival_amount', },
          { title: '可提现德分', value: '', key: 'total_amount', },
          { title: '申请时间', value: '', key: 'rcbc_addtime', },
          { title: '状态', value: '', key: 'stateStr', },
        ],
      },
      
    };
  },

  methods: {
    async exportDscore(){
      let header, data, list, 
          classList = this.tableConfig.classList,
          filename = `奖励列表`,
          loading = this.$loading({ text: '正在导出......' }); 
      
      let query = JSON.parse(JSON.stringify(this.query));
      query.limit = this.total;
      let res = await api.getDscoreWithdrawList(query);

      if(typeof res === 'string' || !res || res.error) return this.handleDscoreError(res ? res.moreInfo || res : '获取奖励列表失败', loading);

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

    handleDscoreHeadEmit(index){
      // setting
      if(index == 0) this.openSettingDialog();
    },

    handleDscoreTableEmit(item, index){
      this.detail = item;

      // detail 
      if(index == 0) this.openDscoreWithdrawDialog(item);

      // state
      if([1, 2].indexOf(index) !== -1) return this.changeDscoreStatus(item, index);

    },

    openSettingDialog(){ 
      this.dialogConfig.status = 4;

      this.getDscore();
    },

    openDscoreWithdrawDialog(item){
      this.dscoreWithdraw.list.forEach(v => v.value = item[v.key]);
      this.dscoreWithdraw.show = true;
    },
    closeDscoreWithdrawDialog(){ this.dscoreWithdraw.show = false; },

    openRemarkDialog(item){
      let remark = this.remark.remark;

      this.dialogConfig.status = 3; 

      remark.value = '';
      remark.alert = null;
    },

    initDscoreDialog(item){
      let arr = [];

      if(typeof item == 'object'){
        this.detail = item;

        arr.forEach(v => { this[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }else{
        this.detail = null;

        arr.forEach(v => { this[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }

    },

    async submitDscore(){
      let status = this.dialogConfig.status,
          imgList = this.dscoreImg.value,
          param;

      // remark
      if(status == 3) return this.changeDscoreStatus(this.detail, 'remark');

      if(this.validDscoreError()) return ;

      let loading = this.$loading({ text: '提交中...', });

      // let img = imgList.map(v => { return v.raw ? `${this.dscoreImg.cdnUrl}/${v.response.key}` : v.url });
      // if(!img[0]) return console.error('img value :', img);

      param = {
        day_max: this.dscore.max.value,
        multiple: this.dscore.multiple.value,
        min: this.dscore.start.value,
        ratio: this.dscore.fee.value,
      };

      this.saveDscore(param, loading);
    },

    async saveDscore(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.setDscoreWithdraw(param) : await api.setDscoreWithdraw(param);

      if(typeof res == 'string' || !res || res.error) return this.handleDscoreError(res ? res.error || res : '提交分享信息失败', loading);

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      loading.close();
    },

    validDscoreError(){
      let o = this.dscore,
          arr = ['fee', 'start', 'multiple', 'max'];

      for(let i = arr.length - 1; i >= 0; i--){
        let item = o[arr[i]];

        if(typeof item.value == 'object' && !item.value[0]) return item.alert = `${item.title}不能为空`;

        if(typeof item.value == 'string' && !item.value) return item.alert = `${item.title}不能为空`;

        if(item.alert) return true;
      }
    },

    /* api */
    async getDscore(){
      let dscore = this.dscore,
          res = await api.getDscoreWithdraw();

      if(typeof res == 'string' || !res || res.error) return this.handleDscoreError(res ? res.error || res : '获取德分提现设置失败');

      ['max', 'multiple', 'start', 'fee'].forEach(v => dscore[v].value = res.data[dscore[v].from]);
    },

    async changeDscoreStatus(item, index){
      let param = {},
          remark = this.remark.remark;
      
      // 拒绝
      if(index == 2) param.refuse = 1;

      if(index == 'remark'){
        if(!remark.value) return remark.alert = `${remark.title}不能为空!`;
      }

      let loading = this.$loading({ text: '正在更新状态...' });

      let res = index == 'remark' ? await api.addDscoreWithdrawRemark(item.pdc_id, { value: remark.value })
                                  : await api.changeDscoreWithdrawState(item.rcbc_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleDscoreError(res ? res.error || res : '修改状态失败');

      loading.close();
      this.getList();
    },

    async deleteDscore(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteDscore(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleDscoreError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getDscoreList();
    },

    async getDscoreList() {
      this.tableConfig.loading = true;

      let res = await api.getDscoreWithdrawList(this.query);

      if(typeof res == 'string' || !res || (res.error && res.error !== 'ok')) return this.handleDscoreError(res ? res.error || res : '获取德分提现列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false;
    },    

    formatDscore(v){
      try{
        v.avatar = v.member.member_avatar;
        v.name = v.member.member_nick;
        v.nickName = v.member.member_truename;
        v.mobile = v.member.member_mobile;
        v.total_amount = v.member.recharge_rc_balance;
      }catch(e){ console.error(e.message); }
      
      // 账户类型
      v.typeStr = this.dscoreTypeMap[v.rcbc_type];
      v.account = v.rcbc_account || v.rcbc_bank_no;
      v.accountName = v.rcbc_account_name || v.rcbc_bank_user;

      // 提现状态
      v.stateStr = this.dscoreStateMap[v.rcbc_payment_state];
      v.isAuthing = v.rcbc_payment_state == 0;
    },

    // util
    handleDscoreError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

  },

  created(){
    this.dscoreHeadConfig.selectList[0].list = this.dscoreStateList;
    this.dscoreHeadConfig.selectList[1].list = this.typeList;
  }

}