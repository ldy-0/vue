<style scoped>
.preview_img{
  width:  100%;  
}

.form_img{
  width: 120px;
  margin-right: 10px;
}
.form_input{
  height: 36px;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>

<template>
  <div v-if="config">
    <el-dialog :title='config.title' :visible="config.show" width="80%" @close='closeDialog'>
      <el-form :label-width='config.width || "100px"'>

        <el-form-item :label='item.title || item.name' :label-width='item.width || (item.title ? "100px" : "0px")' v-for='(item, index) in config.list' :key='index'>
          <input class="form_input" :style="item.style" v-model="item.value" :disabled="item.disabled" v-if="item.type === INPUT" />

          <div v-else-if="item.type == IMG">
            <div v-if='typeof item.value == "object"'>
              <img class='form_img' :style='item.style' :src='img' v-for='(img, imgIndex) in item.value' @click='preview(img)' :key='imgIndex' :alt="imgIndex" />
            </div>

            <img class='form_img' :style='item.style' :src='item.value' v-else @click='preview(item)' />
          </div>

          <div v-else-if="item.type === VIDEO">
            <video :style="item.style" :src="item.value"></video>
          </div>

          <span v-else>{{item.value}}</span>
        </el-form-item>

      </el-form>

      <slot></slot>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit" v-if="config.submit">{{config.submit}}</el-button>
      </div>
    </el-dialog>

    <!-- preview -->
    <el-dialog :visible="isPreview" width="80%" @close='closePreview'>
      <img class='preview_img' :src='img' @click='closePreview' v-if='img' />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'form-form',

  props: {
    config: {
      type: Object,
    },
  },

  data(){
    return {
      IMG: 'img',
      INPUT: 'input',
      VIDEO: 'video',

      img: null,
    };
  },

  computed: {
    isPreview(){ return this.img ? true : false; },
  },

  methods: {
    closeDialog(done){
      let config = this.config;

      if(!config.lazy) config.show = false;

      this.$emit('close', config);
    },

    submit() {
      this.$emit('submit', this.config);
    },

    preview(item){  this.img = typeof item == 'object' ? item.value : item; },
    closePreview(){ this.img = null; },
  }
}
</script>