<style>
@import url("//unpkg.com/element-ui@2.4.6/lib/theme-chalk/index.css");
@import "element-ui/lib/theme-chalk/display.css";

.title {
  font-size: 30px;
  margin: 0px 20px 0 10px;
  height: 40px;
}

.lab {
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 20rpx;
  min-width: 400px;
  max-width: 600px;
  height: 36px;
  border: 1px solid #9a9a9a;
  border-radius: 4px;
}

el-col {
  border-radius: 4px;
}
.row {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 20px 0 20px 50px;
}
.button {
  padding-top: 100px;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>

<template>
<el-main>
  <div style="width:600px;height:200px;"></div>
<el-row class="row" :gutter="20">
  <el-col :span="6"><div class="title">背景音乐</div></el-col>
  <el-col :span="6"><div class="lab">{{fliename}}</div></el-col>
  <el-col :span="6">
    <el-upload
        :auto-upload="true"
        action=""
        :on-change="handlePicture"
        :on-remove="handleRemove"
        :on-success="handUpSuccess"
        :show-file-list="false">
        <el-button type="primary" size="medium" >选择</el-button>
    </el-upload>
</el-col>
</el-row>
<div class="button">
  <el-button type="primary" size="medium" @click="addMusic">确定</el-button>
  <el-button type="primary" size="medium" @click="deleteMusic">删除音乐</el-button>
</div>
</el-main>
</template>

<script>
import { postMusic } from "@/api/answer";
import uploadFn from "@/utils/aahbs";
export default {
  created() {},
  data() {
    return {
      fliename: "",
      url: null,
      raw: null
    };
  },
  methods: {
    deleteMusic: function() {
      var data = {
        bg_music: " "
      };
      postMusic(data).then(res => {
        console.log(res.data);
        console.log("res", res);
        if (!res.status) {
          this.$message({
            message: res.error,
            type: "success"
          });
        }
      });
    },
    addMusic: async function() {
      this.url = await uploadFn(this.raw);
      console.log(this.url);
      var data = {
        bg_music: this.url[0]
      };
      postMusic(data).then(res => {
        console.log(res.data);
        console.log("res", res);
        if (!res.status) {
          this.$message({
            message: res.error,
            type: "success"
          });
        }
      });
    },
    handlePicture(file, fileList) {
      console.log("change0", file);
      this.fliename = file.name;
      this.raw = file.raw;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fliename = "";
    },
    handUpSuccess: function(response, file, fileList) {
      console.log("fileList", fileList);
      console.log("file", file);
    }
  }
};
</script>