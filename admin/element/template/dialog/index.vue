<style lang="css" scoped>
.content_wrap{
  margin: 20px 0;
}
</style>

<template>
<div class="notice">

  <div>
    <el-form label-width='100px'>
      <!-- <custom-img :obj='img'></custom-img> -->

      <!-- <custom-input :obj='name'></custom-input> -->

      <!-- <custom-input :obj='num'></custom-input> -->

      <!-- <custom-input :obj='price'></custom-input> -->

      <!-- <custom-select :obj='company'></custom-select> -->

      <!-- <custom-radio :obj="status"></custom-radio> -->

      <el-form-item class='content_wrap' :label="content.title">
        <editor style='width: 800px;' v-model='content.value'></editor>
        <el-alert type='error' :title='content.alert' v-if='content.alert'></el-alert>
      </el-form-item>
      
    </el-form>

    <el-button type="primary" :disabled="submiting" :loading="submiting" @click="submit">确 定</el-button>
  </div>

</div>
</template>
<script>
import commonReq from '@/api/common' 
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import customSelect from '@/components/customSelect'
import customRadio from '@/components/customRadio'
import editor from '@/components/Tinymce'
import contact from './contact';

export default {
  components: {
    customInput,
    customImg,
    customSelect,
    customRadio,
    editor,
  },

  mixins: [contact],

  computed: {
  },

  data() {
    return {
      img: { title: '主图', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      name: { type: 'string', title: 'name', value: '', alert: null, },
      num: { type: 'integer', title: 'num', value: '', alert: null, },
      price: { type: 'positive', title: 'price', value: '', alert: null, },
      company: { title: 'company', valueKey: 'value', list: [], value: '', alert: null, },
      status: { title: '是否启用', list: [ { title: '是', value: 1, }, { title: '否', value: 2 } ], value: 1, alert: null, },

      submiting: false,

      successTip: '操作成功',
    }
  },

  watch: {
    content: {
      deep: true,
      handler(v1, v2){ this.content.alert = this.content.value ? null : `${this.content.title}不能为空!`; }
    },
  },

  methods: {
    validError(){
      let validArr = this.validArr;
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(!this[key].value){ this[key].alert = `${this[key].title}不能为空!`; }

        if(this[key].alert) return true;
      }
    },

    submit(){
      let imgList = this.img.value,
          param;

      // this.mock();
      if(this.validError()) return ;
      
      this.submiting = true;

      param = {
        name: this.name.value,
      };

      this.save(param);
    },

    // 
    async save(param){
      let res = null;

      res = await api.setTransport(this.detail.transport_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.submiting = false;
        return this.$message.error(`${res ? res.error || res : '保存运费模板信息失败'}`);
      }

      if(res.status == 0) this.$message.success('操作成功');

      this.submiting = false;
    },

    // async getUploadToken(){
    //   let res = await commonReq.getUploadToken();

    //   if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

    //   this.img.body.token = res.data;
    //   this.img.body.config = "{ useCdnDomain: true }";
    // },

    // immutable
    initPage(){
      let route = this.$route,
          name = route.name,
          methodsName = route.name[0].toUpperCase() + route.name.slice(1);

      this.type = name;

      this.validArr = this[`valid${name}Arr`];

      this.submit = this[`submit${methodsName}`];
      this.validError = this[`valid${methodsName}Error`];
      this.save = this[`save${methodsName}`];
      this.mock = this[`mock${methodsName}`];
    },
    
    mock(){},
  },

  created(){
    this.initPage();
  },
}
</script>