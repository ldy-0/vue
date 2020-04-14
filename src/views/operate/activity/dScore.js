import api from '@/api/setting';
import commonReq from '@/api/common' 

export default {
  data(){
    return {
      dScoreHeadConfig: {
        btnList: [
          { title: '上传活动' },
        ],

        inputList: [
          // { title: '', placeholder: '请输入关键字（活动标题）', },
        ],

      },

      dScoreActivity: {
        score:  { type: 'positive', title: '消费德分', value: '', placeholder: '填写德分', alert: null, },
        date:  { type: 'daterange', title: '活动日期', value: [], alert: null, },
        level: { title: 'VIP等级', value: '', list: [], alert: null, },
        img:   { type: 'array', title: '活动图片', value: [], alert: null, url: '', cdnUrl: '', body: {}, limit: 1, tip: '' },
      },

      dScoreTableConfig: {
        loading: false,
        showOperate: true,
        classList: [
          { key: '活动时间', value: 'time', },
          { key: '消费德分', value: 'gift', },
          { key: 'VIP等级', value: 'levelStr', },
          { key: '注册数量', value: 'apply_num', },
          { key: '图片', value: 'image', isImg: true, },
          // { key: '状态', value: 'stateStr', },
        ],
        btnList: [
          // { key: 'activity_id', value: '编辑' },
          // { key: 'isDown', value: '上架' },
          // { key: 'activity_state', value: '下架' },
          { key: 'activity_id', value: '删除', type: 'danger' },
        ],
      },

      stateMap: {
        0: '下架',
        1: '上架',
      },
      vipLevelList: [],
      
    };
  },

  methods: {
    handleDScoreHeadEmit(index){
      // add
      if(index == 0) this.openDScoreDialog(3);
    },

    handleDScoreTableEmit(item, index){
      // delete
      if(index == 0) this.deleteDScore(item);

      // state
      // if([1, 2].indexOf(index) !== -1) this.changeDScoreStatus(item, index);
    },

    initDScoreDialog(item){
      let obj = this.dScoreActivity; 

      this.getDScoreUploadToken();

      for(let k in obj){
        let v = obj[k];

        v.value = item ? item[v.from] : (v.type === 'array' || v.type === 'daterange' ? [] : '');
        v.alert = null;
      }

    },

    async submitDScore(){
      let status = this.dialogConfig.status,
          obj = this.dScoreActivity,
          img = obj.img,
          param;

      if(this.validDScoreError(obj)) return ;

      let loading = this.$loading({ text: '提交中...', });

      let imgList = img.value.map(v => { return v.raw ? `${img.cdnUrl}/${v.response.key}` : v.url });
      if(!imgList[0]) return console.error('dscoreActivity.imgList value :', imgList);

      param = {
        gift: obj.score.value,
        image: imgList[0],
        start_time: obj.date.value[0].toISOString(),
        end_time: obj.date.value[1].toISOString(),
        vip_level: obj.level.value,
      };

      this.saveDScore(param, loading);
    },

    async saveDScore(param, loading){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 3 ? await api.addDScore(param) : await api.setDScore(this.detail.activity_id, param);

      if(typeof res == 'string' || !res || res.error) return this.handleDScoreError(res ? res.error || res : '提交活动信息失败', loading);

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      loading.close();
    },

    validDScoreError(obj){
      let arr = ['img', 'level', 'score', 'date'];

      for(let i = arr.length - 1; i >= 0; i--){
        let item = obj[arr[i]];

        if(typeof item.value == 'object' && !item.value[0]) return item.alert = `${item.title}不能为空`;

        if(typeof item.value == 'string' && !item.value) return item.alert = `${item.title}不能为空`;

        if(item.alert) return true;
      }
    },

    /* api */
    // async changeDScoreStatus(item, index){
    //   let loading = this.$loading({ text: '正在更新状态...' });

    //   let param = { status: index == 1 ? 1 : 0 };

    //   let res = await api.changeDScore(item.activity_id, param);

    //   res.status == 0 ? this.$message.success(this.successTip) : this.handleDScoreError(res ? res.error || res : '修改状态失败');

    //   loading.close();
    //   this.getList();
    // },

    async deleteDScore(item){
      let loading = this.$loading({ text: '删除中...' });

      let res = await api.deleteDScore(item.activity_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.handleDScoreError(res ? res.error || res : '删除失败', loading);

      loading.close();
      this.getDScoreList();
    },

    async getDScoreList() {
      this.tableConfig.loading = true;

      let res = await api.getDScoreList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.handleDScoreError(res ? res.error || res : '获取活动列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },    

    formatDScore(v){
      try{
        v.imgList = [ { url: v.image } ];
        v.img = v.image;
      }catch(e){ console.error(e.message); }

      v.time = `${v.start_time}一${v.end_time}`;

      let res = this.vipLevelList.filter(item => item.id == v.vip_level)[0];
      v.levelStr = res ? res.title : '-';
      // v.stateStr = this.stateMap[v.activity_state];
    },

    async getDScoreUploadToken(){
      let obj = this.dScoreActivity,
          res = await commonReq.getUploadToken();

      if(typeof res === 'string' || !res || res.error) return this.handleDScoreError(res ? res.error || res : '获取上传图片token失败');

      obj.img.url = 'https://up-z2.qiniup.com';
      obj.img.cdnUrl = 'https://cdn.health.healthplatform.xyz';

      obj.img.body.token = res.data;
      obj.img.body.config = "{ useCdnDomain: true }";

    },

    // immutable
    openDScoreDialog(index, item){
      this.dialogConfig.status = index;

      this.detail = item || null;

      this.initDScoreDialog();
    },

    // util
    handleDScoreError(err, loading){
      if(loading) loading.close(); 
      if(this.tableConfig.loading) this.tableConfig.loading = false;
      
      this.$message.error(err);
    },

  },

  created(){
    let obj = this.dScoreActivity;

    this.vipLevelList = obj.level.list = this.$store.state.data.vipLevel;
  }

}