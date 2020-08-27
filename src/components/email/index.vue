<template>
  <el-form-item :label="obj.title">
        <el-input v-model="obj.value" auto-complete="off" @input='getInput'></el-input>
        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
  </el-form-item> 
</template>

<script>
export default {
  name: 'email',

  props: {
    obj: {
      type: Object
    },
  },

  watch: {
    obj(v1, v2){ console.error('watch'); }
  },

  data() {
    return {
      dialogTableVisible: false
    }
  },

  computed: {
    
  },

  methods: {
    getInput(v){
      let o = this.obj,
          pattern = /^((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(17[0135678])|(18[0-9]))\d{8}$/;

      if(o.preventValidate) return ;

      o.alert = o.value ? null : '请输入邮箱';

    },
  }
}
</script>

<style scoped>

</style>
