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
        <custom-input :obj='name'></custom-input>

        <custom-img :obj='img'></custom-img>

        <el-form-item :label="content.title">
          <editor style='width: 800px;' v-model='content.value'></editor>
        </el-form-item>
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
      name: { type: 'string', title: '标题:', value: '', err: '标题不能为空!', alert: null, },
      img: { title: '上传图片:', value: [], limit: 1, alert: null, width: '150px', },
      content: { title: "简介:", value: "", alert: null },

      doing: false,
    }
  },

  methods: {
    async submit(){
      let paramArr = [],
          param;

      if(vd.isEmpty(this.name.value)) return this.$message.error(this.name.err);

      this.img.alert = this.img.value.length ? null : '图片不能为空!';
      if(this.img.alert) return this.$message.error(this.img.alert);

      let loading = this.$loading();
      if(this.doing) return ;
      this.doing = true;

      let imgList = await uploadFn(this.img.value.filter(v => v.raw).map(v => v.raw));
      imgList = imgList.concat(this.img.value.filter(v => !v.raw).map(v => v.url));

      param = {
        company_title: this.name.value,
        company_image: imgList[0],
        company_brief: this.content.value,
      };

      this.saveCompany(param, loading);
    },

    async getCompany(){
      let res = await api.getCompany();

      if(res && res.status == 0){
        if(!res.data) return ;

        this.name.value = res.data.company_title;
        this.content.value = res.data.company_brief;
        return this.img.value = [{ url: res.data.company_image, }];
      }

      this.$message.error(res ? res.error || res : '获取企业介绍信息失败');
    },

    async saveCompany(param, loading){
      let res = await api.setCompany(param);
      loading.close(this.doing = false);

      res && res.status == 0 ? this.$message.success(`保存成功!`) : this.$message.error(res.error || res);

      this.getCompany();
    },

    init(){
      let route = this.$route,
          name = route.name;

      this.getCompany();
    },

  },

  created(){
    this.init();
  }

}
</script>