<style lang="stylus">
  .notice
    .header
      margin-top 20px
  #servershopmap
    width 80%
    height 400px
    min-width 300px
    background-color gray
</style>

<template>
<div style="margin-top:20px">
  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
<el-form :model="formForNotive" ref="ruleForm" :rules="rules" style="padding-left:100px;width:80%">
    <el-form-item label="店铺名称" :label-width="formLabelWidth" prop='shopName'>
      <el-input v-model="formForNotive.shopName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" :label-width="formLabelWidth" prop='phone'>
      <el-input v-model="formForNotive.phone" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="店铺地址" :label-width="formLabelWidth" prop='shopPosition'>
      <el-input v-model="formForNotive.shopPosition" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="定位" :label-width="formLabelWidth">
        <div id="servershopmap"></div>
        <br>
        <p class="hbs-margin-left80 hbs-margin-justify ">纬度：{{position.lat}},经度：{{position.lng}}</p>
    </el-form-item>
    <el-form-item  label="店铺头像"  :label-width="formLabelWidth" prop="fileList1">
          <el-upload 
          :auto-upload="false"
            action=""
            :limit="imgLimit1"
          list-type="picture-card" 
          :on-success="onsuccess"
          :on-preview="preview"
          :on-remove="remove1" 
          :on-change="change1" 
          :before-upload="beforeup" 
          :before-remove="beforere" 
          :file-list="formForNotive.fileList1"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
    <p class="hbs-margin-left80 hbs-margin-justify">请选择一张图片,建议尺寸： 宽80*高80</p>
    <el-form-item  label="店铺主图"  :label-width="formLabelWidth" prop="fileList2">
          <el-upload 
          :auto-upload="false"
            action=""
            :limit="imgLimit1"
          list-type="picture-card" 
          :on-success="onsuccess"
          :on-preview="preview"
          :on-remove="remove2" 
          :on-change="change2" 
          :before-upload="beforeup" 
          :before-remove="beforere" 
          :file-list="formForNotive.fileList2"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
    <p class="hbs-margin-left80 hbs-margin-justify">请选择一张图片,建议尺寸： 宽690*高390</p>
    <el-form-item  label="店铺展示"  :label-width="formLabelWidth" prop="fileList3">
          <el-upload 
          :auto-upload="false"
          action=""
          :limit="imgLimit2"
          list-type="picture-card" 
          :on-success="onsuccess"
          :on-preview="preview"
          :on-remove="remove3" 
          :on-change="change3" 
          :before-upload="beforeup" 
          :before-remove="beforere" 
          :file-list="formForNotive.fileList3"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
    <p class="hbs-margin-left80 hbs-margin-justify">最多可选择9张图片,建议尺寸： 宽210*高210</p>
    <el-form-item label="店铺介绍" :label-width="formLabelWidth" prop='shopText'>
      <el-input v-model="formForNotive.shopText" type="textarea"  auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="提供服务" :label-width="formLabelWidth" prop='checkList'>
        <el-checkbox-group v-model="formForNotive.checkList">
            <el-checkbox label="1" border>wifi</el-checkbox>
            <el-checkbox label="2" border>停车位</el-checkbox>
            <el-checkbox label="3" border>支付宝</el-checkbox>
            <el-checkbox label="4" border>微信支付</el-checkbox>
        </el-checkbox-group>
    </el-form-item>
    <div style="text-align:center;padding-bottom:80px">
        <el-button type="primary" round @click="restForm('ruleForm')">重置</el-button>
        <el-button type="danger" round @click="editShopText('ruleForm')" 
        :disabled="waitAddNotice"
        :loading="waitAddNotice"
        size="medium"
        >保存</el-button>
    </div>
</el-form>
</div>
</template>
<script>
import {editShopText_api,getIntroForm_api} from '@/api/seller'
import uploadFn from '@/utils/aahbs'
// getList 接口 获取
// addNotice 接口 添加
const formForNotive = {}

export default {
  data() {
    return {
      //out
      dialogImageUrl: '',
      dialogVisible: false,
      imgLimit1:1,
      imgLimit2:9,
      waitAddNotice:false,
      formForNotive:{
          shopName:"",
          phone:"",
          shopPosition:"",
          fileList1:[],
          fileList2:[],
          fileList3:[],
          checkList:[],
          shopText:"",
          content:'formForNotive'
      },
      position:{},

      rules:{
        shopName: [
            { type:"string", required: true, message: '请输入店铺名称', trigger: 'blur',min: 1 }
        ],
        phone: [
            { type:"string", required: true, message: '请输入联系方式', trigger: 'blur',min: 1 }
        ],
        shopPosition:[
          { type:"string",required:true,message:'请输入店铺地址',trigger:'blur',min:1}
        ],
        shopText:[
          { type:"string",required:true,message:'请输入店铺介绍',trigger:'blur',min:1},
          {type:"string",message:'请输入不少于10个字的介绍',trigger:'blur',min:10}
        ],
        checkList:[
          { type:"array",required:false,message:'请选择服务',trigger:'blur',min:1}
        ],
        fileList1:[
          {
            type: "array", required: true, len: 1,
            message: '请选择一张图片',
          }
        ],
        fileList2:[
          {
            type: "array", required: true, len: 1,
            message: '请选择一张图片',
          }
        ],
        fileList3:[
          {
            type: "array", required: true, min: 1,
            message: '请选择一张图片',
          }
        ],

      },
      formLabelWidth:'80px',
      //header
      formInline: {},
      // body 
      listLoading: false,
    }
  },
  created(){

  },
    async mounted(){
      await this.getForm()
      this.loadScript()
      let that = this
 
      //地图库加载完成的回调
      window.hbsForMap = ()=>{
        console.log('hbsForMap1---------------')
        // Number()
        //map对象实例
        //动
        let lat = this.position.lat?this.position.lat:39.916527
        let lng = this.position.lng?this.position.lng:116.397128

        var center = new qq.maps.LatLng(lat,lng);

        var map = new qq.maps.Map(document.getElementById('servershopmap'),{
            center: center,
            zoom: 13
        });
        var anchor = new qq.maps.Point(10, 30);
        var size = new qq.maps.Size(32, 30);
        var origin = new qq.maps.Point(0, 0);
        var icon = new qq.maps.MarkerImage('plane.png', size, origin, anchor);
        size = new qq.maps.Size(52, 30);
        var originShadow = new qq.maps.Point(32, 0);
        var shadow =new qq.maps.MarkerImage(
            'plane.png', 
            size, 
            originShadow,
            anchor 
        );

        var marker = new qq.maps.Marker({
            icon: icon,
            shadow: shadow,
            map: map,
            position:center,
            animation: qq.maps.MarkerAnimation.BOUNCE
        });

        var jump = function(event) {
            that.position = {
              ...event.latLng
            }
            marker.setPosition(event.latLng);
        };

        qq.maps.event.addListener(map, 'click', jump);
      }
  },
  methods: {
      //file upload
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
      },
    remove1() { //每次改变图片获取最新的filelist
        console.log('remove----',arguments)
        this.formForNotive.fileList1 = arguments[1]
    },
    change1() {
      console.log('change----',arguments)
      this.formForNotive.fileList1 = arguments[1]
    },
    remove2() { //每次改变图片获取最新的filelist
        console.log('remove----',arguments)
        this.formForNotive.fileList2 = arguments[1]
    },
    change2() {
      console.log('change----',arguments)
      this.formForNotive.fileList2 = arguments[1]
    },
    remove3() { //每次改变图片获取最新的filelist
        console.log('remove----',arguments)
        this.formForNotive.fileList3 = arguments[1]
    },
    change3() {
      console.log('change----',arguments)
      this.formForNotive.fileList3 = arguments[1]
      console.log('--------',this.formForNotive.fileList3[0])
      console.log('----------------111',this.formForNotive.fileList3)
    },

    getFiles(arr){ //得到文件数组
        let files = []
        let urls = []
        arr.forEach(item=>{
          if(item.raw){
            files.push(item.raw)
          }else{
            urls.push(item.url)
          }
        })
        console.log('-----------------',arr,'-----------------')
        return {
          files,urls
        }
      },
    
    async editShopText(formName){
      let res = await new Promise((res,rej)=>{
        this.$refs[formName].validate((valid) => { 
          if (valid) {
            res(true)
          } else {
            res(false)
          }
        })
      })
      if(!res){
        return 
      }

      this.waitAddNotice = true
      let sendData ={}
      let allUrl1 
      if(this.formForNotive.fileList1[0].raw){
        allUrl1 = await uploadFn(this.formForNotive.fileList1[0].raw)
        allUrl1 = allUrl1[0]
      }else{
        allUrl1 = this.formForNotive.fileList1[0].url
      }
      sendData.store_avatar = allUrl1

      let allUrl2
      if(this.formForNotive.fileList2[0].raw){
        allUrl2 = await uploadFn(this.formForNotive.fileList2[0].raw)
        allUrl2 = allUrl2[0]
      }else{
        allUrl2 = this.formForNotive.fileList2[0].url
      }
      sendData.store_banner = allUrl2


      let fileAndUrl = this.getFiles(this.formForNotive.fileList3)
      console.log(fileAndUrl,'files3')
      let files3 = fileAndUrl.files
      console.log(files3,'files3')
      let allUrl3 = await uploadFn(files3)
      console.log(allUrl3,'allUrl3')
      let urls3 = allUrl3.concat(fileAndUrl.urls)
      console.log(urls3,'urls3')
      sendData.store_images= urls3 

      sendData.store_name = this.formForNotive.shopName
      sendData.store_address = this.formForNotive.shopPosition
      sendData.store_phone = this.formForNotive.phone
      sendData.store_description = this.formForNotive.shopText
      sendData.store_service = this.formForNotive.checkList
      sendData.store_longitude=this.position.lng,
      sendData.store_latitude=this.position.lat

      editShopText_api(sendData).then(data=>{
        this.waitAddNotice = false
        if(data.status===0){
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
        }else{
          this.$notify({
            title: '失败',
            message: '操作失败',
            type: 'error'
          })
        }
      }).catch(e=>{
        this.waitAddNotice = false
        console.error('接口错误')
      })
    },

    async getForm(){
      let sendData = {}
      await getIntroForm_api(sendData).then(response=>{
        if(response&&response.status == 0){
            let aData = response.data
            let temp_fileList1 =[]
            let temp_fileList2 =[]
            let temp_fileList3 =[]
            if(aData.store_avatar){
              temp_fileList1.push({url:aData.store_avatar})
            }
            if(aData.store_banner){
              temp_fileList2.push({url:aData.store_banner})
            }
            if(aData.store_images){
              for(let i=0,len=aData.store_images.length;i<len;i++){
                temp_fileList3.push({
                  url:aData.store_images[i]
                })
              }
            }
            if(aData.store_longitude){
            this.position.lng=Number(aData.store_longitude)
            }
            if(aData.store_latitude){
            this.position.lat=Number(aData.store_latitude)
            }


            this.formForNotive.shopName=aData.store_name,
            this.formForNotive.phone=aData.store_phone,
            this.formForNotive.shopPosition=aData.store_address,
            this.formForNotive.fileList1=temp_fileList1,
            this.formForNotive.fileList2=temp_fileList2,
            this.formForNotive.fileList3=temp_fileList3,
            this.formForNotive.checkList=aData.store_service,
            this.formForNotive.shopText=aData.store_introduce

        }
        
      })
      
    },

    restForm(formName){
      this.$refs[formName].resetFields()
    },
    loadScript() {
        //创建script标签
        var script = document.createElement("script");
        //设置标签的type属性
        script.type = "text/javascript";
        //设置标签的链接地址
        script.src = "https://map.qq.com/api/js?v=2.exp&key=QB5BZ-A5XW2-XCWU5-CVHRJ-EIVEF-PNFM4&callback=hbsForMap";
        //添加标签到dom
        document.body.appendChild(script);
    },

  }
}
</script>
