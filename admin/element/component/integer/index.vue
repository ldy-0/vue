<template>
  <el-form-item :label="obj.title">
        <el-input v-model="obj.value" auto-complete="off" @input='getInput'></el-input>
        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
  </el-form-item>
</template>

<script>
export default {
  name: 'img',

  props: {
    obj: {
      type: Object
    },
  },

  data() {
    return {
    }
  },

  computed: {
    
  },

  methods: {
    getInput(v){
      let o = this.obj;

      if(o.preventValidate) return ;

      o.alert = o.value ? null : `请输入${o.title}`;

      o.alert = isNaN(Number(o.value)) ? `${o.title}必须为数字` : null;

      o.alert = o.value > 0 ? null : `${o.title}必须大于零`;

      o.alert = o.value % 1 === 0 ? null : `${o.title}必须为整数`;
      // console.error('custom input obj : ', v);

    },
  }
}
</script>

<style scoped>

</style>
