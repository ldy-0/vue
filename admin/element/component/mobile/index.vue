<template>
  <el-form-item :label="obj.title">
        <el-input v-model="obj.value" auto-complete="off" @input='getMobile'></el-input>
        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
  </el-form-item> 
</template>

<script>
export default {
  name: 'img',

  props: {
    obj: {
      type: Object
    }
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
    getMobile(v){
      let pattern = /^((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(17[0135678])|(18[0-9]))\d{8}$/;

      this.obj.alert = pattern.test(v) ? null : '手机号输入不正确';
      console.error('obj : ', v, pattern.test(v));

    },
  }
}
</script>

<style scoped>

</style>
