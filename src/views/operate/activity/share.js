import api from '@/api/setting';
import commonReq from '@/api/common' 

export default {
  data(){
    return {
      shareHeadConfig: {
        btnList: [
          { title: '上传活动' },
        ],

        inputList: [
          { title: '', placeholder: '请输入关键字（活动标题）', },
        ],

      },

      shareImg: { title: '活动图片', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {}, limit: 1, tip: '*活动图片不超过100Kb' },
      shareTitle: { type: 'string', title: '活动标题', value: '', alert: null, },
      shareDesc: { title: '活动内容', value: '', alert: null, },

      shareTableConfig: {
        loading: false,
        showOperate: true,
        classList: [
          { key: '活动ID', value: 'activity_id', },
          { key: '活动图', value: 'img', isImg: true, },
          { key: '活动标题', value: 'activity_title', },
          { key: '分享次数', value: 'share', },
          { key: '下载次数', value: 'download', },
          { key: '创建时间', value: 'create_time', },
          { key: '状态', value: 'stateStr', },
        ],
        btnList: [
          { key: 'activity_id', value: '编辑' },
          { key: 'isDown', value: '上架' },
          { key: 'activity_state', value: '下架' },
          { key: 'activity_id', value: '删除', type: 'danger' },
        ],
      },

      stateMap: {
        0: '下架',
        1: '上架',
      },
      editArr: [
        { type: '', to: 'shareTitle', from: 'activity_title', },
        { type: '', to: 'shareDesc', from: 'activity_content', },
      ],
    };
  },

  watch: {
    shareDesc: {
      deep: true,
      handler(v1, v2){ this.shareDesc.alert = v1.value ? null : `${this.shareDesc.title}不能为空`; },
    }
  },

  methods: {
    async exportShare(){
      let header, data, list, 
          classList = this.tableConfig.classList,
          filename = `奖励列表`,
          loading = this.$loading({ text: '正在导出......' }); 
      
      let query = JSON.parse(JSON.stringify(this.query));
      query.limit = this.total;
      let res = await api.getShareList(query);

      if(typeof res === 'string' || !res || res.error) return this.handleShareError(res ? res.moreInfo || res : '获取奖励列表失败', loading);

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

    handleShareHeadEmit(index){
      // add
      if(index == 0) this.openDialog(1);
    },

    handleShareTableEmit(item, index){
      // edit
      if(index == 0) this.openDialog(item, 2);

      // state
      if([1, 2].indexOf(index) !== -1) this.changeShareStatus(item, index);

      // delete
      if(index == 3) this.deleteShare(item);
    },

    initShareDialog(item){
      let arr = this.editArr;
      this.getUploadToken();

      if(typeof item == 'object'){
        this.detail = item;
        arr.forEach(v => { this[v.to].value = item[v.from]; v.alert = null; });
      }else{
        this.detail = null;
        arr.forEach(v => { this[v.to].value = v.type === 'array' ? [] : ''; v.alert = null; });
      }

      this.shareImg.value = item.activity_image ? item.imgList : [];
      this.shareImg.alert = null;
    },

    async submitShare(){
      let status = this.dialogConfig.status,
          imgList = this.shareImg.value,
          param;

      if(this.validShareError()) return ;

      let loading = this.$loading({ text: '提交中...', });

      let img = imgList.map(v => { return v.raw ? `${this.shareImg.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        activity_title: this.shareTitle.value,
        activity_image: img[0],
        activity_content: this.shareDesc.value,
      };

      this.saveShare(param, loading);
    },

    async saveShare(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addShare(param) : await api.setShare(this.detail.activity_id, param);

      if(typeof res == 'string' || !res || res.error) return this.handleShareError(res ? res.error || res : '提交分享信息失败', loading);

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      loading.close();
    },

    validShareError(){
      let arr = ['shareDesc', 'shareTitle', 'shareImg'];

      for(let i = arr.length - 1; i >= 0; i--){
        let item = this[arr[i]];

        if(typeof item.value == 'object' && !item.value[0]) return item.alert = `${item.title}不能为空`;

        if(typeof item.value == 'string' && !item.value) return item.alert = `${item.title}不能为空`;

        if(item.alert) return true;
      }
    },

    /* api */
    async changeShareStatus(item, index){
      let loading = this.$loading({ text: '正在更新状态...' });

      let param = { status: index == 1 ? 1 : 0 };

      let res = await api.changeShare(item.activity_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleShareError(res ? res.error || res : '修改状态失败');

      loading.close();
      this.getList();
    },

    async deleteShare(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteShare(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleShareError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getShareList();
    },

    async getShareList() {
      this.tableConfig.loading = true;

      let res = await api.getShareList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.handleShareError(res ? res.error || res : '获取活动列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    formatShare(v){
      try{
        v.imgList = [ { url: v.activity_image } ];
        v.img = v.activity_image;
      }catch(e){ console.error(e.message); }

      v.stateStr = this.stateMap[v.activity_state];
      v.isDown = v.activity_state == 0;
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(typeof res === 'string' || !res || res.error) return this.handleShareError(res ? res.error || res : '获取上传图片token失败');

      this.shareImg.body.token = res.data;
      this.shareImg.body.config = "{ useCdnDomain: true }";

    },

    // immutable
    showShare(item, index){
      this.dialogConfig.status = index;

      this.detail = item;

      this.getShareList();
    },

    // util
    handleShareError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

    // mockShare(){
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