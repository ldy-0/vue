<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.titleKey ? obj[obj.titleKey] : obj.title">

        <div>
          <span v-if='obj.preValue'>{{obj.preValue}}</span>
          <el-input :class="{input: obj.preValue}" v-model.trim="obj.value" auto-complete="off" @input='getInput'></el-input>
          <span v-if='obj.postValue'>{{obj.postValue}}</span>
        </div>

        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>

  </el-form-item>
</template>

<script>
export default {
  name: 'customInput',

  props: {
    obj: {
      type: Object
    },
  },

  data() {
    return {
      pattern: /^\S{1,6}$/,
    }
  },

  computed: {
    
  },

  methods: {
    getInput(v){
      let o = this.obj;

      o.value = v;

      if(o.preventValidate) return ;

      if(!v) return o.alert = `请输入${o.title}`;

      if(!this.pattern.test(v)) return o.alert = `${o.title}数量必须为1-6个字符，不能使用空白符`;

      o.alert = null 
      // console.error('custom input obj : ', this.pattern.test(v), v);
    },
  }
}
</script>


