<template>
  <el-form-item :label="obj.title">

        <el-input v-model="obj.value" auto-complete="off" @input='getMobile'></el-input>

        <el-alert type='error' show-icon :title='obj.alert' :closable='false' v-if='obj.alert'></el-alert>

  </el-form-item> 
</template>

<script>
export default {
  name: 'mobile',

  props: {
    obj: {
      type: Object
    }
  },

  // watch: {
  //   obj(v1, v2){ console.error('watch'); }
  // },

  data() {
    return {
    }
  },

  computed: {
  },

  methods: {
    getMobile(v){
      let pattern = /^(0?\d{2,3}-\d{7,8}|((13|18)[0-9]|14[579]|15[0-35-9]|17[0135678])\d{8})$/;

      this.obj.alert = pattern.test(v) ? null : `${this.obj.title}输入不正确`;
      // console.error('obj : ', v, pattern.test(v));

    },
  }

}
</script>

<style scoped>

</style>
