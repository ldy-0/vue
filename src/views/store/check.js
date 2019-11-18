import api from '@/api/setting';
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
          { key: '活动ID', value: 'activity_id', },
          { key: 'Logo图', value: 'img', isImg: true, },
          { key: '店铺名', value: 'activity_title', },
          { key: '主营', value: 'activity_title', },
          { key: '创建时间', value: 'create_time', },
          { key: '联系人', value: 'check', },
          { key: '联系方式', value: 'download', },
          { key: '证件', value: 'stateStr', },
          { key: '身份证号', value: 'download', },
          { key: '银行卡号', value: 'download', },
        ],
        btnList: [
          { key: 'activity_id', value: '编辑' },
          { key: 'isDown', value: '上架' },
          { key: 'activity_state', value: '下架' },
          { key: 'activity_id', value: '删除', type: 'danger' },
        ],
      },
      store: {
        name:            { title: '姓名',     value: 'll', alert: null, type: 'text', },
        id:              { title: '身份证号', value: '124', alert: null, },
        idImg:           { title: '证件照',   value: [ { url: 'https://cdn.health.healthplatform.xyz/Fvs1CpRD8iU4nZ_lAcErHsdJ8fmY', }, ], },
        bank:            { title: '开户银行', value: '建设银行', type: 'text', },
        bankId:          { title: '银行卡号', value: '02255662244444', },
        mobile:          { title: '联系方式', value: '454878545454', },
        storeName:       { title: '店铺名',   value: '：爱撒娇的哈觉得', type: 'text', },
        storeClass:      { title: '店铺主营', value: '食品', type: 'text', },
        storeLicenseImg: { title: '营业照',   value: [ { url: 'https://cdn.health.healthplatform.xyz/Fvs1CpRD8iU4nZ_lAcErHsdJ8fmY', }, ], },
        logoImg:         { title: '店铺logo图', value: [ { url: 'https://cdn.health.healthplatform.xyz/Fvs1CpRD8iU4nZ_lAcErHsdJ8fmY', }, ], limit: 1, },
        goodsLicenseImg: { title: '其他证件', value: [ { url: 'https://cdn.health.healthplatform.xyz/Fvs1CpRD8iU4nZ_lAcErHsdJ8fmY', }, ], },
      },

      stateMap: {
        0: '下架',
        1: '上架',
      },
      editArr: [
        { type: '', to: 'checkTitle', from: 'activity_title', },
        { type: '', to: 'checkDesc', from: 'activity_content', },
      ],
    };
  },

  watch: {
    checkDesc: {
      deep: true,
      handler(v1, v2){ this.checkDesc.alert = v1.value ? null : `${this.checkDesc.title}不能为空`; },
    }
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
      // edit
      if(index == 0) this.openDialog(item, 2);

      // state
      if([1, 2].indexOf(index) !== -1) this.changeCheckStatus(item, index);

      // delete
      if(index == 3) this.deleteCheck(item);
    },

    initCheckDialog(item){
      let arr = this.editArr;
      this.getUploadToken();

      if(typeof item == 'object'){
        this.detail = item;
        arr.forEach(v => { this[v.to].value = item[v.from]; v.alert = null; });
      }else{
        this.detail = null;
        arr.forEach(v => { this[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }

      this.checkImg.value = item.activity_image ? item.imgList : [];
      this.checkImg.alert = null;
    },

    async submitCheck(){
      let status = this.dialogConfig.status,
          imgList = this.checkImg.value,
          param;

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
      let loading = this.$loading({ text: '正在更新状态...' });

      let param = { status: index == 1 ? 1 : 0 };

      let res = await api.changeCheck(item.activity_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleCheckError(res ? res.error || res : '修改状态失败');

      loading.close();
      this.getList();
    },

    async deleteCheck(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteCheck(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleCheckError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getCheckList();
    },

    async getCheckList() {
      this.tableConfig.loading = true;

      let res = await api.getShareList(this.query);

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
        v.imgList = [ { url: v.activity_image } ];
        v.img = v.activity_image;
      }catch(e){ console.error(e.message); }

      v.stateStr = this.stateMap[v.activity_state];
      v.isDown = v.activity_state == 0;
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(typeof res === 'string' || !res || res.error) return this.handleCheckError(res ? res.error || res : '获取上传图片token失败');

      this.checkImg.body.token = res.data;
      this.checkImg.body.config = "{ useCdnDomain: true }";

    },

    // immutable
    showCheck(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getCheckList();
    },

    // util
    handleCheckError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

    // mockCheck(){
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