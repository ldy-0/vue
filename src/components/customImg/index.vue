<template>
  <el-form-item :label="obj.title" :label-width="obj.width || '100px'">
    <div v-if="obj.type == 'multi'">
      
      <div class='inline' :key='imgIndex' v-for='(imgItem, imgIndex) in obj.value'>
        <el-upload list-type="picture-card" :class="{disabled: imgItem.value.length}" :action='obj.url' :data='obj.body' :limit='obj.limit'
                :file-list='imgItem.value' 
                :on-remove='(e, list) => changeMultiImgs(e, list, imgItem, imgIndex)'
                :on-change="(e, list) => changeMultiImgs(e, list, imgItem, imgIndex)" 
                :on-preview='preview'
                :on-success='success'
                :disabled="obj.disabled"
                multiple
                v-if='obj.url'>
                <i class="el-icon-plus"></i>
        </el-upload>
        <div>{{imgItem.title}}</div>
      </div>

    </div>
    <div v-else>
        <el-upload list-type="picture-card"
              :class="{disabled:showCard}"
              :action='obj.url' 
              :data='obj.body'
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs" 
              :on-preview='preview'
              :on-success='success'
              :disabled="obj.disabled"
              multiple
              v-if='obj.url'>
              <i class="el-icon-plus"></i>
        </el-upload>
        <el-upload action='' list-type="picture-card" :auto-upload="false"
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs"
              :on-preview='preview'
              :class="{disabled:showCard}"
              :disabled="obj.disabled"
               v-else>

              <i class="el-icon-plus"></i>

        </el-upload>

        <!-- tip -->
        <div class='tip' v-if='obj.tip'>{{obj.tip}}</div>
    </div>

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
  watch: {},

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

    changeMultiImgs(e, list, item){
      let obj = this.obj,
          arr = obj.value;

      item.value = list;

      if(obj.preventValidate) return ;

      let res = arr.filter(v => !v.value.length)[0];
      this.obj.alert = res ? `${res.title || obj.title}不能为空` : null;
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

.tip{
  color: #f00; 
}

.inline{
  display: inline-block;
  margin: 0 10px 0 0;
  text-align: center;
  color: #666;
}

.el-upload--picture-card{
  margin: 0 0 21px 0;
}
</style>
