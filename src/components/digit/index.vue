<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title">
    <div>
      <span>{{obj.preValue}}</span>
      <el-input :class='{input: obj.preValue }' v-model="obj.value" auto-complete="off" @input='getInput'></el-input>
      <span>{{obj.postValue}}</span>
    </div>
        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
  </el-form-item>
</template>

<script>
export default {
  name: 'number',

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

      if(!o.value) return o.alert = `请输入${o.title}`;

      if(isNaN(Number(o.value))) return o.alert = `${o.title}必须为数字`;

      // console.error('custom input obj : ', v);
      o.alert = null;
    },
  }
}
</script>

