<style scoped>
</style>

<template>
  <div>
    <el-form label-width='68px'>
      <el-form-item :label='obj.title' label-width='210px' v-if='obj.title'></el-form-item>

      <c-input :obj='obj.refuse'></c-input>

    </el-form>

  </div>
</template>
<script>
import cInput from '@/components/customInput'

export default {
  name: 'refuseGoods',

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