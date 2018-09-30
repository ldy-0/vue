<style lang="stylus">
  .notice
    .header
      margin-top 20px
    .big-icon
      font-size 30px
      color #409EFF
    .big-icon-no
      font-size 30px
      color #b19999
      // color #F56C6C
</style>

<template>
<div>
<el-dialog
  :title="isAddItem ? '新增老师' : '编辑老师' "
  :visible.sync="addNewShow"
  width="30%">

  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >

    <el-form-item label="姓名" :label-width="formLabelWidth" prop="teacher_name">
      <el-input v-model="formForNotive.teacher_name" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="teacher_mobile">
      <el-input v-model="formForNotive.teacher_mobile" auto-complete="off"></el-input>
    </el-form-item>
    <!-- <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
      <el-input v-model="formForNotive.password" auto-complete="off" 
      :placeholder="(!isAddItem)&&'此处可修改密码'"></el-input>
    </el-form-item> -->
    <!-- <el-form-item label="授予权限" v-if="!isAddItem" :label-width="formLabelWidth" >
      <el-checkbox-group v-model="formForNotive.checkboxGroup1">
      <el-checkbox-button v-for="(item,index) of rolesList" :label="item.label" :key="index">{{item.text}}</el-checkbox-button>
    </el-checkbox-group>
    </el-form-item> -->
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow=false" >取消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="submit('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
    <el-button v-else type="primary" @click="submit('ruleForm')"
    :disabled="waitAddNotice" 
    :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>

<el-container class="notice">

<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">

    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增老师</el-button>
    </el-form-item>

    <el-form-item>
      <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="searchKeyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column label="老师姓名" prop="teacher_name"></el-table-column>
      
      <el-table-column label="联系方式" prop='teacher_mobile'></el-table-column>

      <!-- <el-table-column label="订单">
        <template slot-scope="scope">
          <i v-if="scope.row.super||(scope.row.checkboxGroup1&&scope.row.checkboxGroup1.indexOf('order')!==-1)" class="el-icon-check big-icon"></i>
          <i v-else class="el-icon-close big-icon-no"></i>
        </template>
      </el-table-column>
      <el-table-column 
        label="超级管理员" 
        prop="super"
        >
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.super?'':'info'">{{ scope.row.super?'是':'否'}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="showCoulse(scope.$index, scope.row)">查看详情</el-button>
        <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,2,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>

  <!-- coulse List -->
  <el-dialog :visible.sync='canShowCoulse'>
    <el-select v-model="address" placeholder="请选择教学点">
        <el-option
          v-for="item in addressList"
          :key="item.address_id"
          :label="item.address_name"
          :value="item.address_id">
        </el-option>
    </el-select>

    <el-table :data="coulseList" stripe v-loading="loadCoulse" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column label="课程名称" prop="name"></el-table-column>
      <el-table-column label="总期数" prop='num'></el-table-column>
      <el-table-column label="已上期数" prop='numed'></el-table-column>
      <el-table-column label="教学点" prop='address'></el-table-column>
      <el-table-column label="时间点" prop='time'></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showStudent(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background @size-change="coulseSizeChange" @current-change="coulsePageChange" :current-page="coulse.page" :page-sizes="[10,2,30, 50]" :page-size="coulse.limit" layout="total, sizes, prev, pager, next" :total="coulse.total">
    </el-pagination>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowCoulse=false">取消</el-button>
    </span>
  </el-dialog>

  <!-- student List -->
  <el-dialog :visible.sync='canShowStudent'>
    <el-form :inline="true" :model="formInline" class="form">

      <el-form-item>
        <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="studentKeyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStudent">查询</el-button>
      </el-form-item>

      <el-form-item>
        <upload-excel-component :on-success='importDone' :before-upload="beforeUpload"></upload-excel-component>
      </el-form-item>

    </el-form>

    <el-table :data="studentList" stripe v-loading="loadStudent" element-loading-text="给我一点时间" style="width: 100%" >
      <el-table-column label='学生姓名' prop='name'></el-table-column>
      <el-table-column label='家长姓名' prop='parentName'></el-table-column>
      <el-table-column label='家长手机' prop='phone'></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="deleteStudent(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowStudent=false">取消</el-button>
    </span>
  </el-dialog>

</div>
</template>
<script>
// getList 接口 获取
// addNotice 接口 添加

import api from '@/api/seller' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
// const formForNotive = { //此页面 静态数据
//   username:"",
//   account:"",
//   password:"",
//   checkboxGroup1:[]
// }
export default {
  components: {
    UploadExcelComponent
  },
  created(){
    // this.getList()
  },
  data() {
    return {
      //out
        //状态层
        waitAddNotice:false,
        addNewShow:false,
        isAddItem:true,
        rolesList:[
          {
            label:'goods',
            text:'商品'
          },
        ],
        // formLabelWidth:'140px',//弹框1 左侧文字默认宽度
        rules: {
          teacher_name: [
              { required: true, message: '请输入昵称', trigger: 'blur', min: 1, },
              { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
          ],
          teacher_mobile: [
              { required: true, message: '请输入手机号', },
              { required: true, message: '手机号必须是11位', trigger: 'blur', min: 11, max: 11 },
          ],
          // password: [
          //     { required: true, message: '请输入密码，长度至少6位', trigger: 'blur',min: 6 }
          // ]
      },
      waitAddNotice:false,
      addNewShow:false,
      formLabelWidth:'80px',
      formForNotive: {
        teacher_name: '',
        teacher_mobile:'',
      },
      tableData: [],
      searchKeyWord: '',
      canShowCoulse: false,
      loadCoulse: false,
      coulse: {
        page: 1,
        limit: 10,
      },
      coulseList: [],
      coulseTotal: 0,
      address: null,
      addressList: [],
      student: {
        page: 1,
        limit: 10,
        total: 0,
      },
      canShowStudent: false,
      loadStudent: false,
      studentKeyword: null,
      studentList: [],
      //header
      industry:'',
      industryList: [{
          value: 'edu',
          label: '教育'
        }, {
          value: 'others',
          label: '其他'
        }],
      formInline: {},
      listLoading: false,
      // footer
      listQuery: {
        page: 1,
        limit: 10,
        search:"",
        time:""
      },
      total: 0,
    }
  },
  methods: {
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
    },
    addItem(){ //
      this.isAddItem = true
      this.addNewShow = true
      // this.formForNotive = {}
    },
    async submit(formName){
      
      let res = await this.$refs[formName].validate().catch(e => e);
      if(!res){
        return 
      }
      this.waitAddNotice = true
      
      if(this.isAddItem){
        var addres = await api.setTeacher(this.formForNotive);
      }
      // let sendData = {
      //   seller_nick:this.formForNotive.username,
      //   seller_name:this.formForNotive.account,
      //   seller_password:this.formForNotive.password,
      //   sellergroup_id:0,
      // }
      console.log('formForNotive', this.formForNotive);
      this.waitAddNotice = false
      this.addNewShow = false;
      // addAuth_api(sendData).then(data=>{
      //   this.waitAddNotice = false
      //   this.addNewShow = false
      //   if(data.status===0){
      //     this.$notify.success({ title: '成功', message: '添加成功' })
      //     this.getList()
      //   }else{
      //     this.$notify({
      //       title: '失败',
      //       message: '操作失败',
      //       type: 'error'
      //     })
      //   }
      // }).catch(e=>{
      //   this.waitAddNotice = false
      //   this.addNewShow = false
      //   console.error('appointmentShop:addIndustry_api 接口错误')
      // })
    },
      
      async editAuth(formName){
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
        let sendData = {
          // 后端生成
          seller_id:this.formForNotive.id,
          // 前段统一
          seller_nick:this.formForNotive.username,
          // seller_name:this.formForNotive.account,
          seller_password:this.formForNotive.password,
          seller_limits:this.formForNotive.checkboxGroup1,
          sellergroup_id:0,
        }
        editAuth_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }else{
            this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.waitAddNotice = false
          this.addNewShow = false
          console.error('editAuth_api 接口错误')
        })
      },
      async showCoulse(index, rowData){
        console.log(rowData)

        let addressList = await api.getAddressList();
        this.addressList = addressList.data;
        // get coulse 
        this.canShowCoulse = true;
        this.loadCoulse = true;

        let coulseList = await api.getCoulseList(this.coulse);
        console.log('get coulse', coulseList);
        // this.coulseList = [
        //   { name: 'k1', num: 10, numed: 2, address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() },
        //   { name: 'k1', num: 10, numed: 2, address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() },
        //   { name: 'k1', num: 10, numed: 2, address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() },
        //   { name: 'k1', num: 10, numed: 2, address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() }
        // ];
        this.coulseList = coulseList.data;
        this.coulseTotal = coulseList.pagination.total;
        this.loadCoulse = false;
      },
      searchStudent(){
        console.log('search student', this.studentKeyword);
      },
      importDone({ results, header }) { // upload xls success
        this.tableData = results
        this.tableHeader = header
        console.log('-- import success', this.tableData, this.tableHeader)
      },
      beforeUpload(file) { // before upload xls
        const isLt2M = file.size / 1024 / 1024 < 1

        if (isLt2M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 2m in size.',
          type: 'warning'
        })
        return false
      },
      showStudent(index, row){
        this.canShowStudent = true;
        this.studentList = [
          { name: 'k1', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
          { name: 'k1sdfkjsdfgdp', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
        ];
        this.student.total = this.studentList.length;
      },
      // 
      async getList() { //获取列表
        this.listLoading = true
        
        let res = await api.getTeacherList(this.listQuery);
        this.tableData = res.data;
        this.total = res.pagination.total;
        this.listLoading = false
      },
      deleteItem(index,row){
        let id = row.id
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteNewNotice(id)
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
      },
      deleteNewNotice(id){
        let sendData = {
          seller_id:id,
        }
        deleteAuth_api(sendData).then(res=>{
          if(res&&res.status===0){
              this.$notify({
              title: '成功',
              message: '操作成功',
              type:'success'
            });
            this.getList()
          }else{
            this.$notify({
              title: '错误',
              message: '操作失败',
              type:'error'
            });
          }
        }).catch(err=>{
          console.error('deleteseller_api')
        })
          
        
      },
    // ----------------------
    //out
    addNewNotice(){
      this.waitAddNotice = true
      setTimeout(()=>{
        //发送成功该做的事情
        this.waitAddNotice = false
        this.addNewShow = false
        this.form = {}
        this.$notify({
          title: '发送成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
        //如果失败
        // this.waitAddNotice = false
      },2000)
    },
    // searchByDate(){
    //   if(!this.dataRange||!this.dataRange.length||this.dataRange.length!==2){
    //     return console.log("日期错误")
    //   }
    //   let dateS = this.dataRange[0]
    //   let dateE = this.dataRange[1]
    //   let Sstr = dateS.getFullYear()+'-'+(dateS.getMonth()+1>9?(dateS.getMonth()+1):('0'+dateS.getMonth()))+'-'+(dateS.getDate()+1>9?(dateS.getDate()+1):('0'+dateS.getDate()))
    //   let Estr = dateE.getFullYear()+'-'+(dateE.getMonth()+1>9?(dateE.getMonth()+1):('0'+dateE.getMonth()))+'-'+(dateE.getDate()+1>9?(dateE.getDate()+1):('0'+dateE.getDate()))
    //   this.listQuery.time = Sstr+','+Estr
    //   this.listQuery.page = 1
    //   this.getList()
    // },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    coulseSizeChange(val){
      console.log('coulse size change', val);
    },
    coulsePageChange(val){
      
      console.log('coulse page change', val);
    }
    
  }
}
</script>