import api from '@/api/store';

export default {
  data(){
    return {
      // vip goods 1. 没有运费 2.可以编辑(供货价, 建议零售价)
      showStore: false,
      store: { title: '店铺名称', value: 1, titleKey: 'store_name', valueKey: 'store_id', list: [], alert: null, disabled: false, search: true, },
    };
  },

  methods: {
    initStore(goods){
      let store = this.store;

      this.showStore = goods && goods.is_vip ? true : false;
      store.disabled = goods ? true : false;

      if(goods){

        if(this.showStore){
          this.category.disabled = true;
          this.getStoreList(goods.store_id);
        }
      }

    },

    async getStoreList(id){
      let store = this.store,
          res = await api.getAllList();

      if(typeof res === 'string' || !res || res.error) return this.handleError(res ? res.error || res : '获取店铺信息失败');

      store.list = res.data || [];
      store.list.push({ store_id: 1, store_name: '官方店铺', });

      // edit goods
      if(id && store.list.some(v => v.store_id == id)) store.value = id;
    },
  },

}