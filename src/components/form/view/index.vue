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
    <el-dialog :title='obj.title' :visible="obj.show" width="80%" @close='closeDialog'>
      <el-form :label-width='obj.width || "100px"'>

        <el-form-item :label='item.title || item.name' :label-width='item.width || (item.title ? "100px" : "0px")' v-for='(item, index) in obj.list' :key='index'>
          <div v-if='item.type == "img"'>
            <div v-if='typeof item.value == "object"'>
              <img class='form_img' :style='item.style' :src='img' v-for='(img, imgIndex) in item.value' @click='preview(img)' :key='imgIndex' />
            </div>

            <img class='form_img' :style='item.style' :src='item.value' v-else @click='preview(item)' />
          </div>

          <span v-else>{{item.value}}</span>
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
  name: 'form-view',

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
      img: null,
    };
  },

  computed: {
    isPreview(){ return this.img ? true : false; },
  },

  methods: {
    closeDialog(done){ this.$emit('close', this.obj); },

    preview(item){  this.img = typeof item == 'object' ? item.value : item; },
    closePreview(){ this.img = null; },
  }
}
</script>