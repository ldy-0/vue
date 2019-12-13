import api from '@/api/store';
import commonReq from '@/api/common' 

export default {
  data(){
    return {
      checkHeadConfig: {
        btnList: [
          // { title: '上传活动' },
        ],

        inputList: [
          { title: '', placeholder: '请输入店铺名称或手机号码', },
        ],

        selectList: [
          { title: '主营', list: [], },
        ],
        statusList: [-1],

        dateList: [
          { title: '选择日期', width: '400px' },
        ],

      },

      checkImg: { title: '活动图片', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {}, limit: 1, tip: '*活动图片不超过100Kb' },
      checkTitle: { type: 'string', title: '活动标题', value: '', alert: null, },
      checkDesc: { title: '活动内容', value: '', alert: null, },

      checkTableConfig: {
        loading: false,
        showOperate: true,
        classList: [
          { key: '排序序号', value: 'store_sort', },
          { key: 'Logo图', value: 'store_avatar', isImg: true, },
          { key: '店铺名', value: 'store_name', },
          { key: '主营', value: 'store_class', },
          { key: '创建时间', value: 'store_time', },
          { key: '联系人', value: 'contacts_name', },
          { key: '联系方式', value: 'contacts_phone', },
          { key: '证件', value: 'identity', },
          { key: '上架商品', value: 'online', },
          { key: '销量', value: 'store_sales', },
          // { key: '身份证号', value: 'store_id_card', },
          // { key: '银行卡号', value: 'bank_account_number', },
          // { key: '状态', value: 'stateStr', },
        ],
        btnList: [
          { key: 'store_id', value: '详情' },
          { key: 'isAuthing', value: '同意' },
          { key: 'isAuthing', value: '拒绝', type: 'danger' },
        ],
      },

      refuse: {
        title: '确认拒绝商家？',
        refuse:          { title: '拒绝原因', value: '', type: 'text', alert: null, },
      },

      stateMap: {
        0: '下架',
        1: '上架',
        2: '审核中',
        3: '拒绝',
      },
    };
  },

  watch: {
  },

  methods: {
    async exportCheck(){
      let header, data, list, 
          classList = this.tableConfig.classList,
          filename = `奖励列表`,
          loading = this.$loading({ text: '正在导出......' }); 
      
      let query = JSON.parse(JSON.stringify(this.query));
      query.limit = this.total;
      let res = await api.getCheckList(query);

      if(typeof res === 'string' || !res || res.error) return this.handleCheckError(res ? res.moreInfo || res : '获取奖励列表失败', loading);

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

    handleCheckHeadEmit(index){
      // add
      if(index == 0) this.openDialog(1);
    },

    handleCheckTableEmit(item, index){
      this.detail = item;

      // detail 
      if(index == 0) this.openDetailDialog();

      // agree
      if(index == 1) this.changeCheckStatus(item, index);
      // refuse
      if(index == 2) this.openRefuseDialog();
    },

    openDetailDialog(){ this.dialogConfig.status = 3; this.initRecommendDialog(this.detail); },
    openRefuseDialog(){ this.dialogConfig.status = 4; },

    initCheckDialog(item){
      let arr = this.editArr,
          store = this.store;
      this.getUploadToken();

      if(typeof item == 'object'){
        for(let key in store){
          store[key].value = item[store[key].from];
          store[key].disabled = true;
          store[key].alert = null;
        }
      }else{
        this.detail = null;
        arr.forEach(v => { store[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }

    },

    async submitCheck(){
      let status = this.dialogConfig.status,
          imgList = this.checkImg.value,
          param;

      // refuse 
      if(status == 4) return this.changeCheckStatus(this.detail, 2);

      if(this.validCheckError()) return ;

      let loading = this.$loading({ text: '提交中...', });

      let img = imgList.map(v => { return v.raw ? `${this.checkImg.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        activity_title: this.checkTitle.value,
        activity_image: img[0],
        activity_content: this.checkDesc.value,
      };

      this.saveCheck(param, loading);
    },

    async saveCheck(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addCheck(param) : await api.setCheck(this.detail.activity_id, param);

      if(typeof res == 'string' || !res || res.error) return this.handleCheckError(res ? res.error || res : '提交分享信息失败', loading);

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      loading.close();
    },

    validCheckError(){
      let arr = ['checkDesc', 'checkTitle', 'checkImg'];

      for(let i = arr.length - 1; i >= 0; i--){
        let item = this[arr[i]];

        if(typeof item.value == 'object' && !item.value[0]) return item.alert = `${item.title}不能为空`;

        if(typeof item.value == 'string' && !item.value) return item.alert = `${item.title}不能为空`;

        if(item.alert) return true;
      }
    },

    /* api */
    async changeCheckStatus(item, index){
      let param = { store_state: index == 1 ? 1 : 3 },
          refuse = this.refuse.refuse;
      // refuse
      if(index == 2){
        if(!refuse.value) return refuse.alert = `${refuse.title}不能为空!`;

        param.store_refuse_info = this.refuse.refuse.value;
      }

      let loading = this.$loading({ text: '正在更新状态...' });

      let res = await api.changeCheck(item.store_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleCheckError(res ? res.error || res : '修改状态失败');

      this.dialogConfig.status = 0;
      this.getList();
      loading.close();
    },

    async deleteCheck(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteCheck(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleCheckError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getList();
    },

    async getCheckList() {
      this.tableConfig.loading = true;

      if(!this.query.hasOwnProperty('store_state')) this.query.store_state = '2,3';
      let res = await api.getAllList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.handleCheckError(res ? res.error || res : '获取活动列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    formatCheck(v){
      try{
        v.idImg = this.formatImg([v.store_id_card_behind, v.store_id_card_front]);
        v.logoImg = this.formatImg(v.store_avatar);
        v.storeLicenseImg = this.formatImg(v.business_licence);    
        v.goodsLicenseImg = this.formatImg(v.identity_images);
      }catch(e){ console.error(e.message); }

      let res = this.CLASSLIST.filter(vv => vv.value == v.storeclass_id)[0];
      v.store_class = res ? res.title : '-';

      v.store_time = this.formatTime(v.store_addtime * 1000);

      v.stateStr = this.stateMap[v.store_state];
      v.isAuthing = v.store_state == 2;
    },

    async getCheckUploadToken(){
      let res = await commonReq.getUploadToken();

      if(typeof res === 'string' || !res || res.error) return this.handleCheckError(res ? res.error || res : '获取上传图片token失败');

      this.checkImg.body.token = res.data;
      this.checkImg.body.config = "{ useCdnDomain: true }";

    },

    // immutable
    showCheck(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getList();
    },

    // util
    handleCheckError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

    mockCheck(){
      let img = [ { url: 'https://cdn.health.healthplatform.xyz/Fj2MUuTZ5UvAG0LqSFBcI__J1U2D' } ],
          logo = [ { url: 'https://cdn.health.healthplatform.xyz/Fvs1CpRD8iU4nZ_lAcErHsdJ8fmY', }, ];

      let list = [
        { store_id: 1, store_name: 'vip1', mobile: '12345', name: 'SK地方豆腐干开的饭馆', store_state: 1, img: img, store_logo: logo, },
      ];

      list.forEach(this.format);
      this.list = list;
      this.total = list.length;
    },
    
  },

  created(){
    this.getStoreClassList('check');
  },

}