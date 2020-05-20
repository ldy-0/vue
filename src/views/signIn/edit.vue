<style lang="stylus">
  .notice
    .header
      margin-top 20px
    .big-icon
      font-size 30px
      color #409EFF
    .big-icon-no
      font-size 30px
      color #b19999
      // color #F56C6C
</style>

<template>
<div>

<el-container class="notice">

  <el-main>

    <el-form :model="formData"  ref="ruleForm" :rules="rules">
      <!-- 名称 -->
      <el-form-item label="名词1(学生)" :label-width="formLabelWidth"  prop="words_name1">
        <el-input v-model="formData.words_name1" auto-complete="off"></el-input>
      </el-form-item>

      <!-- -->
      <el-form-item label="名词2(课程)" :label-width="formLabelWidth" prop='words_name2'>
        <el-input v-model="formData.words_name2" auto-complete="off"></el-input>
      </el-form-item>

      <!-- -->
      <el-form-item label="名词3(老师)" :label-width="formLabelWidth" prop='words_name3'>
        <el-input v-model="formData.words_name3" auto-complete="off"></el-input>
      </el-form-item>

    </el-form>

    <!-- <el-button @click="clearForm" >取消</el-button> -->
    <el-button type="primary" :disabled="!canSubmit" :loading="!canSubmit" @click="save('ruleForm')">确 定</el-button>
  
  </el-main>

</el-container>

</div>
</template>
<script>

import api from '@/api/seller' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  components: {
    UploadExcelComponent,
  },
  created(){
    this.getName()
  },
  data() {
    return {
      formLabelWidth:'120px',
      canSubmit: true,
      rules: {
        'words_name1': [ { required: true, message: '请输入名称', trigger: 'blur' } ],
        'words_name2': [ { required: true, message: '请输入名称', trigger: 'blur' } ],
        'words_name3': [ { required: true, message: '请输入名称', trigger: 'blur' } ],
      },
      formData: {
        name1: '',
        name2: '',
      },
      listParam: { 
        page: 1,
        limit: 10,
        address_name: '',
      },
      loadAddress: false,
      addressList: [],
      addressTotal: null,
      interval: null,
    }
  },
  methods: {
      async save(rule){
        let res = await this.$refs[rule].validate().catch(e => e);
        if(!res) return 

        this.canSubmit = false;
        console.log('formdata: ', this.formData);

        this.setName();
      },
      //
      async getName() { 
        this.loadAddress = true;

        let res = await api.getNames(null, this);
       console.log('get names : ', res.data); 
        this.formData = res.data;
        this.loadAddress = false;
      },
      async setName(){
        console.log('save formdata: ', this.formData);
        let res = await api.setNames(this.formData, this);
        this.canSubmit = true;
      }
      
  }
}
</script>