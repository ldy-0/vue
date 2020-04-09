import api from '@/api/member';

export default {

  data(){
    return {
      score: { title: '德分数量', value: '', alert: null, type: 'number', },
      asset: { title: '资产数量', value: '', alert: null, type: 'number', },
      modifyCategory: { 
        title: '类别', 
        value: '', 
        alert: null, 
        categories: [
          { id: 1, name: '互转德分' },
          { id: 2, name: '消费德分' },
          { id: 3, name: '资产' },
        ], 
        EXCHANGE: 1,
        CONSUME: 2,
        ASSET: 3,
      },
    };
  },

  methods: {

    showModify(item){
      let tableConfig = this.tableConfig,
          modifyCategory = this.modifyCategory,
          score = this.score,
          asset = this.asset;

      this.dialogConfig.status = tableConfig.MODIFY;
      this.member_id = item.member_id;

      score.value = asset.value = '';
      score.alert = asset.alert = null;

      modifyCategory.value = 1;
      modifyCategory.alert = null;
    },


  },

}