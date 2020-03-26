<style scoped>
.preview_img{
  width:  100%;  
}

.form_img{
  width: 120px;
  margin-right: 10px;
}
</style>

<template>
  <div>
    <el-dialog :title='obj.title' :visible="showDialog" width="80%" @close='closeDialog'>
      <el-form label-width='100px'>

        <el-form-item :label='item.title || item.name' v-for='(item, index) in obj.list' :key='index'>
          <div v-if='item.type == "img"'>
            <div v-if='typeof item.value == "object"'>
              <img class='form_img' :style='item.style' :src='img' v-for='(img, imgIndex) in item.value' @click='preview(img)' :key='imgIndex' />
            </div>

            <img class='form_img' :style='item.style' :src='item.value' v-else @click='preview(item)' />
          </div>

          <span v-else>{{item.from ? obj.value[item.from] : item.value}}</span>
        </el-form-item>

      </el-form>
    </el-dialog>

    <el-dialog :visible="isPreview" width="80%" @close='closePreview'>
      <img class='preview_img' :src='img' @click='closePreview' v-if='img' />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'custom-view',

  props: {
    /**
     *  { 
     *    show:  Boolean
     *    value: bindObj
     *    list: [
     *       { title: '姓名', value: '1', },
     *       { title: '姓名', value: 'img.jpg', type: img,  },
     *       { title: '姓名', value: ['img1.jpg', 'img2.jpg'], from: '', type: img,  },
     *       { title: '姓名', value: '', from: 'name', },
     *    ] 
     * }
     * 
     */
    obj: {
      type: Object,
      default: {
        title: '',
        value: null,
      }
    }
  },

  data(){
    return {
      img: null,
    };
  },

  computed: {
    showDialog(){ return Boolean(this.obj.value) || this.obj.show; },
    isPreview(){ return this.img ? true : false; },
  },

  methods: {
    closeDialog(done){ 
      let o = this.obj;

      obj.value = obj.show  = false;

      this.$emit('close', obj); 
    },

    preview(item){  this.img = typeof item == 'object' ? item.value : item; },
    closePreview(){ this.img = null; },
  }
}
</script>