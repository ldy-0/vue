import api from '@/api/member';

export default {

  data(){
    return {
      
    };
  },

  methods: {

    async clearDScoreRecord(item){

      let param = {
        type: 'rcblog',
      };

      let res = await api.changeStatus(item.member_id, param);

      this.$message({ message: res.error || '清除成功', type: res.error ? 'danger' : 'success' });

      this.getList();
    }

  },

}