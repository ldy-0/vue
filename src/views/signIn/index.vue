<style lang="css">
  .header{
    margin-top: 20px;
  }
  
  .upload{
    width: 50px;
    height: 50px;
    line-height: 50px;
    border: 1px dashed #000;
    text-align: center;
  }
</style>

<template>
<div>
<el-dialog :title="isAddItem ? `新增${names.words_name3}` : `编辑${names.words_name3}` " :visible.sync="canShow" width="60%">

  <el-form :model="formData"  ref="ruleForm" :rules="rules" >

    <el-form-item label="姓名" :label-width="formLabelWidth" prop="teacher_name">
      <el-input v-model="formData.teacher_name" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="teacher_mobile">
      <el-input v-model="formData.teacher_mobile" auto-complete="off"></el-input>
    </el-form-item>
    
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="canShow=false" >取消</el-button>
    <el-button type="primary"  :disabled="!canSubmit" :loading='!canSubmit' @click="submit('ruleForm')">确 定</el-button>
  </span>
</el-dialog>

<el-container class="notice">

<el-header class="header">
  <customHead :config='headConfig' @add='showForm' @searchByKeyWord='searchByKeyWord'></customHead>
</el-header>

<el-main>
  <custom-table :config='tableConfig' 
                :data='tableData' 
                :classList='tableClass' 
                :isLoading='listLoading' 
                :total='total'
                @showDetail='showCourse'
                @delete='deleteTeacher'
                @authUpdate='authUpdate'
                @authShow='authUpdate'
                @change='change'></custom-table>
</el-main>

</el-container>

  <!-- coulse List -->
  <el-dialog :visible.sync='canShowCoulse' width='60%'>
    <el-select v-model="address" placeholder="请选择教学点" @change='changeCourseAddress'>
        <el-option v-for="item in addressList" :key="item.address_id" :label="item.address_name" :value="item.address_id"></el-option>
    </el-select>

    <!-- 详情：课程每期信息 -->
    <custom-table :config='courseConfig' 
                  :data='courseList' 
                  :classList='courseClass' 
                  :isLoading='loadCourse' 
                  :total='courseTotal'
                  @showDetail='showItemCourse'
                  @showStudent='showStudent'
                  @change='changeCourse'>

          <!-- <el-button size="mini" type="text" @click="showStudent(scope.$index, scope.row)">查看学生</el-button> -->

    </custom-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowCoulse=false">取消</el-button>
    </span>
  </el-dialog>

  <!-- coulse item List -->
  <el-dialog :visible.sync='canShowCoulseItems' width='60%'>

    <custom-table :config='courseItemsConfig' 
                  :data='courseItemsList' 
                  :classList='courseItemsClass' 
                  :isLoading='loadCourseItems' 
                  :total='courseItemsTotal'
                  @uncome='uncome'
                  @change='changeCourseItems'>
    </custom-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowCoulseItems=false">取消</el-button>
    </span>
  </el-dialog>

  <!-- student List -->
  <el-dialog :visible.sync='canShowStudent' width='60%'>
    <el-form :inline="true" :model="formInline" class="form">

      <el-form-item>
        <el-input style="width: 300px;" placeholder="请输入联系方式" v-model="studentKeyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStudent">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-upload action=''
            :auto-upload="false"
            :show-file-list='false'
            :on-remove='removeFiles'
            :on-change="changeFiles">
            <el-button>导入{{names.words_name1}}</el-button>
        </el-upload>
        <!-- <upload-excel-component :on-success='importDone' ></upload-excel-component> -->
      </el-form-item>

      <el-form-item label="分类" label-width="80px"> 
          <el-select placeholder="请选择" v-model='student.student_state' @change='changeStudentStatus'> <!-- multiple  -->
            <el-option v-for="item in categories" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
      </el-form-item>

    </el-form>

    <custom-table :config='studentConfig' 
                  :data='studentList' 
                  :classList='studentClass' 
                  :isLoading='loadStudent' 
                  :total='studentTotal'
                  @update='updatePhone'
                  @delete='deleteStudent'
                  @change='changeStudent'>
    </custom-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowStudent=false">取消</el-button>
    </span>
  </el-dialog>

  <custom-dialog :visible='canShowUpdateStudent' :config='updateConfig' :detail='updateParam' @cancel='cancelUpdateStudent' @submit='submitUpdate'></custom-dialog>

</div>
</template>
<script>

import api from '@/api/seller' 
import { getNames } from '@/utils/auth' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import upLoadFile from '@/utils/aahbs.js'
import customHead from '@/components/customHead/index.vue'
import customTable from '@/components/customTable/index.vue'
import customDialog from '@/components/customDialog/index.vue'

export default {
  components: {
    UploadExcelComponent,
    customHead,
    customTable,
    customDialog,
  },
  created(){
    this.setNames(); 

    this.getList()
  },
  data() {
    return {
      headConfig: {
        showAdd: true,
        showSearchByKeyWord: true,
        title: '添加教师',
        inputWidth: '300px',
        placeholder: '请输入联系方式',
      },
      canSubmit: false,
      canShow:false,
      isAddItem:true,
        rules: {
          teacher_name: [
              { required: true, message: '请输入昵称', trigger: 'blur', min: 1, },
              { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
          ],
          teacher_mobile: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { required: true, message: '手机号必须是11位', trigger: 'blur', min: 11, max: 11 },
          ],
      },
      formLabelWidth:'80px',
      formData: {
        teacher_name: '',
        teacher_mobile:'',
      },
      tableConfig: {
        showOperate: true,
        showDetail: true,
        showDelete: true,
        showAuthUpdate: true,
        showAuthShow: true,
      },
      tableData: [],
      tableClass: [
        { key: '名字', value: 'teacher_name' },
        { key: '手机号', value: 'teacher_mobile' },
      ],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      // course
      canShowCoulse: false,
      courseConfig: {
        showOperate: true,
        showDetail: true,
        showStudent: true,
        showStudentTitle: '',
      },
      courseClass: [
        { key: '课程名称', value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        { key: '已上期数', value: 'finished_semester' },
        { key: '总人数', value: 'stu_num' },
        { key: '教学点', value: 'address_name' },
      ],
      loadCourse: false,
      courseList: [],
      course: {
        page: 1,
        limit: 10,
      },
      courseTotal: 0,
      address: null,
      addressList: [],
      // course item
      canShowCoulseItems: false,
      courseItemsConfig: {
        // showOperate: true,
        // showCome: true,
      },
      courseItemsClass: [
        { key: '课程名称', value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        { key: '已上期数', value: 'finished_semester' },
        { key: '总人数', value: 'stu_num' },
        { key: '实到人数', value: 'real_stunum' },
        { key: '教学点', value: 'address_name' },
        { key: '时间点', value: 'date' },
        { key: '备注', value: 'remark' },
      ],
      loadCourseItems: false,
      courseItemsList: [],
      courseItems: {
        page: 1,
        limit: 10,
      },
      courseItemsTotal: 0,
      // student 
      canShowStudent: false,
      loadStudent: false,
      studentKeyword: null,
      categories: [
        { id: 0, title: '不匹配', },
        { id: 1, title: '匹配', },
      ],
      studentConfig: {
        showOperate: true,
        showUpdate: true,
        showDelete: true,
      },
      studentClass: [
        { key: '学生姓名', value: 'student_name' },
        { key: '家长姓名', value: 'parent_name' },
        { key: '家长手机', value: 'parent_mobile' },
        { key: '分类', value: 'status' },
      ],
      studentList: [],
      student: {
        page: 1,
        limit: 10,
        cschedule_id: null,
        student_state: 0,
      },
      studentTotal: 0,
      // update ma
      canShowUpdateStudent: false,
      updateConfig: {
        labelWidth: '100px',
        isDisable: false,
        canSubmit: true,
        classList: [
          { key: '手机号', value: 'parent_mobile', isPhone: true, },
        ], 
      },
      updateParam: {
        student_id: null,
        parent_mobile: '',
      },
      formInline: {},
      names: null,
    }
  },
  methods: {
    // edit names
    setNames(){
      let names = JSON.parse(getNames('names'));
      this.names = names;
      console.log('names; ', names);
      this.headConfig.title = `添加${names.words_name3}`;
      this.courseClass = [
        { key: `${names.words_name2}名称`, value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        { key: '已上期数', value: 'finished_semester' },
        { key: '总人数', value: 'stu_num' },
        { key: '教学点', value: 'address_name' },
      ];
      this.courseConfig.showStudentTitle = `查看${names.words_name1}`;
      this.courseItemsClass[0].key = `${names.words_name2}名称`;
      this.studentClass[0].key = `${names.words_name1}`;
    },
    searchByKeyWord(v){
      this.listQuery.search = v;
      console.log('address search :', this.listQuery);

      this.getList();
    },
    searchStudent(){
      console.log('search student', this.studentKeyword);
      this.student.search = this.studentKeyword;

      this.getStudentList();
    },
    // importDone({ results, header }) { // upload xls success
    //   this.tableData = results
    //   this.tableHeader = header
    //   console.log('-- import success', this.tableData, this.tableHeader)
    // },
    async changeFiles(file, list){
      console.log('change file:', file, list);
      let urls =  await upLoadFile(file.raw);
      console.log('uploda files', res);
      if(!urls[0]) return ;

      let param = {
        cschedule_id: this.student.cschedule_id,
        excel_url: urls[0],
      };
      let res = await api.importStudent(param, this);

      this.getStudentList();
    },
    removeFiles(){},
    changeCourseAddress(){ 
      this.course.address_id = this.address;
      console.log('change address:', this.course);
      this.getCourseList(); 
    },
    changeStudentStatus(v){ 
      console.log('--student status--', v);
      this.studentConfig.showUpdate = v ? false : true;

      this.getStudentList(); 
    },
    showForm(index, row){
      this.canShow = true;
      this.canSubmit = true;
      this.initForm();

      if(typeof index !== 'number') return this.isAddItem = true;

      this.isAddItem = false;
      this.initForm(row);
    },
    initForm(item){
      let detail = {};

      for(let key in (item || this.addressForm)){ detail[key] = item ? item[key] : '' }
      console.log(detail);
      this.formData = detail;
    },
    async submit(formName){
      
      let res = await this.$refs[formName].validate().catch(e => e);
      if(!res) return ;

      if(/[-\[\]]/g.test(this.formData.teacher_name)) return this.$message.error({ message: `${this.names.words_name3}名不能包含非法符号` });

      this.canSubmit = false 
      this.update()
    },
    async update(){
      console.log('param --', this.formData);
      var addres = this.isAddItem ? await api.setTeacher(this.formData, this) : await api.updateTeacher(this.formData, this);

      this.canSubmit = false
      this.canShow = false;
      this.getList();
    }, 
    async showCourse(row){
      console.log(row)

      let addressList = await api.getAddressList();
      this.addressList = addressList.data;
      this.addressList.unshift({ address_id: 0, address_name: '全部' });
      // get coulse 
      this.canShowCoulse = true;

      this.course.teacher_id = row.teacher_id;
      this.getCourseList(); 
    },
    // 
    async getList() { //获取列表
      this.listLoading = true
      
      let res = await api.getTeacherList(this.listQuery, this);
      delete this.listQuery.teacher_limits;

      if(Array.isArray(res.data)){
        res.data.forEach(v => {
          v.canUpdate = v.teacher_limits ? v.teacher_limits.indexOf('update') === -1 ? false : true : false;
          v.canShow = v.teacher_limits ? v.teacher_limits.indexOf('show') === -1 ? false : true : false;
        });
      }

      this.tableData = res.data;
      this.total = res.pagination ? res.pagination.total : 0;
      this.listLoading = false
    },
    async updateTeacher(item, teacher_limits){
      let param = {
        teacher_id: item.teacher_id,
        teacher_name: item.teacher_name,
        teacher_mobile: item.teacher_mobile,
        teacher_limits,
      };

      let res = await api.updateTeacher(param, this);
      this.getList();
    },
    async deleteTeacher(item){
      let res = await api.deleteTeacher({teacher_id: item.teacher_id}, this);
      console.log('delete teacher:', item);
      this.getList();
    },
    authUpdate(str, item){
      console.log('auth update teacher:', str, item);

      if(Array.isArray(item.teacher_limits)){
        var teacher_limits = item.teacher_limits.slice();
        let index = item.teacher_limits.indexOf(str);
        index === -1 ? teacher_limits.push(str) : teacher_limits.splice(index, 1);
      }else{
        teacher_limits = [str];
      }

      this.updateTeacher(item, teacher_limits);
    },
    change(v){
      console.log('change list:', v);
      this.listQuery = v;
      this.getList();
    },
    // course 课程
    async getCourseList(){
      this.loadCourse = true;

      let res = await api.getTeacherCoulse(this.course);
      this.courseList = res.data;
      
      this.courseTotal = res.pagination ? res.pagination.total : this.courseList.length;
      this.loadCourse = false;
    },
    async showItemCourse(item){
      this.canShowCoulseItems = true;
      console.log('item course', item);
      
      this.courseItems.teacher_id = item.teacher_id;
      this.courseItems.cschedule_id = item.cschedule_id;
      console.log('course Item', this.courseItems);
      this.getCourseItemsList(); 
    },
    showStudent(row){
      console.log('student', row);
      this.canShowStudent = true;

      this.student.cschedule_id = row.cschedule_id;
      this.getStudentList();
    },
    changeCourse(v){
      console.log('change course list:', v);
      this.course.page = v.page;
      this.course.limit = v.limit;
      this.getCourseList();
    },
    // 课程（每期）
    async getCourseItemsList(){
      let res = await api.getTeacherItemCourse(this.courseItems, this);
      console.log('item course', this.courseItems, res);

      if(Array.isArray(res.data)){
        res.data.forEach(v => {
          v.date = `${v.course_date} ${v.course_time}`;
          v.remark = v.is_sign ? '到岗' : '未到岗';
        });
      }

      this.courseItemsList = res.data;
      this.courseItemsTotal = res.pagination ? res.pagination.total : 0;
    },
    uncome(){},
    changeCourseItems(v){
      console.log('change course item list:', v);
      this.courseItems.page = v.page;  
      this.courseItems.limit = v.limit;  
      this.getCourseItemsList();
    },
    // 课程对应的学生
      // beforeUpload(file) { // before upload xls
      //   const isLt2M = file.size / 1024 / 1024 < 1

      //   if (isLt2M) {
      //     return true
      //   }
      //   this.$message({
      //     message: 'Please do not upload files larger than 2m in size.',
      //     type: 'warning'
      //   })
      //   return false
      // },
    async getStudentList(){
      this.loadStudent = true;

      let res = await api.getCourseStudent(this.student, this);

      res.data.forEach(v => v.status = v.student_state ? '匹配' : '不匹配');
      
      this.studentList = res.data;
      this.studentTotal = res.pagination ? res.pagination.total : this.studentList.length; // res.pagination.total;
      this.loadStudent = false;
    },
    updatePhone(item){
      this.canShowUpdateStudent = true;
      this.updateConfig.canSubmit = true;
      console.log('update student:', item);

      this.updateParam.student_id = item.student_id;
      this.updateParam.parent_mobile = item.parent_mobile;
    },
    async deleteStudent(item){
      console.log('delete student:', item);
      // let res = await api.deleteStudent({ student_id: item.student_id }, this);
      let res = await api.deleteStucourse({ stucourse_id: item.stucourse_id }, this);

      this.getStudentList();
    },
    changeStudent(v){
      console.log('change student list:', v);
      this.student.page = v.page;
      this.student.limit = v.limit;
      this.getStudentList();
    },
    // update student
    cancelUpdateStudent(){
      this.canShowUpdateStudent = false;
    },
    async submitUpdate(){
      this.updateConfig.canSubmit = false;
      console.log('update phone', this.updateParam);
      let res = await api.updatePhone(this.updateParam, this);
      console.log('update phone res:', res);

      this.canShowUpdateStudent = false;
      this.getStudentList();
    }
    
  }
}
</script>