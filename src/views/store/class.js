import api from '@/api/store';

export default {

  methods: {
   async getStoreClassList(type) {
      let res = await api.getStoreClassList();

      if(typeof res == 'string' || !res || res.error) return this.handleAllError(res ? res.error || res : '获取分类列表失败');

      if(res && res.data){
        res.data.forEach(v => { v.title = v.storeclass_name, v.value = v.storeclass_id; });

        this.CLASSLIST = res.data;

        if(type == 'all') this.allHeadConfig.selectList[0].list = [{ title: '全部', value: -1 }].concat(this.store.storeClass.list = this.CLASSLIST);
        if(type == 'check') this.checkHeadConfig.selectList[0].list = [{ title: '全部', value: -1 }].concat(this.CLASSLIST);
        if(type == 'recommend') this.recommendHeadConfig.selectList[0].list = [{ title: '全部', value: -1 }].concat(this.CLASSLIST);
      }
    }, 

  },

}