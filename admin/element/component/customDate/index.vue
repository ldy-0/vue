<template>
  <el-form-item :label="obj.title">

        <el-date-picker v-model="obj.value" 
                        :type="obj.type || 'datetimerange'" 
                        :picker-options="obj.isNow ? pickerOptions : {}"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @input='getInput'></el-date-picker>

        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>

  </el-form-item>
</template>

<script>
export default {
  name: 'dateRange',

  props: {
    obj: {
      type: Object
    },
  },

  data() {
    return {
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now()-86400000;
        }
      },
    }
  },

  computed: {
    
  },

  watch: {
  },

  methods: {
    getInput(v){
      let o = this.obj;

      if(o.preventValidate) return ;

      o.alert = (/range/.test(this.type) ? o.value.length : o.value) ? null : `请输入${o.title}`;

    },
  }
}
</script>

<style scoped>

</style>
