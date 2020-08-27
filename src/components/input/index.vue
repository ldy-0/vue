<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title">
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
    // validate: {
    //   type: Boolean,
    //   default: true,
    // }
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
      // console.error('custom input obj : ', v);

    },
  }
}
</script>


