<template>
  <el-form-item :label="obj.title" :label-width="obj.width || '100px'">
        <el-upload list-type="picture-card"
              :action='obj.url' 
              :data='obj.body'
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs" 
              :on-preview='preview'
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
              :on-preview='preview'
              :class="{disabled:showCard}"
               v-else>

              <i class="el-icon-plus"></i>

        </el-upload>

        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>

        <!-- preview -->
        <div class='preview_mask' v-if='previewUrl' @click='previewUrl = null'>
          <img class='preview_img' :src='previewUrl' @click.stop=';' />
        </div>
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
      previewUrl: null,
    }
  },

  methods: {
    preview(file){
      this.previewUrl = file.url;
    },

    changeImgs(e, list){
      let obj = this.obj;

      obj.value = list;

      if(obj.preventValidate) return ;

      this.obj.alert = this.obj.value.length ? null : '请选择图片';
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

.preview_mask{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  text-align: center;
}
.preview_img{
  width: 800px;
  height: 600px;
  margin: 40px 0 0;
  background: #fff;
}
</style>
