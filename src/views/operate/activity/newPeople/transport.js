import transportApi from "@/api/transport";

export default {
  data(){
    return {
      freightType: { title: "运费类型", list: [{ title: '固定运费', value: 1, }, { title: '运费模板', value: 2, }], value: 1, alert: null, },
      freight: { title: "运费", value: "", alert: null, isZero: true },
      freightTemp: { title: "运费模板", list: [], value: '', alert: null, },
    };
  },

  methods: {

    async getTransportList(){
      let res = await transportApi.getTransportList();

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取运费模板失败');

      if(res && res.data){
        res.data.forEach(v => { v.title = v.transport_title; v.value = v.transport_id; });

        this.freightTemp.list = res.data;
      }
    },

  },

  created(){
     
    this.getTransportList();

  },
}