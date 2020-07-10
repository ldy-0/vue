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
      <c-select :obj='obj.companyClass'></c-select>
      <c-radio :obj='obj.invoice'></c-radio>
      <c-img   :obj='obj.storeLicenseImg'></c-img>
      <c-img   :obj='obj.logoImg'></c-img>
      <c-img   :obj='obj.goodsLicenseImg'></c-img>

      <el-form-item :label='obj.account.title' :label-width='obj.account.width || (obj.account.title ? "100px" : "0px")' v-if='obj.account.value'>{{obj.account.value}}</el-form-item>
      <el-form-item :label='obj.pwd.title' :label-width='obj.pwd.width || (obj.pwd.title ? "100px" : "0px")' v-if='obj.pwd.value'>{{obj.pwd.value}}</el-form-item>

    </el-form>

  </div>
</template>
<script>
import cInput from '@/components/customInput'
import cImg from '@/components/customImg'
import cSelect from '@/components/customSelect'
import cRadio from '@/components/customRadio'

export default {
  name: 'store',

  components: {
    cInput,
    cImg,
    cSelect,
    cRadio,
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