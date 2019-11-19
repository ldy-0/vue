import api from '@/api/store';
import commonReq from '@/api/common' 

export default {
  data(){
    return {
      allHeadConfig: {
        btnList: [
          // { title: '上传活动' },
        ],

        inputList: [
          { title: '', placeholder: '请输入店铺名称或手机号码', },
        ],

        selectList: [
          { title: '主营', list: [], },
          { title: '状态', list: [], },
        ],
        statusList: [-1, -1],

        dateList: [
          { title: '选择日期', width: '400px' },
        ],

      },

      allImg: { title: '活动图片', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {}, limit: 1, tip: '*活动图片不超过100Kb' },
      allTitle: { type: 'string', title: '活动标题', value: '', alert: null, },
      allDesc: { title: '活动内容', value: '', alert: null, },

      allTableConfig: {
        loading: false,
        showOperate: true,
        classList: [
          { key: '排序序号', value: 'store_id', },
          { key: 'Logo图', value: 'store_avatar', isImg: true, },
          { key: '店铺名', value: 'store_name', },
          { key: '主营', value: 'store_class', },
          { key: '创建时间', value: 'store_time', },
          { key: '联系人', value: 'contacts_name', },
          { key: '联系方式', value: 'contacts_phone', },
          { key: '证件', value: 'identity', },
          { key: '身份证号', value: 'store_id_card', },
          { key: '银行卡号', value: 'bank_account_number', },
          { key: '状态', value: 'stateStr', },
        ],
        btnList: [
          { key: 'store_id', value: '编辑' },
          { key: 'isDown', value: '上架' },
          { key: 'store_state', value: '下架' },
          { key: 'store_id', value: '备注', },
        ],
      },
      store: {
        name:            { title: '姓名',     value: '', from: 'contacts_name', alert: null, type: 'text', },
        id:              { title: '身份证号', value: '', from: 'store_id_card', alert: null, },
        idImg:           { title: '证件照',   value: [], from: 'idImg', alert: null, limit: 2, url: "https://up-z2.qiniup.com", cdnUrl: "https://cdn.health.healthplatform.xyz", body: {} },
        bank:            { title: '开户银行', value: '', from: 'bank_name', alert: null, type: 'text', },
        bankId:          { title: '银行卡号', value: '', from: 'bank_account_number', alert: null,  },
        mobile:          { title: '联系方式', value: '', from: 'contacts_phone', alert: null, },
        storeName:       { title: '店铺名',   value: '', from: 'store_name', alert: null, type: 'text', },
        storeClass:      { title: '店铺主营', value: '', from: 'storeclass_id', alert: null, list: [], },
        storeLicenseImg: { title: '营业照',   value: [], from: 'storeLicenseImg', alert: null, url: "https://up-z2.qiniup.com", cdnUrl: "https://cdn.health.healthplatform.xyz", body: {} },
        logoImg:         { title: '店铺logo图', value: [], from: 'logoImg', alert: null, limit: 1, url: "https://up-z2.qiniup.com", cdnUrl: "https://cdn.health.healthplatform.xyz", body: {} },
        goodsLicenseImg: { title: '其他证件', value: [], from: 'goodsLicenseImg', alert: null, url: "https://up-z2.qiniup.com", cdnUrl: "https://cdn.health.healthplatform.xyz", body: {} },
      },

      down: {
        title: '确认下架商家？',
        down:   { title: '下架原因', value: '', type: 'text', alert: null, },
      },

      remark: {
        remark: { title: '备注', value: '', type: 'text', alert: null, },
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
    // allDesc: {
    //   deep: true,
    //   handler(v1, v2){ this.allDesc.alert = v1.value ? null : `${this.allDesc.title}不能为空`; },
    // }
  },

  methods: {
    // async exportAll(){
    //   let header, data, list, 
    //       classList = this.tableConfig.classList,
    //       filename = `奖励列表`,
    //       loading = this.$loading({ text: '正在导出......' }); 
      
    //   let query = JSON.parse(JSON.stringify(this.query));
    //   query.limit = this.total;
    //   let res = await api.getAllList(query);

    //   if(typeof res === 'string' || !res || res.error) return this.handleAllError(res ? res.moreInfo || res : '获取奖励列表失败', loading);

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

    handleAllHeadEmit(index){
      // add
      if(index == 0) this.openDialog(1);
    },

    handleAllTableEmit(item, index){
      this.detail = item;

      // edit
      if(index == 0) this.openDialog(item, 2);

      // up 
      if(index == 1) this.changeAllStatus(item, index);
      // down
      if(index == 2) this.openDownDialog();

      // remark 
      if(index == 3) this.openRemarkDialog();
    },

    openDownDialog(){ this.dialogConfig.status = 5; },
    openRemarkDialog(){ this.dialogConfig.status = 6; },

    initAllDialog(item){
      let arr = this.editArr,
          store = this.store;
      this.getUploadToken();

      if(typeof item == 'object'){
        for(let key in store) store[key].value = item[store[key].from];
      }else{
        this.detail = null;
        arr.forEach(v => { store[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }

    },

    async submitAll(){
      let status = this.dialogConfig.status,
          store = this.store,
          imgList = ['idImg', 'storeLicenseImg', 'logoImg', 'goodsLicenseImg'],
          param;

      // down
      if(status == 5) return this.changeAllStatus(this.detail, 2);
      // remark
      if (status == 6) return this.changeAllStatus(this.detail, 'remark');

      if(this.validAllError()) return ;

      let loading = this.$loading({ text: '提交中...', });

      for(let i = imgList.length - 1; i >= 0; i--){
        imgList[i] = store[imgList[i]].value.map(v => { return v.raw ? `${this.allImg.cdnUrl}/${v.response.key}` : v.url });
      }

      param = {
        contacts_name: store.name.value,
        store_id_card: store.id.value,
        store_id_card_front: imgList[0][0],    
        store_id_card_behind: imgList[0][1],
        bank_name: store.bank.value,
        bank_account_number: store.bankId.value,
        contacts_phone: store.mobile.value,
        store_name: store.storeName.value,
        storeclass_id: store.storeClass.value,
        business_licence: imgList[1],
        store_avatar: imgList[2],
        identity_images: imgList[3],
        bank_account_name: this.detail.bank_account_name,
        identity: this.detail.identity,
      };

      this.saveAll(param, loading);
    },

    async saveAll(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addAll(param) : await api.setAll(this.detail.store_id, param);

      if(typeof res == 'string' || !res || res.error) return this.handleAllError(res ? res.error || res : '提交分享信息失败', loading);

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      loading.close();
    },

    validAllError(){
      let arr = [],
          store = this.store;

      for(let key in store){ if(['goodsLicenseImg'].indexOf(key) === -1) arr.push(key); }

      for(let i = arr.length - 1; i >= 0; i--){
        let item = store[arr[i]];

        if(typeof item.value == 'object' && !item.value[0]) return item.alert = `${item.title}不能为空`;

        if(typeof item.value == 'string' && !item.value) return item.alert = `${item.title}不能为空`;

        if(item.alert) return true;
      }
    },

    /* api */
    async changeAllStatus(item, index){
      let param = { store_state: index == 1 ? 1 : 0 },
          down = this.down.down,
          remark = this.remark.remark;

      // down
      if(this.dialogConfig.status == 5){
        if(!down.value) return down.alert = `${down.title}不能为空!`;

        param.store_close_info = down.value;
      }

      // remark
      if(this.dialogConfig.status == 6){
        if(!remark.value) return remark.alert = `${remark.title}不能为空!`;

        param = { remark: this.remark.remark.value };
      }

      let loading = this.$loading({ text: '正在更新状态...' });

      let res = await api.changeAll(item.store_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleAllError(res ? res.error || res : '修改状态失败');

      this.dialogConfig.status = 0;
      this.getList();

      loading.close();
    },

    async deleteAll(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteAll(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleAllError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getAllList();
    },

    async getAllList() {
      this.tableConfig.loading = true;

      let res = await api.getAllList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.handleAllError(res ? res.error || res : '获取活动列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    formatAll(v){
      try{
        v.idImg = this.formatImg([v.store_id_card_front, v.store_id_card_behind]);
        v.logoImg = this.formatImg(v.store_avatar);
        v.storeLicenseImg = this.formatImg(v.business_licence);    
        v.goodsLicenseImg = this.formatImg(v.identity_images);
      }catch(e){ console.error(e.message); }

      let res = this.CLASSLIST.filter(vv => vv.value == v.storeclass_id)[0];
      v.store_class = res ? res.title : '-';

      v.store_time = this.formatTime(v.store_addtime * 1000);

      v.stateStr = this.stateMap[v.store_state];
      v.isDown = v.store_state == 0;
    },

    async getUploadToken(){
      let store = this.store,
          res = await commonReq.getUploadToken();

      if(typeof res === 'string' || !res || res.error) return this.handleAllError(res ? res.error || res : '获取上传图片token失败');

      store.idImg.body.token = store.storeLicenseImg.body.token = store.logoImg.body.token = store.goodsLicenseImg.body.token = res.data;
      store.idImg.body.config = store.storeLicenseImg.body.config = store.logoImg.body.config = store.goodsLicenseImg.body.config = "{ useCdnDomain: true }";

    },

    // immutable
    showAll(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getAllList();
    },

    // util
    handleAllError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

    // mockAll(){
    //   let img = [ { url: 'https://cdn.health.healthplatform.xyz/Fj2MUuTZ5UvAG0LqSFBcI__J1U2D' } ],
    //       logo = [ { url: 'https://cdn.health.healthplatform.xyz/Fvs1CpRD8iU4nZ_lAcErHsdJ8fmY', }, ];

    //   let list = [
    //     { store_id: 1, store_name: 'vip1', mobile: '12345', name: 'SK地方豆腐干开的饭馆', store_state: 1, img: img, store_logo: logo, },
    //   ];

    //   list.forEach(this.format);
    //   this.list = list;
    //   this.total = list.length;
    // },

  },

  created(){
    this.allHeadConfig.selectList[0].list = [{ title: '全部', value: -1 }].concat(this.store.storeClass.list = this.CLASSLIST);
    this.allHeadConfig.selectList[1].list = this.STATELIST;
  }

}