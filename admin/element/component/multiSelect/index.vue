<style scoped>
</style>

<template>
  <el-form-item :label="obj.title">
      <el-cascader clearable :options='obj.source' :props='{ label: obj.titleKey, value: obj.valueKey }' v-model='obj.value' @active-item-change='load' @change='search'></el-cascader>

      <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
  </el-form-item>
</template>

<script>
export default {
  name: 'multiSelect',

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
    load(v){ 
      this.$emit('load', v);
    },

    search(v){
      let obj = this.obj;

      if(!obj.search){
        obj.alert = obj.value[0]? null : `请选择${obj.title}`;
      }

      if(obj.search){
        this.$emit('search',v);
      }
    },
  }
}
</script>


