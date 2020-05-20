<template>

  <div>

    <el-form class='dialog_detail' label-width='80px' :model='item' v-for='(item, index) in detailList' :key='index' ref='detailRule' :rules='detailRule'>

      <i class='el-icon-close close' @click='deleteDetail(index)'></i>

      <el-form-item label='图片'>

        <el-upload action='' list-type="picture-card" :auto-upload="false" :limit='1' :file-list='item.imgs'
                                                                                      :disabled='item.disabled'
                                                                                      :on-remove='changeDetailImgs'
                                                                                      :on-change="changeDetailImgs">
            <i class="el-icon-plus"></i>
        </el-upload>

      </el-form-item>

      <el-form-item class='interval s-bg-1' label='内容' >
        <el-input type='textarea' v-model="item.content"></el-input>
      </el-form-item>

    </el-form>

  </div>

</template>

<script>
export default {
  name: 'customHead',
  props: {
    // config: {
    //   type: Object,
    //   default: function() {
    //     return {
    //     }
    //   }
    // },
    detailList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  data() {
    return {
      detailRule: {
        content: [ { required: true, message: '请输入内容', trigger: 'blur' }, ],
        imgs: [ { type: 'array', required: true, message: '请添加图片' } ],
      }
    }
  },

  methods: {
    addDetail() {
      if (this.detailList.length && !this.detailList[this.detailList.length - 1].disabled) { return this.$message.error({ message: '请完善上个内容再添加' }) }

      this.detailList.push({ imgs: [], content: '', disabled: false })
    },
    deleteDetail(index) { this.detailList.splice(index, 1); console.warn(this.detailList) },
    changeDetailImgs(file, filelist) {
      console.log('imgs : ', file, filelist)
      this.detailList[this.detailList.length - 1].imgs = filelist
      this.detailList[this.detailList.length - 1].disabled = true
    }

  }
}
</script>

<style scoped>
.dialog_detail{
  margin: 20px 0 0;
  padding: 0 20px 20px 20px;
  border: 1px solid #d9d9d9;
}

.border {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px solid #dcdfe6; 
}
.close{
  position: relative;
  left: calc(100% - 30px);
}

.interval{
  margin: 20px 0 0;
}

</style>
