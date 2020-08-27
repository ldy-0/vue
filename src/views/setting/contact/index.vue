<style lang="css">
.form_wrap{
  padding: 20px;
}

.submit_btn{
  margin-left: 150px;
}
</style>

<template>
<div>
  <div class='form_wrap'>

    <div class='form_wrap'>
      <el-form label-width='150px' style="width:50%">
        <custom-img :obj='img'></custom-img>

        <custom-input :obj='phone'></custom-input>

        <custom-input :obj='mobile'></custom-input>

        <custom-input :obj='site'></custom-input>

        <custom-input :obj='address'></custom-input>

        <!-- <el-form-item :label="content.title">
          <editor style='width: 800px;' v-model='content.value'></editor>
        </el-form-item> -->
      </el-form>

      <el-button type='primary' class='submit_btn' @click='submit'>确定</el-button>
    </div>

  </div>

</div>
</template>
<script>

import commonReq from '@/api/common' 
import api from '@/api/setting'
import customImg from '@/components/customImg'
import customInput from '@/components/customInput'
import customSelect from '@/components/select'
import customRadio from '@/components/customRadio'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import asset from '@/components/form/asset'
import vd from "@/utils/validate";

export default {
  mixins: [],

  components: {
    customImg,
    customInput,
    customSelect,
    customRadio,
    editor,
  },

  computed: {
    pageName(){ return this.$route.name; },
    isSetting(){ return this.pageName === 'setting'; },
    isAsset(){ return this.pageName === 'asset'; },
  },

  data() {
    return {
      img: { title: '上传图片:', value: [], limit: 1, alert: null, width: '150px', err: '图片不能为空!', },
      phone: { type: 'string', title: '服务电话:', value: '', err: '服务电话不能为空!', alert: null, },
      mobile: { type: 'string', title: '联系电话:', value: '', err: '联系电话不能为空!', alert: null, },
      site: { type: 'string', title: '门户网站:', value: '', err: '门户网站不能为空!', alert: null, },
      address: { type: 'string', title: '公司地址:', value: '', err: '公司地址不能为空!', alert: null, },
      // content: { title: "简介:", value: "", alert: null },

      doing: false,
    };
  },

  methods: {
    async submit(){
      let paramArr = [],
          param;

      this.img.alert = this.img.value.length ? null : this.img.err;
      if(this.img.alert) return this.$message.error(this.img.alert);

      if(vd.isEmpty(this.phone.value)) return this.$message.error(this.phone.err);

      if(!vd.isMobile(this.mobile.value)) return this.$message.error(this.mobile.err);

      if(vd.isEmpty(this.site.value)) return this.$message.error(this.site.err);

      if(vd.isEmpty(this.address.value)) return this.$message.error(this.address.err);

      let loading = this.$loading();
      if(this.doing) return ;
      this.doing = true;

      let imgList = await uploadFn(this.img.value.filter(v => v.raw).map(v => v.raw));
      imgList = imgList.concat(this.img.value.filter(v => !v.raw).map(v => v.url));

      param = {
        contact_image: imgList[0],
        contact_serve: this.phone.value,
        contact_phone: this.mobile.value,
        contact_website: this.site.value,
        contact_site: this.address.value,
      };

      this.save(param, loading);
    },

    async getContact(){
      let res = await api.getContact();

      if(res && res.status == 0){
        if(!res.data) return ;

        this.phone.value = res.data.contact_serve;
        this.mobile.value = res.data.contact_phone;
        this.site.value = res.data.contact_website;
        this.address.value = res.data.contact_site;
        return this.img.value = [{ url: res.data.contact_image, }];
      }

      this.$message.error(res ? res.error || res : '获取联系信息失败!');
    },

    async save(param, loading){
      let res = await api.setContact(param);
      loading.close(this.doing = false);

      res && res.status == 0 ? this.$message.success(`保存成功!`) : this.$message.error(res.error || res);

      this.getContact();
    },

    init(){
      let route = this.$route,
          name = route.name;

      if(name === 'contact'){
        this.getContact();
      }
    },

  },

  created(){
    this.init();
  }

}
</script>