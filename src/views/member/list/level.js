import api from '@/api/member';

export default {

  data(){
    return {
      levelItem: null,
      level: { 
        title: '会员等级', 
        value: '', 
        alert: null, 
        categories: [
          { id: 0, title: '体验代理', },
          { id: 1, title: 'VIP1', },
          { id: 2, title: 'VIP2', },
          { id: 3, title: 'VIP3', },
          { id: 4, title: 'VIP4', },
        ],
      },
    };
  },

  methods: {

    openLevelDialog(item){

      let aValidate = ['level'];
      aValidate.forEach(v => {
        this[v].value = '';
        this[v].alert = null;
      });

      this.dialogConfig.status = 7;

      this.level.value = item.vip_level;

      this.levelItem = item;

    },

    submitLevel(){
      let aValidate = ['level'];

      this.validateLevel(aValidate);

      if(aValidate.some(v => this[v].alert)) return ;

      let loading = this.$loading({ text: '正在提交...' });

      let param = {
        type: 'vip_level',
        vip_level: this.level.value,
      };

      this.saveLevel(param, loading);
    },

    validateLevel(arr){
      let level = this.level,
          item = this.levelItem;

      arr.forEach(v => {
        if(!this[v].value) this[v].alert = `请输入${this[v].title}`;
      });
    },

    async saveLevel(param, loading){
      let res = await api.changeStatus(this.levelItem.member_id, param);

      if(res && res.status == 0) this.$message.success('操作成功');

      if(typeof res == 'string' || res.error) this.$message.error(res.error || res);
      
      loading.close();

      this.dialogConfig.status = 0;

			this.getList()
    },

    closeLevelDialog(){
      this.dialogConfig.status = 0;
    }

  },

}