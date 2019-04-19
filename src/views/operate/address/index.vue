<style lang="css">
.form_wrap{
  padding: 20px;
}

.submit_btn{
  margin-left: 100px;
  background: #42b983;
  color: #fff;
}
</style>

<template>
<div>
  <div class='form_wrap'>
    <el-form label-width='100px' style="width:50%;margin-top:100px">
        <custom-input :obj="name"></custom-input>
        <mobile :obj="phone"></mobile>
        <custom-input :obj="address"></custom-input>
    </el-form>

    <el-button class='submit_btn' @click='submit'>确定</el-button>
  </div>

</div>
</template>
<script>

import api from './api.js'
import mobile from '@/components/mobile'
import customInput from '@/components/input'
export default {

  components: {
    mobile,
    customInput,
    // editor,
  },

  data() {
    return {
      name: { title: '收货人', value: '', alert: null, },
      phone: { title: '联系电话', value: '', alert: null, },
      address: { title: '收货地址', value: '', alert: null, },
    }
  },

  methods: {
    async submit(){
      let param,
        paramArr = ['name','phone','address'];
      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;
      this.canSubmit = false;
      param = {
        value:{
          name:this.name.value,
          phone:this.phone.value,
          address:this.address.value,
        }
      }
      let  res = await api.editBusiness(param,this);
      if(res.status ==0){
        this.$message.success('操作成功');
      } else{
        this.$message.error('操作失败');
      }
      this.canSubmit = true;
      this.getItem();
    },
    

    // request
    async getItem(){
      let res = await api.getBusiness();
          this.name.value=res.data.name;
          this.phone.value=res.data.phone;
          this.address.value=res.data.address;
    },

    async save(param){
      let res = this.isAdd ? await api.setAbout(param, this) : await api.updateAbout(this.formData.admin_id, param, this);

      this.isShowForm = false;
      this.canSubmit = true;

      this.getAbout();
    },
    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
    },
  },

  created(){
    this.getItem();
  }

}
</script>