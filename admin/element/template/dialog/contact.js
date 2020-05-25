export default {

  data(){
    return {
      validContactArr: [],

      content: { title: '内容', value: '', alert: null, },
    }
  },

  methods: {
    validContactError(){
      let validArr = this.validContactArr;
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(!this[key].value){ this[key].alert = `${this[key].title}不能为空!`; }

        if(this[key].alert) return true;
      }

    },

    submitContact(){
      let param;

      this.mock();
      if(this.validError()) return ;
      
      this.submiting = true;

      param = {
        content: this.content.value,
      };

      console.error(param);
      this.save(param);
    },

    async saveContact(param){
      return this.submiting = false;
      let res = null;

      res = status == 1 ? await api.addTransport(param) : await api.setTransport(this.detail.transport_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.submiting = false;
        return this.$message.error(`${res ? res.error || res : '保存运费模板信息失败'}`);
      }

      if(res.status == 0) this.$message.success('操作成功');

      this.submiting = false;
    },

    mockContact(){
      let img = 'https://cdn.health.healthplatform.xyz/Fj2MUuTZ5UvAG0LqSFBcI__J1U2D';

      let list = [
        { id: 1, name: '1111', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 1, image: img, arr: ['1', '2'], },
        { id: 2, name: '1111', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 0, image: img, arr: ['1', '2'], },
      ];

      this.list = list;
      this.total = list.length;

    },

  },

}