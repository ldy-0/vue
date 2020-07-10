import api from '@/api/store';
import commonReq from '@/api/common' 

export default {
  data(){
    return {
      recommendHeadConfig: {
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

      recommendImg: { title: '活动图片', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {}, limit: 1, tip: '*活动图片不超过100Kb' },
      recommendTitle: { type: 'string', title: '活动标题', value: '', alert: null, },
      recommendDesc: { title: '活动内容', value: '', alert: null, },

      recommendTableConfig: {
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
          { key: '单位性质', value: 'companyTypeStr', },
          { key: '上架商品', value: 'online', },
          { key: '销量', value: 'store_sales', },
          // { key: '身份证号', value: 'store_id_card', },
          // { key: '银行卡号', value: 'bank_account_number', },
          // { key: '状态', value: 'stateStr', },
        ],
        btnList: [
          { key: 'store_id', value: '详情' },
          { key: 'isPublic', value: '推荐' },
          { key: 'store_recommend', value: '撤销', type: 'danger' },
          { key: 'isAuthed', value: '指定' },
        ],
      },

      sort: {
        title: '选择店铺排序',
        sort: { title: '输入序号', value: '', type: 'integer', alert: null, },
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
    async exportRecommend(){
      let header, data, list, 
          classList = this.tableConfig.classList,
          filename = `奖励列表`,
          loading = this.$loading({ text: '正在导出......' }); 
      
      let query = JSON.parse(JSON.stringify(this.query));
      query.limit = this.total;
      let res = await api.getRecommendList(query);

      if(typeof res === 'string' || !res || res.error) return this.handleRecommendError(res ? res.moreInfo || res : '获取奖励列表失败', loading);

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

    handleRecommendHeadEmit(index){
      // add
      if(index == 0) this.openDialog(1);
    },

    handleRecommendTableEmit(item, index){
      this.detail = item;

      // detail 
      if(index == 0) this.openDetailDialog();

      // recommend
      if(index == 1) this.changeRecommendStatus(item, index);
      // cancel
      if(index == 2) this.changeRecommendStatus(item, index);

      // sort
      if(index == 3) this.openSortDialog();
    },

    openDetailDialog(){ 
      this.dialogConfig.status = 3; 
      this.initRecommendDialog(this.detail); 
    },
    openSortDialog(){ 
      this.sort.sort.value = this.detail.store_sort;
      this.sort.sort.alert = null;

      this.dialogConfig.status = 7; 
    },

    initRecommendDialog(item){
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

    async submitRecommend(){
      let status = this.dialogConfig.status,
          imgList = this.recommendImg.value,
          param;

      // sort 
      if(status == 7) return this.changeRecommendStatus(this.detail, 'sort');

      if(this.validRecommendError()) return ;

      let loading = this.$loading({ text: '提交中...', });

      let img = imgList.map(v => { return v.raw ? `${this.recommendImg.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        activity_title: this.recommendTitle.value,
        activity_image: img[0],
        activity_content: this.recommendDesc.value,
      };

      this.saveRecommend(param, loading);
    },

    async saveRecommend(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addRecommend(param) : await api.setRecommend(this.detail.activity_id, param);

      if(typeof res == 'string' || !res || res.error) return this.handleRecommendError(res ? res.error || res : '提交分享信息失败', loading);

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      loading.close();
    },

    validRecommendError(){
      let arr = ['recommendDesc', 'recommendTitle', 'recommendImg'];

      for(let i = arr.length - 1; i >= 0; i--){
        let item = this[arr[i]];

        if(typeof item.value == 'object' && !item.value[0]) return item.alert = `${item.title}不能为空`;

        if(typeof item.value == 'string' && !item.value) return item.alert = `${item.title}不能为空`;

        if(item.alert) return true;
      }
    },

    /* api */
    async changeRecommendStatus(item, index){
      let param = { store_recommend: index == 1 ? 1 : 0 },
          sort = this.sort.sort;

      // sort
      if(index == 'sort'){
        if(!sort.value) return sort.alert = `${sort.title}不能为空!`;

        param = { store_sort: sort.value };
      }

      let loading = this.$loading({ text: '正在更新状态...' });

      let res = await api.changeAll(item.store_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleRecommendError(res ? res.error || res : '修改状态失败');

      this.dialogConfig.status = 0;
      this.getList();
      loading.close();
    },

    async deleteRecommend(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteRecommend(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleRecommendError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getList();
    },

    async getRecommendList() {
      this.tableConfig.loading = true;

      if(!this.query.hasOwnProperty('store_state')) this.query.store_state = '0,1';
      let res = await api.getAllList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.handleRecommendError(res ? res.error || res : '获取推荐列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    formatRecommend(v){
      try{
        v.idImg = this.formatImg([v.store_id_card_behind, v.store_id_card_front]);
        v.logoImg = this.formatImg(v.store_avatar);
        v.storeLicenseImg = this.formatImg(v.business_licence);    
        v.goodsLicenseImg = this.formatImg(v.identity_images);
      }catch(e){ console.error(e.message); }

      let res = this.CLASSLIST.filter(vv => vv.value == v.storeclass_id)[0];
      v.store_class = res ? res.title : '-';

      // 单位性质
      res = this.companyTypeList.filter(vv => vv.value == v.taxpayer)[0];
      v.companyTypeStr = res ? res.title : '-';
      // 发票
      v.invoice = v.can_invoice == 1 ? 1 : 2;

      v.store_time = this.formatTime(v.store_addtime * 1000);

      v.stateStr = this.stateMap[v.store_state];
      v.isAuthing = v.store_state == 2;
      v.isAuthed = v.store_state != 2;

      v.isPublic = v.store_recommend == 0 && v.store_state !== 2;
    },

    async getRecommendUploadToken(){
      let res = await commonReq.getUploadToken();

      if(typeof res === 'string' || !res || res.error) return this.handleRecommendError(res ? res.error || res : '获取上传图片token失败');

      this.recommendImg.body.token = res.data;
      this.recommendImg.body.config = "{ useCdnDomain: true }";

    },

    // immutable
    showRecommend(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getList();
    },

    // util
    handleRecommendError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

    mockRecommend(){
      let img = [ { url: 'https://cdn.health.healthplatform.xyz/Fj2MUuTZ5UvAG0LqSFBcI__J1U2D' } ],
          logo = [ { url: 'https://cdn.health.healthplatform.xyz/Fvs1CpRD8iU4nZ_lAcErHsdJ8fmY', }, ];

      let list = [
        { store_id: 1, store_name: 'vip1', mobile: '12345', name: 'SK地方豆腐干开的饭馆', store_state: 1, img: img, store_logo: logo, },
      ];

      list.forEach(this.format);
      this.list = list;
      this.total = list.length;
    },

    async createStore(){
      let param = {

      };

      let res = await api.addStore(param);

      console.error(res);
    }
  },

  created(){
    this.getStoreClassList('recommend');
  },

}