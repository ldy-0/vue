<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title">

      <el-select placeholder="请选择" v-model='obj.value' @change='search'> <!-- multiple  -->
        <el-option v-for="item in obj.list || obj.categories" :key="item.id" :label="obj.titleKey ? item[obj.titleKey] : item.name" :value="item.valueKey ? item[obj.valueKey] : item.id"></el-option>
      </el-select>

      <el-alert type='error' show-icon :title='obj.alert' :closable='false' v-if='obj.alert'></el-alert>

  </el-form-item>
</template>

<script>
export default {
  name: 'customSelect',

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

    search(v){
      let obj = this.obj;
      // console.error('search: ', v); 
      obj.alert = typeof obj.value === 'number' || obj.value ? null : `请选择${obj.title}`;
    },

  }

}
</script>


