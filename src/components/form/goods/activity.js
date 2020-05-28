import api from "@/api/goods";

export default {
  data(){
    return {
      activityIcon: { title: "活动图标", value: [], limit: 1, alert: null, url: '', cdnUrl: '', body: {}, width: '120px' },
    };
  },

  methods: {
    async clearActivity(type){
      let loading = this.$loading();

      let res = await api.changeGoods({ type, });

      if(typeof res === 'string' || !res || res.error) return this.handleError(res ? res.error || res : '修改失败', loading);

      this.$message.success("操作成功");
      loading.close();
    },

  },
}