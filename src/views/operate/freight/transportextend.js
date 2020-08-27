import api from '@/api/transport' 

export default {
  methods: {
    
    validateArea(){
      let validArr = ['basicNum', 'extNum', 'basicPrice', 'extPrice'],
          area = this.area;

      // for(let i = 0, len = this.area.length; i < len; i++){
        // let area = this.area[i];

        if(!area.province.value.length) return area.province.alert = `${area.province.title}不能为空`;
        if(!area.city.value.length) return area.city.alert = `${area.city.title}不能为空`;

        validArr.forEach(v => !area[v].value ? area[v].alert = `${area[v].title}不能为空` : null);

        if(area.basicNum.alert || area.basicPrice.alert || area.extNum.alert || area.extPrice.alert) return true;
      // }
    },

    async submitArea(){
      let status = this.dialogConfig.status,
          area = this.area,
          cityArr = area.city.list,
          cityIdArr = area.city.value,
          param;

      // this.mockArea();

      if(this.validateArea()) return ;
      
      this.stopSubmit = true;
      
      param = {
        transport_id: this.detail.transport_id || this.detail.id,
        start: area.basicNum.value,
        plus: area.extNum.value,
        postage: area.basicPrice.value,
        postageplus: area.extPrice.value,
        areas: `${cityIdArr.join(',')}|||${cityIdArr.map(id => cityArr.find(v => v.id == id).title)}`,
      };

      this.saveArea(param);
    },

    async saveArea(param){
      let status = this.dialogConfig.status;
      let res = null;

      res = this.detail.transport_id ? await api.addTransportExtend(param) : await api.setTransportExtend(this.detail.transportext_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '保存运费模版区域信息失败'}`);
      }

      if(res.status == 0) this.$message.success('操作成功');
      this.getList();

      this.dialogConfig.status = 0;

      this.stopSubmit = false;
    },

    async deleteArea(item){
      let res = await api.deleteTransportExtend(item.transportext_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

      this.getList();
    },

    mockArea(){
      this.area.name.value = 'ttt';
      this.area.company.value = 123;
      this.area.basicNum.value = 1;
      this.area.extNum.value = 2;
      this.area.basicPrice.value = 3;
      this.area.extPrice.value = 4;
    },

  }
}