<template>
  <el-form-item :label="obj.title">
        <el-upload list-type="picture-card"
              :action='obj.url' 
              :data='obj.body'
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs" 
              :on-success='success'
              multiple
              v-if='obj.url'
              :class="{disabled:showCard}">
              <i class="el-icon-plus"></i>
        </el-upload>
        <el-upload action='' list-type="picture-card" :auto-upload="false"
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs"
              :class="{disabled:showCard}"
               v-else>

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
  computed:{
      showCard(){
          return  this.obj.value.length>=Number(this.obj.limit);
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

  methods: {
    changeImgs(e, list){
      this.obj.value = list;
      this.obj.alert = this.obj.value.length ? null : '请选择图片作为主图';
    },
    success(res){
      let url = `${this.obj.cdnUrl}/${res.key}`;
      // this.obj.value.push(url);
    }
  }
}
</script>

<style>
  .disabled .el-upload--picture-card{
    display: none;
  }
</style>
