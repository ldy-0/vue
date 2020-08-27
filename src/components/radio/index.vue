<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title">
    <el-radio-group v-model="obj.value" @change='select'  :disabled="'disabled' in obj ? obj.disabled : false">
      <el-radio :label='item.id' v-for='(item, index) in obj.categories' :key='index'>{{item.name || item.title}}</el-radio>
    </el-radio-group>
    <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
  </el-form-item>
</template>

<script>
export default {
  name: 'radio',

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
    select(v){
      let obj = this.obj;
      // console.error('search: ', v); 
      obj.alert = typeof obj.value === 'number' ? null : `请选择${obj.title}`;

      this.$emit('change', v);
    },
  }
}
</script>


