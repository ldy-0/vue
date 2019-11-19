<style scoped>
</style>

<template>
  <div>
    <el-form label-width='100px'>

      <c-input :obj='obj.name'></c-input>
      <c-input :obj='obj.id'></c-input>
      <c-img   :obj='obj.idImg'></c-img>

      <c-input :obj='obj.bank'></c-input>
      <c-input :obj='obj.bankId'></c-input>
      <c-input :obj='obj.mobile'></c-input>
      <c-input :obj='obj.storeName'></c-input>
      <c-select :obj='obj.storeClass'></c-select>
      <c-img   :obj='obj.storeLicenseImg'></c-img>
      <c-img   :obj='obj.logoImg'></c-img>
      <c-img   :obj='obj.goodsLicenseImg'></c-img>

    </el-form>

  </div>
</template>
<script>
import cInput from '@/components/customInput'
import cImg from '@/components/customImg'
import cSelect from '@/components/customSelect'

export default {
  name: 'store',

  components: {
    cInput,
    cImg,
    cSelect,
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

  computed: {
  },

  methods: {
  }
}
</script>