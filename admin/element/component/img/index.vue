<template>
  <el-form-item :label="obj.title">
        <el-upload action='' list-type="picture-card"
              :auto-upload="false"
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs">

              <i class="el-icon-plus"></i>

        </el-upload>

        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
  </el-form-item>
</template>

<script>
export default {
  name: 'customImg',

  props: {
    obj: {
      type: Object
    }
  },

  watch: {
    obj(v1, v2){ console.error('watch'); }
  },

  data() {
    return {
      dialogTableVisible: false
    }
  },

  computed: {
    
  },

  methods: {
    changeImgs(e, list){
      this.obj.value = list;
      // console.error(`change img : `, this.obj, list.length)

      this.obj.alert = this.obj.value.length ? null : '请选择图片作为主图';
    },
  }
}
</script>

<style scoped>

</style>
