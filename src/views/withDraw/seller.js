import api from '@/api/withDraw';
import commonReq from '@/api/common' 

export default {
  data(){
    return {
      sellerHeadConfig: {
        // btnList: [],

        inputList: [
          { title: '', placeholder: '请输入店铺名称', },
        ],

        dateList: [
          { title: '选择日期', width: '400px', },
        ],

        selectList: [
          { title: '状态', list: [] },
        ],
        statusList: [-1],

        switchList: [
          { title: '提供发票', value: false, },
        ],

      },

      sellerImg: { title: '活动图片', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {}, limit: 1, tip: '*活动图片不超过100Kb' },
      // sellerMoney: { type: 'positive', title: '提现金额', value: '', alert: null, },

      sellerTableConfig: {
        loading: false,
        showOperate: true,
        classList: [
          { key: '图片', value: 'storeAvatar', isImg: true, },
          { key: '店铺名称', value: 'storeName', },
          { key: '用户名', value: 'contacts_name', },
          { key: '联系方式', value: 'contacts_phone', },
          { key: '银行账号', value: 'account', },
          { key: '金额', value: 'toc_amount', },
          { key: '申请时间', value: 'toc_addtime', },
          { key: '单位性质', value: 'companyTypeStr', },
          { key: '状态', value: 'stateStr', },
        ],
        btnList: [
          { key: 'toc_id', value: '详情' },
          { key: 'isAuthing', value: '同意', isConfirm: true, },
          // { key: 'pdc_id', value: '拒绝' },
          { key: 'isAuthing', value: '备注', isConfirm: true, },
        ],
      },

      sellerStateList: [
        { title: '全部', value: -1, },
        { title: '未完成', value: 0, },
        { title: '已完成', value: 1, },
        { title: '已拒绝', value: 2, },
      ],
      sellerStateMap: {
        0: '未完成',
        1: '已完成',
        2: '已拒绝',
      },

      companyTypeList: [
        { title: '-', value: 0, },
        { title: '个体户', value: 1, },
        { title: '一般纳税人', value: 2, },
        { title: '小规模纳税人', value: 3, },
      ],

      sellerWithdraw: {
        show: false,
        list: [
          { title: '店铺图片', value: '', key: 'storeAvatar', type: 'img', style: { width: '100px', height: '80px' }, },
          { title: '店铺名称', value: '', key: 'storeName', },
          { title: '联系人', value: '', key: 'contacts_name', },
          { title: '联系方式', value: '', key: 'contacts_phone', },
          { title: '开户银行', value: '', key: 'bankName', },
          { title: '银行账号', value: '', key: 'account', },
          { title: '申请时间', value: '', key: 'toc_addtime', },
          { title: '金额', value: '1000', key: 'toc_amount', },
          { title: '状态', value: '', key: 'stateStr', },
          { title: '发票', value: '', key: 'toc_invoice', type: 'img', style: { width: '100px', height: '80px' }, },
        ],
      },
      
    };
  },

  methods: {
    // async exportSeller(){
    //   let header, data, list, 
    //       classList = this.tableConfig.classList,
    //       filename = `奖励列表`,
    //       loading = this.$loading({ text: '正在导出......' }); 
      
    //   let query = JSON.parse(JSON.stringify(this.query));
    //   query.limit = this.total;
    //   let res = await api.getWithdrawList(query);

    //   if(typeof res === 'string' || !res || res.error) return this.handleSellerError(res ? res.moreInfo || res : '获取奖励列表失败', loading);

    //   if(res && res.data){
    //     list = res.data.list;

    //     list.forEach(this.format);

    //     header = classList.map(v => v.key);
    //     data = list.map(v => classList.map(v1 => v[v1.value]));
    //     console.error(data);

    //     this.toExcel({ header, data, filename, autoWidth: true, });
    //   }

    //   loading.close();
    // },

    handleSellerHeadEmit(index){
      // add
      // if(index == 0) this.openDialog(1);
    },

    handleSellerTableEmit(item, index){
      this.detail = item;

      // detail 
      if(index == 0) this.openWithdrawDialog(item);

      // state
      if([1].indexOf(index) !== -1) this.changeSellerStatus(item, index);

      // remark 
      if(index == 2) this.openRemarkDialog(item);
    },

    openWithdrawDialog(){ 
      this.sellerWithdraw.list.forEach(v => v.value = this.detail[v.key]);

      this.sellerWithdraw.show = true; 
    },
    closeWithdrawDialog(){ this.sellerWithdraw.show = false; },

    openRemarkDialog(item){
      let remark = this.remark.remark;

      this.dialogConfig.status = 3; 

      remark.value = item.toc_remark || '';
      remark.alert = null;
    },

    initSellerDialog(item){
      let arr = [];

      if(typeof item == 'object'){
        this.detail = item;

        arr.forEach(v => { this[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }else{
        this.detail = null;

        arr.forEach(v => { this[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }

    },

    async submitSeller(){
      let status = this.dialogConfig.status,
          imgList = this.sellerImg.value,
          param;

      // remark
      if(status == 3) return this.changeSellerStatus(this.detail, 'remark');

      if(this.validSellerError()) return ;

      let loading = this.$loading({ text: '提交中...', });

      let img = imgList.map(v => { return v.raw ? `${this.sellerImg.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        activity_title: this.sellerTitle.value,
        activity_image: img[0],
        activity_content: this.sellerDesc.value,
      };

      this.saveSeller(param, loading);
    },

    async saveSeller(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addSeller(param) : await api.setSeller(this.detail.activity_id, param);

      if(typeof res == 'string' || !res || res.error) return this.handleSellerError(res ? res.error || res : '提交分享信息失败', loading);

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      loading.close();
    },

    validSellerError(){
      let arr = ['sellerDesc', 'sellerTitle', 'sellerImg'];

      for(let i = arr.length - 1; i >= 0; i--){
        let item = this[arr[i]];

        if(typeof item.value == 'object' && !item.value[0]) return item.alert = `${item.title}不能为空`;

        if(typeof item.value == 'string' && !item.value) return item.alert = `${item.title}不能为空`;

        if(item.alert) return true;
      }
    },

    /* api */
    async changeSellerStatus(item, index){
      let remark = this.remark.remark;

      if(index == 'remark'){
        if(!remark.value) return remark.alert = `${remark.title}不能为空!`;
      }

      let loading = this.$loading({ text: '正在更新状态...' });

      let res = index == 'remark' ? await api.changeSellerWithdrawState(item.toc_id, { refuse: 1, remark: remark.value })
                                  : await api.changeSellerWithdrawState(item.toc_id, {});

      res.status == 0 ? this.$message.success(this.successTip) : this.handleSellerError(res ? res.error || res : '修改状态失败');

      this.dialogConfig.status = 0;
      loading.close();
      this.getList();
    },

    async deleteSeller(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteSeller(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleSellerError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getSellerList();
    },

    async getSellerInvoice() {
      let invoice = this.sellerHeadConfig.switchList[0],
          res = await api.getStoreInvoice();
      if(typeof res == 'string' || !res || res.error) return this.handleSellerError(res ? res.error || res : '获取发票信息失败');

      if(res && res.data){
        invoice.value = res.data == 1 ? true : false;
      }
    },

    async setSellerInvoice() {
      let invoice = this.sellerHeadConfig.switchList[0],
          res = await api.setStoreInvoice({ value: invoice.value ? 1 : 0, });
      if(typeof res == 'string' || !res || res.error) return this.handleSellerError(res ? res.error || res : '修改发票信息失败');

      if(res && res.data){
        this.$message.success(`修改成功!`);
        this.getSellerInvoice();
      }
    },

    async getSellerList() {
      this.tableConfig.loading = true;

      let res = await api.getSellerWithdrawList(this.query);

      // if(typeof res == 'string' || !res || res.error) return this.handleSellerError(res ? res.error || res : '获取活动列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },

    formatSeller(v){
      try{
      }catch(e){ console.error(e.message); }

      v.storeAvatar = v.store.store_avatar;
      v.storeName = v.store.store_name;
      v.contacts_name = v.store.contacts_name;
      v.contacts_phone = v.store.contacts_phone;
      v.account = v.toc_bank_no;
      v.bankName = v.store.bank_name;

      // 单位性质
      let res = this.companyTypeList.filter(vv => vv.value == v.taxpayer)[0];
      v.companyTypeStr = res ? res.title : '-';

      // 提现状态
      v.stateStr = this.sellerStateMap[v.toc_payment_state];
      v.isAuthing = v.toc_payment_state == 0;
    },

    // immutable
    showSeller(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getSellerList();
    },

    // util
    handleSellerError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

  },

  created(){
    this.sellerHeadConfig.selectList[0].list = this.sellerStateList;
  }

}