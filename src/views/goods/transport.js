import transportApi from "@/api/transport";

export default {
  data(){
    return {
      freightType: { 
        title: "运费类型", 
        list: [
          { title: '固定运费', value: 1, }, 
          { title: '运费模板', value: 2, }
        ], 
        value: 1, 
        alert: null, 
        disabled: false,
      },
      freight: { title: "运费", value: "", alert: null, isZero: true },
      freightTemp: { title: "运费模板", list: [], value: '', alert: null, disabled: false, },
      transportList: [],
    };
  },

  methods: {
    initFreight(goods){
      // if(goods && this.freightTemp.list.every(v => v.value != goods.transport_id)) goods.transport_id = null;
      this.freightType.value = goods && goods.transport_id ? 2 : 1;
      this.freightType.disabled = this.freightTemp.disabled = false;
      this.freight.value = goods ? goods.goods_freight : "";

      this.freightTemp.list = this.transportList;

      // 入驻商品
      if(goods && (goods.store_id != 1 || goods.is_vip)){
        let transportList = goods.transport_list;
        this.freightType.disabled = this.freightTemp.disabled = true;
        this.freightTemp.list = [{ id: goods.transport_id, title: transportList ? transportList.transport_title : '', }];
      }

      this.freightTemp.value = goods ? goods.transport_id || '' : '';
    },

    async getTransportList(){
      let res = await transportApi.getTransportList();

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取运费模板失败');

      if(res && res.data){
        res.data.forEach(v => { v.title = v.transport_title; v.value = v.transport_id; });

        this.freightTemp.list = this.transportList = res.data;
      }
    },

  },

  created(){
     
    this.getTransportList();

  },
}