<style scoped>
</style>

<template>
  <div>
    <el-form label-width='68px'>
      <el-form-item :label='obj.title' label-width='110px' v-if='obj.title'></el-form-item>

      <c-input :obj='obj.max'></c-input>

      <c-input :obj='obj.multiple'></c-input>

      <c-input :obj='obj.start'></c-input>

      <c-input :obj='obj.fee'></c-input>


    </el-form>

  </div>
</template>
<script>
import cInput from '@/components/customInput'

export default {
  name: 'dscore',

  components: {
    cInput,
  },

  props: {
    obj: {
      type: Object,
      default: {
        title: '',
      }
    }
  },

  data(){
    return {

    };
  },

  created(){
  },

  methods: {
  }
}
</script>