<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title">

    <div>
      <span>{{obj.preValue}}</span>
      <el-input :class='{input: obj.preValue || obj.postValue }' v-model="obj.value" auto-complete="off" @input='getInput'></el-input>
      <span>{{obj.postValue}}</span>
    </div>

    <el-alert type='error' show-icon :title='obj.alert' :closable='false' v-if='obj.alert'></el-alert>

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
      mRegexp: {
        integer: { pattern: /^[+]?\d+$/, alert: `必须为正整数`, },
        positive: { pattern: /^[+]?\d+(?:\.\d+)?$/, alert: `必须为正数`, },
        number: { pattern: /^[+-]?\d+(?:\.\d+)?$/, alert: `必须为数字`, },
      }
    }
  },

  computed: {
    
  },

  methods: {
    getInput(v){
      let o = this.obj,
          // current validate rule
          reg = o.custom || this.mRegexp[o.type || 'number'];

      if(o.preventValidate) return ;

      if(!o.value) return o.alert = `请输入${o.title}`;

      if(!reg.pattern.test(o.value)) return o.alert = `${o.title}${reg.alert}`;

      // if(isNaN(Number(o.value))) return o.alert = `${o.title}必须为数字`;

      // console.error('custom input obj : ', v);
      o.alert = null;
    },
  }
}
</script>

