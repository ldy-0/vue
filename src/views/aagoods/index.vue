<style lang="stylus">
</style>

<template>
<div>
    <el-upload class="hbs"
    :auto-upload="false"
    action=""
  list-type="picture-card" 
  :on-success="onsuccess"
  :on-preview="preview"
  :on-remove="remove" 
  :on-change="change" 
  :before-upload="beforeup" 
  :before-remove="beforere" 
  :file-list="fileList"
  >
  <i class="el-icon-plus"></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
</div>
</template>

<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: [{url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3994633895,563142661&fm=27&gp=0.jpg'}]
      };
    },
    methods: {
      onsuccess(){
        console.log('sucess----',arguments)
      },
      beforere(){
        console.log('beforere----',arguments)
      },
      beforeup(){
        console.log('beforeup----',arguments)
      },
      remove() {
        console.log('remove----',arguments)
      },
      change() {
        console.log('change----',arguments)
      },
      preview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('preview----',arguments)
      }
    }
  }
</script>