export default {

  data(){
    return {
      owner: { title: "是否添加对接人", categories: [{ id: 1, title: "是" }, { id: 2, title: "否" }], value: 2, alert: null, disabled: false, },
      ownerCode: { type: 'text', title: '对接人邀请码', value: '', alert: null, disabled: false, },
      ownerVip0Award: { type: 'positive', title: '体验代理', post: '元', value: '', alert: null, disabled: false, },
      ownerVip1Award: { type: 'positive', title: 'VIP1佣金', post: '元', value: '', alert: null, disabled: false, },
      ownerVip2Award: { type: 'positive', title: 'VIP2佣金', post: '元', value: '', alert: null, disabled: false, },
      ownerVip3Award: { type: 'positive', title: 'VIP3佣金', post: '元', value: '', alert: null, disabled: false, },
      ownerVip4Award: { type: 'positive', title: 'VIP4佣金', post: '元', value: '', alert: null, disabled: false, },
    };
  },

  methods: {
    initOwner(goods){
      let ownerPropArr = ['ownerVip0Award', 'ownerVip1Award', 'ownerVip2Award', 'ownerVip3Award', 'ownerVip4Award'],
          arr = ['agent_commission_0', 'agent_commission_1', 'agent_commission_2', 'agent_commission_3', 'agent_commission_4'];

      let sku = goods ? goods.SKUList[0] : {};
      // 普通，vip商品编辑只能编辑对接返还金额, 入驻商品有对接人只能修改金额,没有对接人可添加对接人
      this.owner.disabled = this.ownerCode.disabled = (this.dialogConfig.status == 2 && (this.category.value != 2 || sku.agent_id)) ? true : false;

      this.owner.value = sku && sku.agent_id ? 1 : 2;
      this.ownerCode.value = goods ? goods.agent_mobile : '';

      ownerPropArr.forEach((prop, i) => {
        this[prop].value = sku ? sku[arr[i]] : '';
        this[prop].alert = null;
      });
    },

    changeCategory(categoryIndex){
      let aStr = ['元', '互转德分'],
          objNames = ['ownerVip0Award', 'ownerVip1Award', 'ownerVip2Award', 'ownerVip3Award', 'ownerVip4Award'];
      
      objNames.forEach(v => { this[v].value = ''; this[v].post = aStr[categoryIndex]; });
      this.ownerCode.value = '';
    },

    changeOwner(ownerIndex){
      let aStr = ['元', '互转德分'],
          objNames = ['ownerVip0Award', 'ownerVip1Award', 'ownerVip2Award', 'ownerVip3Award', 'ownerVip4Award'],
          index = this.category.value;
      
      if(ownerIndex == 1){
        objNames.forEach(v => { 
          if(typeof index == 'number') this[v].post = aStr[index]; 
          this[v].value = ''; 
        });

        this.ownerCode.value = '';
      }
    },

  },

  created(){
  }
}