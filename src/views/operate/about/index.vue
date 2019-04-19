<style lang="css">
.form_wrap{
  padding: 20px;
}

.submit_btn{
  margin-left: 100px;
}
</style>

<template>
<div>

<!-- <el-container class="notice"> -->

  <!-- <el-header class="header">

    <custom-head :config='headConfig' @add='showForm'></custom-head> 

  </el-header> -->
  <div class='form_wrap'>
    <el-form label-width='100px'>

      <custom-img :obj='img'></custom-img>

      <!-- <mobile :obj='mobile'></mobile>  -->
      
      <custom-input :obj='phone'></custom-input>

      <custom-input :obj='address'></custom-input>

      <email :obj='email'></email>

      <el-form-item :label="desc.title">
        <editor style='width: 800px;' v-model='desc.value'></editor>
      </el-form-item>

    </el-form>

    <el-button class='submit_btn' @click='submit'>确定</el-button>
  </div>

  <!-- <custom-form class='form' :config='formConfig' :detail='formData' @submit='submit'></custom-form> -->

<!-- </el-container> -->
</div>
</template>
<script>

// import api from './api.js'
// import base from './base.js'
import customImg from '@/components/img'
import mobile from '@/components/mobile'
import customInput from '@/components/input'
import email from '@/components/email'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";

export default {
  // mixins: [base],

  components: {
    customImg,
    mobile,
    customInput,
    email,
    editor,
  },

  data() {
    return {
      formConfig: {
        width: '80%',    
        labelWidth: '200px',
        canSubmit: true,
        showCancel: true,
        isCenter: true,
        classList: [
          { key: '主图', value: 'img', isImg: true, },
          { key: '客服电话', value: 'phone', isText: true, },
          { key: '地址', value: 'address', isText: true, },
          { key: '邮箱', value: 'email', isText: true, },
          { key: '其他信息', value: 'detail', isRichEditor: true },
        ],
        // rules: {
        //   'admin_name': [ 
        //     { required: true, message: '请输入姓名!', trigger: 'blur' },
        //     { message: '姓名必须是6~15位!', min: 6, max: 15 } 
        //   ],
        // }
      },
      formData: {},
      isAdd: true,
      img: { title: '主图', value: [], limit: 4, alert: null },
      phone: { title: '电话', value: '', alert: null },
      address: { title: '地址', value: '', alert: null, preventValidate: true },
      email: { title: '邮箱', value: '', alert: null, preventValidate: true },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    // initForm(item){
    //   let o = {};

    //   if(item){
    //     item.admin_pwd = '';
    //     return this.formData = item;
    //   }

    //   this.dialogConfig.addList.forEach(v => o[v.value] = v.isRadio ? 0 : '');
    //   this.formData = o;
    // },
    async submit(img){
      let o = this.formData,
          paramArr = ['phone', ],
          param;

      this.canSubmit = false;

      this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;

      console.error(this.img.value, this.phone.value, this.address.value, this.email.value, this.desc.value);

      let uploadArr = this.img.value.filter(v => v.raw).map(v => v.raw);
      let imgRes = await uploadFn(uploadArr);

      console.error('imgRes :', imgRes);

      param = {
        value: `${JSON.stringify(img)}&|${o.phone}&|${o.address}&|${o.email}&|${o.detail}`,
      };

      // return console.error(img, o, 'about param : ', param);
      // this.save(param);
    },
    

    // request
    async getAbout(){
      let res = await api.getAbout();

      if(res){
        let arr = res.split('&|');
        this.formData = {
          img: JSON.parse(arr[0]),
          phone: arr[1],
          address: arr[2],
          email: arr[3],
          detail: arr[4],
        }
      }
    },
    // async getList(){
    //   this.isLoading = true;
    //   let res = { img: JSON.parse('[]'), detail: '', }; // await api.getUserList(this.param, this);

    //   this.formData = res;
    //   if(res && res.data){
    //     // res.data.forEach(v => {
    //     //   if(v.is_admin) this.classList.slice(1).forEach(o => v[o.value] = 1);
    //     //   v.admin_limits.forEach(k => v[k] = 1);
    //     // });

    //     // this.list = res.data.data;
    //     // this.total = res.pagination ? res.pagination.total : 0;
    //   }
    //   // console.error('get list res: ', res, this.list);
    //   this.isLoading = false;
    // },

    async save(param){
      let res = this.isAdd ? await api.setAbout(param, this) : await api.updateAbout(this.formData.admin_id, param, this);

      this.isShowForm = false;
      this.canSubmit = true;

      this.getAbout();
    },

    // async deleteUser(item){
    //   let res = await api.deleteUser(item.admin_id, null, this);

    //   this.getList();
    // },
  },

  created(){
    // this.getAbout();
  }

}
</script>