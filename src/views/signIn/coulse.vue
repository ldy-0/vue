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

.time{
  display: flex; 
  align-items: center;
}

.f-fs{
 font-size: 12px; 
}
  // @font-face {
  //   font-family: a;
  //   src: local('Times New Roman');
  //   font-weight: bold;
  // } 
  // @font-face {
  //   font-family: a;
  //   src: local(Consolas);
  // }
  // .div{
  //   font-weight: bold;
  // }
  // .wrap{
  //   font-family: a;
  // }
  // .div{
  //   font-variant: small-caps;
  // }

</style>

<template>
<div>

<el-dialog :title="isAddItem ? '新增课程' : '修改课程' " :visible.sync="addNewShow" width="30%" :before-close='clearForm'>

  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules">
    <!-- 活动名称 -->
    <div v-if='isAddItem'>
    <el-form-item :label="keys[0]" :label-width="formLabelWidth"  prop="name">
      <el-input v-model="formForNotive.name" auto-complete="off"></el-input>
    </el-form-item>

    <!-- 活动周期 -->
    <el-form-item :label="keys[1]" :label-width="formLabelWidth" prop='circle'>
      <el-input v-model.number="formForNotive.circle" auto-complete="off"></el-input>
    </el-form-item>

    <!-- 活动时间 -->
    <el-form-item :label="keys[2]" :label-width='formLabelWidth' >
      <el-date-picker
        style="width:400px"
        v-model="formForNotive.coulseTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change='addDate'>
      </el-date-picker>
      <div class='time' v-for='(item, index) in formForNotive.times' :key='index'>
        <div class='f-fs' v-text='item.start'></div>-
        <div class='f-fs' v-text='item.end'></div>
        <el-button style='margin-left: 20px;' @click='deleteDate(index)' type='danger' size='mini'>删除</el-button>
      </div>
    </el-form-item>
    
    <!-- 活动地点 -->
    <el-form-item :label="keys[3]" :label-width="formLabelWidth" prop='address'> <!--prop="password" -->
      <el-select v-model="formForNotive.address" multiple placeholder="请选择教学点(可多选)">
        <el-option
          v-for="item in addressList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    </div>
  
    <el-form-item :label='keys[4]' :label-width='formLabelWidth' prop='teacher'>
      <el-select v-model="formForNotive.teacher" multiple placeholder="请选择老师(可多选)">
        <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <!-- 可预约人数 -->
    <el-form-item :label='keys[5]' :label-width='formLabelWidth' prop='num'>
      <el-input v-model.number="formForNotive.num" auto-complete="off"></el-input>
    </el-form-item>
    
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow=false; formForNotive = {};" >取消</el-button>
    <el-button type="primary" :disabled="waitAddNotice" :loading="waitAddNotice" @click="addCoulse('ruleForm')" v-if='isAddItem'>确 定</el-button>
    <el-button type="primary" :disabled="waitAddNotice" :loading="waitAddNotice" @click="editAuth('ruleForm')" v-else>确认修改</el-button>
  </span>
</el-dialog>

<el-container class="notice">

<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">添加课程</el-button>
    </el-form-item>

    <el-form-item>
        <el-input style="width: 340px;" placeholder="请输入课程名" v-model="coulseKeyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchCoulse">查询</el-button>
    </el-form-item>
  </el-form>       
</el-header>

<!-- absolute width: auto; height: auto; relative top = -bottom -->
<!-- <div style='position: relative; height: 400px; border: 1px solid #ccc;'> -->
<!-- <div style='height: 400px; border: 1px solid #ccc;'> -->
  <!-- <div style='position: relative; background: #ccc;'>relative</div> -->
  <!-- <div style='position: fixed; top: 0; bottom: 0; background: #ccc;'>relative</div> -->
<!-- </div> -->

<el-main>
  

    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >
      <el-table-column label="姓名" prop="course_name"></el-table-column>

      <el-table-column label="总期数" prop="count_total"></el-table-column>
      <el-table-column label="已上期数" prop="count"></el-table-column>
      <el-table-column label="可预约人数" prop="can_num"></el-table-column>
      <el-table-column label="已预约人数" prop="num"></el-table-column>

      
      <el-table-column label="老师" >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div v-for='(item, index) in scope.row.teacher' :key='index'>
              <p>{{ item }}</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.teacher[0] }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="教学点" >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div v-for='(item, index) in scope.row.address' :key='index'>
              <p>{{ item }}</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.address[0] }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="时间段" >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div v-for='(item, index) in scope.row.times' :key='index'>
              <p>{{ item.start + '-' + item.end }}</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.times[0].start }}-{{scope.row.times[0].end}}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button size="mini" type="text" @click="editCoulse(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="text" @click="showStudent(scope.$index, scope.row)">查看学生</el-button>
        <el-button size="mini" type="text" @click="deleteCoulse(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>

<!-- edit coulse --> 
  <el-dialog :visible.sync='canShowStudent'>
    <el-form :inline="true" :model="formInline" class="form">

      <el-form-item>
        <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="studentKeyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStudent">查询</el-button>
      </el-form-item>

      <!-- <el-form-item>
        <upload-excel-component :on-success='importDone' :before-upload="beforeUpload"></upload-excel-component>
      </el-form-item> -->

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

export default {
  created(){
    this.getList()
  },

  data() {
    return {
      rules: {
          name: [
              { required: true, message: '请输入昵称', trigger: 'blur',min: 1 }
          ],
          circle: [
              { required: true, message: '请输入周期', },
              { type: 'number', message: '周期值必须为数字' },
          ],
          datetime: [
              { type: 'date', required: true, message: '请设置时间段', trigger: 'change' }
          ],
          address: [ { required: true, message: '请选择地址' } ],
          teacher: [ { required: true, message: '请选择老师' } ],
          num: [ 
            { required: true, message: '请输入可预约人数' },
            { type: 'number', message: '值必须为数字',  },
          ]
      },
      coulseKeyword: '',
      listLoading: false,
      tableData: [],
      formLabelWidth:'80px',
      waitAddNotice:false,
      addNewShow:false,
      isAddItem:true,
      // formForNotive:Object.assign({},formForNotive),
      formForNotive: {
        name: '',
        circle: null,
        times: [],
        address: [],
        teacher: [],
        num: null,
      },
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
      // footer
      listQuery: {
        page: 1,
        limit: 10,
        search:"",
        time:""
      },
      total:1,
      // address: null,
      keys: ['课程', '期数', '时间', '地点', '老师', '可预约人数'],
      addressList: [],
      teacherList: [],
      canShowStudent: false, // student
      loadStudent: false,
      studentKeyword: null,
      studentList: [],
    }
  },
  methods: {
    deleteDate(index){
      console.log('delete date', index);
      this.formForNotive.times.splice(index, 1);
    },
    addDate(e){
      console.log('add date', e, this.formForNotive.times);
      this.formForNotive.times.push({ start: e[0].toLocaleString(), end: e[1].toLocaleString() });
    },
    clearForm(done){
      this.formForNotive = {
        name: '',
        times: [],
        address: [],
        teacher: [],
        num: null,
      };
      console.log('formforn', this.formForNotive);
      done();
    },
    // click(){
      // this.$notify.error({ title: 'success', message: 'suc', });
      // this.$message({ message: 'aaaa', type: 'warning' });
      // this.$confirm(`此操作将删除该条目, 是否继续?`,{
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     // type: 'warning'
      //   }).then((e) => {
      //     console.log(e)
      //   }).catch((e) => {
      //     this.$notify.error({ title: 'error', message: e }); 
      // })
    // },
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
    handleSuccess({ results, header }) { // upload xls success
      this.tableData = results
      this.tableHeader = header
      // console.log('-- success', this.tableData, this.tableHeader)
    },
      async addCoulse (formName) {
        let res = await this.$refs[formName].validate().catch(e => e);
        if(!res){
          return 
        }
        // this.waitAddNotice = true
        console.log('coulse', this.formForNotive)
        
        // let sendData = {
        //   seller_nick:this.formForNotive.username,
        //   seller_name:this.formForNotive.account,
        //   seller_password:this.formForNotive.password,
        //   sellergroup_id:0,
        // }
        // addAuth_api(sendData).then(data=>{
        //   this.waitAddNotice = false
        //   this.addNewShow = false
        //   if (data.status === 0) {
        //     this.$notify({ title: '成功', message: '操作成功', type: 'success' })
        //     this.getList()
        //   }else{
        //     this.$notify({ title: '失败', message: '操作失败', type: 'error' })
        //   }
        // }).catch(e=>{
        //   this.waitAddNotice = false
        //   this.addNewShow = false
        //   console.error('appointmentShop:addIndustry_api 接口错误')
        // })
      },
      addItem(){ //显示 弹框

        this.isAddItem = true
        this.addNewShow = true
        // this.formForNotive = Object.assign({},formForNotive)
        this.addressList = [
          { name: 'a1', id: 1 },
          { name: 'a2', id: 2 },
          { name: 'a3', id: 3 },
        ];

        this.getTeacherList();
        
      },
      async editItem(formName){
        // let res = await new Promise((res,rej)=>{
        // this.$refs[formName].validate((valid) => {
        //     if (valid) {
        //       res(true)
        //     } else {
        //       res(false)
        //     }
        //   })
        // })
        let res = await this.$refs[formName].validate();
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
        // console.log();
        // editAuth_api(sendData).then(data=>{
        //   this.waitAddNotice = false
        //   this.addNewShow = false
        //   if(data.status===0){
        //     this.$notify({
        //       title: '成功',
        //       message: '操作成功',
        //       type: 'success'
        //     })
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
        //   console.error('editAuth_api 接口错误')
        // })
      },
      async editCoulse(index, rowData){
        // get teacher list 
        let res = await this.getTeacherList();

        console.log('edit coulse', rowData)
        this.formForNotive = rowData// Object.assign({},rowData)
        this.isAddItem = false
        this.addNewShow = true
      },
      async showStudent(index, rowData){
        this.canShowStudent = true;
        this.studentList = [
          { name: 'k1', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
          { name: 'k1sdfkjsdfgdp', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
        ];
      },
      async deleteCoulse(index, rowData){

      },
      searchCoulse(){
        console.log('search coulse', this.coulseKeyword);
      },
      searchStudent(){
        console.log('search student', this.studentKeyword);
      },
    // body
      async getList() { //获取列表
        this.listLoading = true
        // let coulseList = await api.getRealCoulseList(this.listQuery);
        // console.log('get coluse', coulseList);
        // this.tableData = coulseList.data;
        // this.total = coulseList.pagination.total;
          this.tableData = [
            { name: 'k1', count: 2, count_total: 20, num: 4, can_num: 10, teacher: ['a', 'b', 'ccccc'], address: ['a', 'bb'], times: [ {start: 'start', end: 'end'}] },
            { name: 'k1', count: 2, count_total: 20, num: 4, can_num: 10, teacher: ['a', 'b', 'ccccc'], address: ['a', 'bb'], times: [ {start: 'start', end: 'end'}] },
            { name: 'k1', count: 2, count_total: 20, num: 4, can_num: 10, teacher: ['a', 'b', 'ccccc'], address: ['a', 'bb'], times: [ {start: 'start', end: 'end'}] },
            { name: 'k1', count: 2, count_total: 20, num: 4, can_num: 10, teacher: ['a', 'b', 'ccccc'], address: ['a', 'bb'], times: [ {start: 'start', end: 'end'}] },
          ];
        this.listLoading = false
      },
      getTeacherList(){
        this.teacherList = [
          { name: 't1', id: 1 },
          { name: 't2', id: 2 },
          { name: 't3', id: 3 },
        ];
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
    lookDetail() {
      console.log(arguments)
    },
    searchByDate(){
      if(!this.dataRange||!this.dataRange.length||this.dataRange.length!==2){
        return console.log("日期错误")
      }
      let dateS = this.dataRange[0]
      let dateE = this.dataRange[1]
      let Sstr = dateS.getFullYear()+'-'+(dateS.getMonth()+1>9?(dateS.getMonth()+1):('0'+dateS.getMonth()))+'-'+(dateS.getDate()+1>9?(dateS.getDate()+1):('0'+dateS.getDate()))
      let Estr = dateE.getFullYear()+'-'+(dateE.getMonth()+1>9?(dateE.getMonth()+1):('0'+dateE.getMonth()))+'-'+(dateE.getDate()+1>9?(dateE.getDate()+1):('0'+dateE.getDate()))
      this.listQuery.time = Sstr+','+Estr
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    
  }
}
</script>