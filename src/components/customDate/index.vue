<template>
  <el-form-item :label="obj.title" :label-width="obj.width || obj.labelWidth">

        <!-- Time -->
        <el-time-picker v-model="obj.value"
                        v-if="isTime || isTimeRange"
                        :is-range="isTimeRange"
                        :disabled="obj.disabled"
                        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="getInput"></el-time-picker>

        <!-- Date -->
        <el-date-picker v-model="obj.value" 
                        v-else
                        :type="obj.type || 'datetimerange'" 
                        :picker-options="obj.isNow ? pickerOptions : {}"
                        :disabled="obj.disabled"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="请选择日期" @change='getInput'></el-date-picker>

        <!-- Error -->
        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>

  </el-form-item>
</template>

<script>
export default {
  name: 'Date-Time',

  props: {
    /**
     * 
     * obj.type:  
     * 1. 日期 year|month|date|datetime|daterange|datetimerange
     * 2. 时间 time|timerange
     * 
     */
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
    isTime(){ return this.obj.type == 'time' },
    isTimeRange(){ return this.obj.type == 'timerange' },
  },

  watch: { },

  methods: {
    getInput(v){
      let o = this.obj;

      if(o.preventValidate) return ;

      o.alert = (/range/.test(o.type) ? o.value.length : o.value) ? null : `请输入${o.title}`;

    },
  }
}
</script>

<style scoped>

</style>
