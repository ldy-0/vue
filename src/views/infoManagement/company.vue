<style scoped="scoped">
.graphic {
  border: solid #d5dbe7 1px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 30px 0;
}
.detial_content {
  border-bottom: solid 1px #f7f7f7;
  display: flex;
  padding-top: 20px;
}
.detial_content > div:first-child {
  min-width: 200px;
}
.company-video {
  width: 300px;
  height: 150px;
}
#servershopmap {
  width: 80%;
  height: 400px;
  min-width: 300px;
  background-color: gray;
}
</style>
<template>
  <div class="app-container">
    <!--预览图片开始 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!--预览图片结束 -->
    <!--顶部菜单开始 -->
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="CreateItem"
      >添加</el-button>
    </div>
    <!--顶部菜单结束 -->
    <!--中间表格开始 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="公司图片">
        <template slot-scope="scope">
          <img
            :key="item"
            @click="handlePictureCardPreview(item)"
            v-for="item in scope.row.company_image"
            :src="item"
            style="width:80px;margin-right: 10px;"
          >
        </template>
      </el-table-column>
      <el-table-column label="公司名" prop="company_name"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-footer>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-footer>
    <!--中间表格结束 -->
    <!--内容弹框开始 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="90%">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item label="公司图片" prop="company_image">
          <el-upload
            action
            list-type="picture-card"
            accept="image/*"
            :limit="10"
            :auto-upload="false"
            :file-list="form.company_image | filterUrl"
            :on-change="handleImgChangeOne"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveOne"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司名称" prop="company_name">
          <el-input v-model="form.company_name" placeholder="请输入公司名称"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="company_site">
          <el-input v-model="form.company_site" style="width: 400px" placeholder="请输入公司地址"></el-input>
          <el-button type="primary" @click="codeAddress(form)">搜索</el-button>
        </el-form-item>
        <el-form-item label="定位">
          <div id="servershopmap"></div>
          <br>
          <p class>纬度：{{position.lat}},经度：{{position.lng}}</p>
        </el-form-item>
        <el-form-item label="公司联系手机" prop="company_phone">
          <el-input v-model="form.company_phone" placeholder="请输入公司手机号"></el-input>
        </el-form-item>
        <el-form-item label="公司座机" prop="company_call">
          <el-input v-model="form.company_call" placeholder="请输入公司座机"></el-input>
        </el-form-item>
        <el-form-item label="公司邮箱" prop="company_email">
          <el-input v-model="form.company_email" placeholder="请输入公司座机"></el-input>
        </el-form-item>
        <el-form-item label="公司视频" prop="company_view">
          <el-upload
            v-if="form.company_view ==null"
            class="avatar-uploader el-upload--text"
            :auto-upload="false"
            action
            :show-file-list="false"
            :on-change="addVideo"
            :before-upload="beforeUploadVideo"
          >
            <i class="el-icon-plus" style="font-size: 30px"></i>
            <i v-if="isUpimg">上传中...</i>
          </el-upload>
          <video
            v-if="form.company_view !=null"
            :src="form.company_view"
            class="company-video"
            controls="controls"
          >您的浏览器不支持视频播放</video>
          <el-button @click="deleteVideo" v-if="form.company_view !=null" type="danger">删除</el-button>
        </el-form-item>
        <el-form-item label="介绍内容">
          <editor
            style="width: 100%; height:600px;"
            v-model="form.company_content"
            :menubar="editorConfig.menu"
            :height="500"
            v-if="dialogFormVisible"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit(form)"
            :disabled="isUpimg"
            :loading="isloading"
          >保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 内容弹框结束-->
  </div>
</template>
<script>
import {
  addCompany_api,
  getCompany_api,
  deleteCompany_api,
  putCompany_api
} from "@/api/seller";
import uploadFn from "@/utils/tencent_cos";
import config from "@/utils/config";
const form = {
  company_site: "",
  company_phone: "",
  company_call: "",
  company_email: "",
  company_name: "",
  company_content: null,
  company_image: [],
  company_view: null,
  company_longitude: "",
  company_latitude: ""
};
export default {
  mixins: [config],
  created() {
    //获取首页列表
    this.dynamicList();
  },
  filters: {
    //这里进行加入url到Ui框架
    filterUrl: function(value) {
      let arr = [];
      // console.log(value)
      if (!Array.isArray(value)) {
        arr.push({
          url: value
        }),
          (value = arr);
      } else {
        for (let i = 0; i < value.length; i++) {
          if (!value[i].url) {
            value[i] = {
              url: value[i]
            };
          }
        }
      }
      //console.log("过滤的")
      //console.log(value)
      return value;
    }
  },
  data() {
    return {
      //案例列表
      tableData: [
        {
          company_image: [],
          company_name: ""
        }
      ],
      //弹框动态详情
      formObjRepeat: [
        {
          Repeat_images: [],
          Repeat_title: ""
        }
      ],
      //动态模块当前索引
      moddele_idx: "",
      //分页（请求参数）
      listQuery: {
        page: 1,
        limit: 10
      },
      //总条数
      total: 0,
      //判断弹框是新增还是编辑
      textMap: {
        edit: "编辑",
        create: "添加"
      },
      //默认弹框隐藏
      dialogFormVisible: false,
      //弹框状态
      dialogStatus: "",
      //表单内容
      form: Object.assign({}, form),
      //图片预览弹框是否打开
      dialogVisible: false,
      //要预览的图片
      dialogImageUrl: "",
      //表单验证规则
      rules: {
        company_name: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 20,
            message: "长度在1到20个字"
          }
        ],
        company_image: [
          {
            required: true,
            message: "请传1至3张图片",
            trigger: "change"
          }
        ]
      },
      //正在保存
      isloading: false,
      //正在上传图片
      isUpimg: false,
      editId: null,
      position: {
        lat: null,
        lng: null
      }
    };
  },
  methods: {
    //新增
    CreateItem() {
      this.dialogFormVisible = true; //打开内容弹框
      this.dialogStatus = "create";
      this.form = Object.assign({}, form);
      this.form.company_image = [];
      this.position = {
        lat: null,
        lng: null
      };
      this.showMap();
    },
    //上传图片
    async handleImgChangeOne(file, fileList, index) {
      this.isUpimg = true;
      let imgurl = await uploadFn(file.raw);
      this.isUpimg = false;
      this.form.company_image.push({
        url: imgurl[0]
      });
    },
    //上传视频
    async addVideo(file, fileList, index) {
      this.isUpimg = true;
      let imgurl = await uploadFn(file.raw);
      if (imgurl) {
        this.isUpimg = false;
        this.form.company_view = imgurl[0];
      }
    },
    async handleImgChangeTwo(file, fileList) {
      this.isUpimg = true;
      let imgurl = await uploadFn(file.raw);
      this.isUpimg = false;
      this.formObjRepeat[this.moddele_idx].Repeat_images.push({
        url: imgurl[0]
      });
    },

    //删除图片
    handleRemoveOne(file, fileList) {
      this.form.company_image = fileList;
    },

    //预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //保存内容
    onSubmit(form) {
      console.log(this.$refs);
      this.isloading = true;
      // return
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.isloading = false;
          this.addDynamic();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑对应项
    handleEdit(row) {
      console.log("编辑");
      this.form = Object.assign({}, row);
      this.position.lng = this.form.company_longitude
        ? this.form.company_longitude
        : 116.397128;
      this.position.lat = this.form.company_latitude
        ? this.form.company_latitude
        : 39.916527;
      this.showMap();
      this.dialogStatus = "edit";
      this.editId = row.company_id;
      this.dialogFormVisible = true;
      console.log(this.form);
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该公司信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(row);
          this.deleteDynamic(row.company_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //改变每页条数
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.dynamicList();
    },
    //选择哪一页
    handleCurrentChange(val) {
      console.log(val);
      this.listQuery.page = val;
      this.dynamicList();
    },
    //以下为api操作
    //获取案例列表
    dynamicList() {
      let sendData = Object.assign({}, this.listQuery);
      console.log(sendData);
      getCompany_api(sendData).then(res => {
        this.tableData = res.data;
        if (res.status == 0) {
          this.total = res.pagination.total;
          res.data.forEach((item, idx) => {
            this.tableData[idx].company_image = JSON.parse(
              item["company_image"]
            );
          });
          console.log(this.tableData);
        }
      });
    },
    delUrlfun(e) {
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        arr.push(e[i].url);
      }
      return arr;
    },
    //新增/编辑案例
    addDynamic() {
      let sendData = {};
      for (let key in this.form) {
        if (key == "company_image") {
          this.form.company_image = this.delUrlfun(this.form.company_image);
          sendData[key] = JSON.stringify(this.form.company_image);
        } else {
          sendData[key] = this.form[key];
        }
      }
      sendData.company_longitude = this.position.lng;
      sendData.company_latitude = this.position.lat;
      if (this.dialogStatus === "create") {
        addCompany_api(sendData).then(res => {
          if (res.status == 0) {
            this.dialogFormVisible = false;
            this.isloading = false;
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
            this.dynamicList();
          }
        });
      } else if (this.dialogStatus === "edit") {
        putCompany_api(this.editId, sendData).then(res => {
          if (res.status == 0) {
            this.dialogFormVisible = false;
            this.isloading = false;
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
            this.dynamicList();
          }
        });
      }
    },
    //删除公司
    deleteDynamic(id) {
      deleteCompany_api(id).then(res => {
        if (res.status == 0) {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          this.dynamicList();
        }
      });
    },
    beforeUploadVideo(file) {
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
    },
    deleteVideo() {
      this.form.company_view = null;
      this.form = Object.assign({}, this.form);
    },
    showMap() {
      //创建script标签
      var script = document.createElement("script");
      //设置标签的type属性
      script.type = "text/javascript";
      //设置标签的链接地址
      script.src =
        "https://map.qq.com/api/js?v=2.exp&key=QB5BZ-A5XW2-XCWU5-CVHRJ-EIVEF-PNFM4&callback=hbsForMap";
      //添加标签到dom
      document.body.appendChild(script);
      let that = this;

      //地图库加载完成的回调
      window.hbsForMap = () => {
        console.log("hbsForMap1---------------");
        // Number()
        //map对象实例
        //动
        let lat = this.position.lat ? this.position.lat : 39.916527;
        let lng = this.position.lng ? this.position.lng : 116.397128;

        var center = new qq.maps.LatLng(lat, lng);

        var map = new qq.maps.Map(document.getElementById("servershopmap"), {
          center: center,
          zoom: 13
        });
        var marker = new qq.maps.Marker({
          map: map,
          position: center,
          animation: qq.maps.MarkerAnimation.BOUNCE
        });
        var jump = function(event) {
          that.position = {
            ...event.latLng
          };
          marker.setPosition(event.latLng);
        };

        qq.maps.event.addListener(map, "click", jump);
      };
    },
    codeAddress(form) {
      var address = form.company_site;
      let lat = this.position.lat ? this.position.lat : 39.916527;
      let lng = this.position.lng ? this.position.lng : 116.397128;
      var center = new qq.maps.LatLng(lat, lng);
      var map = new qq.maps.Map(document.getElementById("servershopmap"), {
        center: center,
        zoom: 13
      });

      //调用地址解析类
      let that = this;
      var geocoder = new qq.maps.Geocoder({
        complete: function(result) {
          map.setCenter(result.detail.location);
          var marker = new qq.maps.Marker({
            map: map,
            position: result.detail.location,
            animation: qq.maps.MarkerAnimation.BOUNCE
          });
          that.position.lat = result.detail.location.lat;
          that.position.lng = result.detail.location.lng;
          var jump = function(event) {
            that.position = {
              ...event.latLng
            };
            marker.setPosition(event.latLng);
          };

          qq.maps.event.addListener(map, "click", jump);
        }
      });
      geocoder.getLocation(address);
    }
  }
};
</script>
