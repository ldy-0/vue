<style scoped>
</style>

<template>
  <div>
    <el-form label-width='100px'>

      <c-date :obj='obj.date'></c-date>
      <c-input :obj='obj.score'></c-input>
      <c-select :obj='obj.level'></c-select>

      <c-img   :obj='obj.img'></c-img>

    </el-form>

  </div>
</template>
<script>
import cInput from '@/components/customInput'
import cImg from '@/components/customImg'
import cSelect from '@/components/customSelect'
import cDate from '@/components/customDate'

export default {
  name: 'store',

  components: {
    cInput,
    cImg,
    cSelect,
    cDate,
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

  methods: {
  },

}
</script>