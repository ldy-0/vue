<style lang="stylus">
  .notice
    .header
      margin-top 20px
  .margin-btm20
    margin-bottom 20px
      
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->
<!-- <el-dialog
  :title="isAddItem?'新增商品':'编辑商品'"
  :visible.sync="addNewShow" 
   
  width="70%" 
  class="out-dialog"
  > -->
  <custom-dialog :visible='canShowDialog' 
                  :config='dialogConfig' 
                  :detail='formData' 
                  @goodsTypeChange='changeTeacher' 
                  @cancel='hideForm' 
                  @submit='submitForm'></custom-dialog>

  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <!-- <el-form :model="formForNotive" v-loading="editLoading" ref="ruleForm" :rules="rules" size="medium" >
    <el-form-item  label="商品图片"  :label-width="formLabelWidth"  prop="fileList1">
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
    <p class="hbs-margin-left140">最多可选择6张图,建议像素 ：宽750*高750</p> -->
    <!-- 虚拟 -->
    <!-- <el-form-item label="商品属性" :label-width="formLabelWidth" prop="is_virtual">
      <el-select v-model="formForNotive.is_virtual" placeholder="请选择" @change="formForNotiveIs_virtual_fn">
        <el-option
          v-for="item in is_virtualList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item> -->
    <!-- 普通、预售 -->
    <!-- <el-form-item label="商品类型" :label-width="formLabelWidth" prop="goodsType">
      <el-select v-model="formForNotive.goodsType" placeholder="请选择">
        <el-option
          v-for="item in goodsTypehbsList" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsName">
      <el-input v-model="formForNotive.goodsName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="课程" :label-width="formLabelWidth" prop="coulse">
      <el-input v-model="formForNotive.coulse" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="商品编号" :label-width="formLabelWidth" prop="goodsNum">
      <el-input v-model="formForNotive.goodsNum" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="门店" :label-width="formLabelWidth" prop="school">
      <el-checkbox-group v-model="formForNotive.school">
        <el-checkbox-button v-for="item in schoolList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="商品分类" :label-width="formLabelWidth" prop="industry">
      <el-select v-model="formForNotive.industry" placeholder="请选择商品分类">
        <el-option
          v-for="item in industryList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label="商品描述" :label-width="formLabelWidth" prop="goodsDescribe">
      <el-input v-model="formForNotive.goodsDescribe" type="textarea" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="规格" :label-width="formLabelWidth" >
        <el-tabs v-model="formForNotive.size" style="margin-top:-3px;margin-left:10px">
            <el-tab-pane label="统一规格" name="one" 
              :disabled="!isAddItem&&formForNotive.size!=='one'" >
              <el-form :model="formForNotiveChild1" :inline="true"   ref="ruleFormChild1" :rules="rulesChild1" class="margin-btm20">
                <el-form-item label="现价" prop="price">
                  <el-input v-model.number="formForNotiveChild1.price" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="原价" prop="marketprice">
                  <el-input v-model.number="formForNotiveChild1.marketprice" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="count">
                  <el-input v-model.number="formForNotiveChild1.count" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="多规格" name="mutil" 
               :disabled="!isAddItem&&formForNotive.size!=='mutil'"  >
              <div  v-for="(formItem,index) of formForNotiveChild2List"  :key="index" class="margin-btm20">
                <el-form :inline="true"  :model="formItem"  ref="ruleFormChild2" :rules="rulesChild2">
                  <el-form-item label="名称"  prop="name">
                    <el-input v-model="formItem.name" auto-complete="off" ></el-input>
                  </el-form-item>
                  <el-form-item label="现价"  prop="price">
                    <el-input v-model.number="formItem.price" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="原价"  prop="price">
                    <el-input v-model.number="formItem.marketprice" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="库存"  prop="count">
                    <el-input v-model.number="formItem.count" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-button @click="deleteSize_out(index)">删除</el-button>
                </el-form>
                
              </div>
              <div style="margin-top:10px;margin-left:10px">
                  <el-button @click="addSize_out">添加规格</el-button>
              </div>
            </el-tab-pane>
        </el-tabs>
    </el-form-item>
    <el-form-item label="运费" :label-width="formLabelWidth" prop="goodsTrans">
      <el-input v-model.number="formForNotive.goodsTrans" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="商品详情设置" :label-width="formLabelWidth" prop="fileList2" >
      <el-upload 
        :auto-upload="false"
          action=""
          :limit="9"
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
    <p class="hbs-margin-left140">建议尺寸：宽750*高不限 ，最多上传9张图</p>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
     <el-button v-if="isAddItem" type="primary" @click="addNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
     <el-button v-else type="primary" @click="editNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确认修改</el-button>
  </span> -->
<!-- </el-dialog> -->
<!-- <el-container class="notice"> -->
<el-header class="header" style="height:auto;">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="showForm()">新增商品</el-button>
    </el-form-item>
  </el-form>
  <el-form :inline="true"  class="form">
    <el-form-item>
        <el-input style="width: 340px;" placeholder="请输入商品名称、编码" v-model="listQuery.search"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item label="分类" :label-width="formLabelWidth">
      <el-select v-model="listQuery.storegc_id" placeholder="请选择">
            <el-option
            v-for="item in industryListSearch"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-form-item>
  </el-form>       
  <el-form :inline="true"  class="form">
    <el-badge :value="selectedItem.length" style="margin-right:20px">
      <el-button :type="selectedItem.length?'primary':''" round icon="el-icon-tickets">{{selectedItem.length>0?'已选'+selectedItem.length+'条目':'请勾选项目'}}</el-button>
    </el-badge>
    <el-form-item>
      <el-button type="success" round @click="downMutilItem(1)"  :disabled="selectedItem.length<1">批量上架</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" round @click="downMutilItem(0)" :disabled="selectedItem.length<1">批量下架</el-button>
    </el-form-item>
  </el-form>        
</el-header>
<el-main>
    <el-table
      :data="tableData"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间" 
      @selection-change="handleSelectionChange"
      style="width: 100%" >
      <el-table-column
        type="selection"
        width="105">
      </el-table-column>
      <el-table-column
        label="商品图片"
        >
        <template slot-scope="scope">
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.goodsImage" alt="" style="width:100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名" 
        prop="goodsName"
        >
      </el-table-column>
      <el-table-column
        label="类型" 
        prop="is_virtualTXT"
        >
      </el-table-column>
      <el-table-column
        label="编号" 
        prop="goodsNum"
        >
      </el-table-column>
      <el-table-column
        label="价格" 
        prop="goodsPrice"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="showForm(scope.row)">编辑和查看</el-button>
        <el-button size="mini" type="danger" v-if="scope.row.isUp" @click="downItem(scope.$index, scope.row,0)">下架商品</el-button>
        <el-button size="mini" v-else type="success" @click="downItem(scope.$index, scope.row,1)">上架商品</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<!-- <el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer> -->
<!-- </el-container> -->
</div>
</template>
<script>
import {addGoods_api,getGoodsList_api,getSchoolList_api,getGoods_api,upDownGoods_api,editGoods_api,getEntryList_api} from '@/api/seller'
import api from '@/api/seller'
import uploadFn from '@/utils/aahbs'
import customDialog from '@/components/customDialog/index.vue'

const formForNotive = {
        fileList1:[],
        goodsType:0,
        goodsName:'',
        // goodsPrice:'100',
        goodsNum:'',
        school:[],
        // goodsTotal:'100',
        industry:'',
        goodsDescribe:'',
        goodsTrans:0,
        size:'one',
        fileList2:[],
      }
const formForNotiveChild1 = {
  price:10,
  count:100
}
const formForNotiveChild2List = [{
      }]
export default {
  async created(){
    await this.getindustryList() //自定义分类
    this.getSchoolList()
    this.getList()
  },

  components: {
    customDialog,
  },

  data() {
    return {
      canShowDialog: false,
      dialogConfig: {
        canSubmit: true,
        width: '80%',
        labelWidth: '100px',
        classList: [
          { key: '商品图片', value: 'goodsImage', isGoodsImg: true, },
          { key: '商品名称', value: 'goodsName', isText: true, },
          { key: '商品编号', value: 'goodsNum', isText: true, },
          { key: '商品价格', value: 'goodsPrice', isNumber: true, },
          { key: '商品属性', value: '', isSelect: true, list: [ { id: 1, name: '课程'}, { id: 2, name: '预约课程' } ], id: 'id', name: 'name' },
          { key: '商品分类', value: 'storegc_id', isSelect: true, list: [], id: 'storegc_id', name: 'storegc_name' },
          { key: '课程', value: 'goodsType', isSelect: true, list: [], id: 'course_id', name: 'course_name', isShowDetail: true, detailList: [], },
          { key: '商品描述', value: 'goodsDescribe', isText: true, },
          { key: '规格', value: 'size', list: [], name: 'teacher_name', sub_name: 'time', isTagList: true, },
          { key: '商品详情', value: 'goodsBody', isImg: true, },
        ],
        rules: {
          goodsPrice: [ { type:"number", required: true, message: '请输入商品价格', trigger: 'blur',min: 1}, ],         
          // 'imgs': [ { required: true, message: '请选择图片', type: 'array' } ],
          // 'goodsImgs': [ { required: true, message: '请选择图片', type: 'array' } ],
        },
      },
      formData: {

      },
      // out
        editLoading:false,//此页面的编辑页为 获取单条详情方式，故添加loading
        imgLimit1:6,
        dialogImageUrl: '',
        dialogVisible: false,
        is_virtualList:[{label:'虚拟商品',value:1},{label:'实物商品',value:0},],
        schoolList:[{label:'门店1',value:1},{label:'门店2',value:2},],
        goodsTypehbsList:[
          {
            value:0,
            label:'普通商品'
          },{
            value:1,
            label:'预约商品'
          }
        ],
        industryList: [],
        industryListSearch: [],
        formForNotive:Object.assign({},formForNotive),
        rules: {
          goodsType: [
              { required: true, message: '请输入商品类型', trigger: 'blur' ,type:'number'},
          ],
          goodsName: [
              { required: true, message: '请输入商品名', trigger: 'blur' },
              { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          coulse: [
              { required: true, message: '请输入课程名', trigger: 'blur' },
          ],
          // goodsPrice: [
          //     { type:"string",required: true, message: '请输入商品价格', trigger: 'blur',min: 1},
          // ],
          goodsNum: [
              { type:"string",required: true, message: '请输入商品编号', trigger: 'blur',min: 1},
          ],
          school: [
              { type:"array",required: true, message: '请输入门店，如果没有门店请先添加门店(运营=>门店)', trigger: 'blur'},
          ],
          // goodsTotal: [
          //     { type:"string",required: true, message: '请输入库存', trigger: 'blur',min: 1},
          // ],
          industry: [
              { type:"number",required: true, message: '请输入行业', trigger: 'blur'},
          ],
          is_virtual: [
              { type:"number",required: true, message: '请输入商品属性', trigger: 'blur'},
          ],
          goodsDescribe: [
              { type:"string",required: true, message: '请输入描述', trigger: 'blur',min: 1},
          ],
          goodsTrans: [
              { type:"number",required: true, message: '请输入运费', trigger: 'blur'},
          ],
          fileList1:[
            { type: "array", required: true, min: 1, message: '至少选择一张图片', }
          ],
          fileList2:[
            { type: "array", required: true, min: 1, message: '至少选择一张图片', }
          ],
          
        },
        formForNotiveChild1:Object.assign({},formForNotiveChild1),
        rulesChild1:{
          price: [
              { required: true, message: '请输入商品价格,不少于0', trigger: 'blur' , min: 0,type:'number'},
          ],
          marketprice: [
              { required: true, message: '请输入参考价格,不少于0', trigger: 'blur' , min: 0,type:'number'},
          ],
          count: [
              { required: true, message: '请输入商品库存,不少于0的整数', trigger: 'blur' , min: 0,type:'integer'},
          ]
        },
        formForNotiveChild2List:Object.assign([],formForNotiveChild2List),
        rulesChild2:{
          name: [
              { required: true, message: '请输入名称', trigger: 'blur' , min: 1,type:'string'},
          ],
          price: [
              { required: true, message: '请输入商品价格,不少于0', trigger: 'blur' , min: 0,type:'number'},
          ],
          marketprice: [
              { required: true, message: '请输入参考价格,不少于0', trigger: 'blur' , min: 0,type:'number'},
          ],
          count: [
              { required: true, message: '请输入商品库存,不少于0', trigger: 'blur' , min: 0,type:'number'},
          ]
        },
        waitAddNotice:false,
        addNewShow:false,
        isAddItem:true,
      //head
        formInline: {},
      //body
        selectedItem:[],
      //FOOT
        listQuery_detail: {
          page: 1,
          limit: 20,
          search:"",
          time:""
        },
        total_detail:1,
      // --------------------
      //out
      detailListLoading:false,
      detailShow:false,
      detailTableData:[
        {
          time:'2014.1.2',
          username: '张三',
          phone: '123456',
          detail: '一个汉堡',
          type: '餐饮',
        }
      ],
      cityOptions:[
        {
          value: 'bj',
          label: '北京',
          children: [
            {value: 'chaoyang',
            label: '朝阳区'},{
            value: 'xicheng',
            label: '西城区'}
          ]
        },
        {
          value: 'wh',
          label: '武汉',
          children: [
            {value: 'qiaokou',
            label: '硚口'},{
            value: 'donghu',
            label: '东湖'}
          ]
        }
      ],
      
      formLabelWidth:'140px',
      //header
      industry:'',
      
      // body
      listLoading: false,
      tableData: [

      ],
      // footer
      listQuery: {
        page: 1,
        limit: 20,
        search:"",
        time:""
      },
      total:1,
    }
  },
  methods: {
      // course dialog
      search(){
        this.listQuery.page = 1
        this.getList()
      },
      showForm(row){
        this.canShowDialog = true;
        this.dialogConfig.canSubmit = true;

        this.isAddItem = !row;
        this.initForm(row);

        this.getClassList();
        this.getCourseList();
      },
      hideForm(){ this.canShowDialog = false; },
      initForm(item){
        let detail = {};

        for(let key in (item || this.formData)){ detail[key] = item ? item[key] : Array.isArray(this.formData[key]) ? [] : '' }
        // img formmat
        if(item){
          detail.goodsImage.forEach((v, i) => detail.goodsImage[i] = { url: v } );
          detail.goodsBody.forEach((v, i) => detail.goodsBody[i] = { url: v } );
        }
       
        console.log('init form data done', detail);
        this.formData = detail;
      },
      async submitForm(goodsimg, imgs){
        //
        console.log('submit form:', goodsimg, imgs);
        let goodsList = [], // 待上传列表
            detailList = [],
            goodsedList = [], // 已上传列表
            detailedList = [];

        goodsimg.forEach(v => v.raw ?  goodsList.push(v.raw) : goodsedList.push(v.url));
        imgs.forEach(v => v.raw ?  detailList.push(v.raw) : detailedList.push(v.url));
        let goods = await uploadFn(goodsList);
        let detail = await uploadFn(detailList);

        goodsedList = goodsedList.concat(goods);
        detailedList = detailedList.concat(detail);
        console.log('img:', goodsedList, detailedList, this.formData);

        let param = {
          goods_name: this.formData.goods_name, 
          goods_price: this.formData.goods_price,
        }

        // let res = await api.
      },
      changeTeacher(id){
        let o = this.dialogConfig.classList[6];
        
        o.list.forEach(v => v.course_id === id ? o.detailList = this.dialogConfig.classList[8].list = v.skuList : null);
        console.log(this.dialogConfig.classList[8]);
      },
      async getClassList(){
        let res = await api.getClassList(null, this);
        console.warn('class List: ', res);
        this.dialogConfig.classList[5].list = res.data;
      },
      async getCourseList(){
        let o = this.dialogConfig.classList[6];

        let res = await api.getCoulseList(null, this);
        console.log('course list: ', res);
        // 转为课程列表
        res.data.forEach(v => { 
          let index = null;

          if(o.list.every((v2, i) => { if(v2.course_id !== v.course_id) return true; index = i; return false; }) ){
            v.skuList = [v];
            o.list.push(v);
          }else{
            o.list[index].skuList.push(v);
          }
        });
        console.log('course List:', o.list);
      },
    // out
      //初始化数据
      getSchoolList(){ //获取 行业列表 
        return new Promise((res,rej)=>{
          getSchoolList_api({limit:0}).then(data=>{
            if(data.status===0){
              let tempData = []
              for(let i = 0 ,len = data.data.length;i<len;i++){
                tempData.push({
                  label:data.data[i].school_name,
                  value:data.data[i].school_id,
                })
              }
              this.schoolList = tempData
              res()
            }else{
              console.error('manageShop:getSchoolList_api 状态码为1')
              rej(data)
            }
          }).catch(e=>{
            console.error('manageShop:getSchoolList_api 接口错误')
            rej()
          })
        })
      },
      getindustryList(){
        return new Promise((res,rej)=>{
          getEntryList_api({limit:0}).then(data=>{
            if(data.status===0){
              let tempData = []
              for(let i = 0 ,len = data.data.length;i<len;i++){
                tempData.push({
                  label:data.data[i].storegc_name,
                  value:data.data[i].storegc_id,
                })
              }
              this.industryList = tempData
              let tempData2 = Object.assign([],tempData)
              tempData2.unshift({"label":"全部分类",value:null})
              this.industryListSearch = tempData2
              res()
            }else{
              console.error('manageShop:getEntryList_api 状态码为1')
              rej(data)
            }
          }).catch(e=>{
            console.error('manageShop:getEntryList_api 接口错误')
            rej()
          })
        })
      },
      // 虚拟
      formForNotiveIs_virtual_fn(nowValue){
        if(nowValue){
          // 虚拟 的 操作
          this.goodsTypehbsList = [
              {
                value:0,
                label:'普通商品'
              },{
                value:1,
                label:'预约商品'
              }
          ]
        }else{
          this.goodsTypehbsList = [
              {
                value:0,
                label:'普通商品'
              }
          ]
          this.formForNotive.goodsType = 0
        }
      },
      //规格2
      
      addSize_out(){
        this.formForNotiveChild2List.push({})
      },
      deleteSize_out(index){
        this.formForNotiveChild2List.splice(index,1)
      },
      //图片相关
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
      onsuccess(){
        console.log('sucess----',arguments)
      },
      beforere(){
        console.log('beforere----',arguments)
      },
      beforeup(){
        console.log('beforeup----',arguments)
      },
      preview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('preview----',arguments)
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
      //添加新商品条目
      async addNewNotice(formName){
          console.log(this.$refs)
          if(this.formForNotive.size === 'one'){
            //如果 size是统一 仅对统一表单进行验证
            let resChild1 = await new Promise((res,rej)=>{
              this.$refs['ruleFormChild1'].validate((valid) => {
                  if (valid) {
                    // alert('submit!');
                    res(true)
                  } else {
                    res(false)
                    // console.log('error submit!!');
                    // return false;
                  }
                })
              })
              if(!resChild1){
                return 
              }
          }else{
            //如果 size是 多个 仅对 多个表单进行验证
            let formChild2PromiseList = []
            for(let i=0;i<this.formForNotiveChild2List.length;i++){
              console.log(this.formForNotiveChild2List.length)
              let one = new Promise((res,rej)=>{
                this.$refs['ruleFormChild2'][i].validate((valid) => {
                    if (valid) {
                      // alert('submit!');
                      res(true)
                    } else {
                      rej(false)
                      // console.log('error submit!!');
                      // return false;
                    }
                  })
                })
              formChild2PromiseList.push(one)
            }
            let resChild2 = await Promise.all(formChild2PromiseList)
              if(!resChild2){
                return 
              }
          }
        //基础验证
        let res = await new Promise((res,rej)=>{
          this.$refs[formName].validate((valid) => {
              if (valid) {
                // alert('submit!');
                res(true)
              } else {
                res(false)
                // console.log('error submit!!');
                // return false;
              }
            })
          })
          if(!res){
            return 
          }
        // 通过验证

        this.waitAddNotice = true
        let sendData = {}

        // 类型转换
        this.formForNotiveChild1.price =  this.formForNotiveChild1.price?Number(this.formForNotiveChild1.price):0

        //废物值
        sendData.cate_id = 764
        sendData.cate_name = '自定义分类'
        sendData.type_id = 0
        sendData.mobile_body = 764
        sendData.goods_marketprice = this.formForNotive.goodsPrice
        sendData.goods_costprice = this.formForNotive.goodsPrice
        sendData.goods_discount = 1
        // 近似 废物值
        sendData.virtual_limit = 10
        sendData.virtual_indate = ''
        sendData.is_platform_store = false

        // 是否虚拟
        sendData.is_virtual = this.formForNotive.is_virtual

        // 商品图片
        let fileAndUrl0 = this.getFiles(this.formForNotive.fileList1)
        let files0 = fileAndUrl0.files
        let urls0Piece1 = await uploadFn(files0)
        let urls0 = urls0Piece1.concat(fileAndUrl0.urls)
        sendData.goods_image= urls0?JSON.stringify(urls0):''


        // 商品详情 万金油
        let fileAndUrl = this.getFiles(this.formForNotive.fileList2)
        let files2 = fileAndUrl.files
        console.log('files2',files2,'-------------------------')
        let urls2Piece1 = await uploadFn(files2)
        console.log('urls2Piece1',urls2Piece1,'-------------------------')
        let urls2 = urls2Piece1.concat(fileAndUrl.urls)
        sendData.goods_body= urls2?JSON.stringify(urls2):''

        // 商品类型 
        sendData.is_appoint= this.formForNotive.goodsType===1
        //商品名称
        sendData.goods_name= this.formForNotive.goodsName
        //商品价格
        if(this.formForNotive.size === 'one'){
          sendData.goods_price= this.formForNotiveChild1.price
          sendData.goods_marketprice = this.formForNotiveChild1.marketprice
          sendData.goods_costprice = this.formForNotiveChild1.price
        }else{
          // 类型转换
          let temp = this.formForNotiveChild2List[0].price?Number(this.formForNotiveChild2List[0].price):0
          sendData.goods_price= temp
          sendData.goods_marketprice = this.formForNotiveChild2List[0].marketprice
          sendData.goods_costprice = temp
        }
        // 商品编号
        sendData.goods_serial= this.formForNotive.goodsNum
        // 门店
        sendData.school_id= 0
        let tempArray = []
        for(let i=0,len=this.schoolList.length;i<len;i++){
          //获取门店名
          if(this.formForNotive.school.indexOf(this.schoolList[i].value)>=0){
              tempArray.push({id:this.schoolList[i].value,name:this.schoolList[i].label})
          }
        }
        sendData.school_name = JSON.stringify(tempArray)
        //库存 放在规格里 sendData.goodsTotal= this.formForNotive.goodsTotal

        //分类
        sendData.storegc_id= this.formForNotive.industry
        //描述
        sendData.goods_advword= this.formForNotive.goodsDescribe
        //规格
        sendData.spec_name= this.formForNotive.size
        if(this.formForNotive.size === 'one'){
          //单规格
          sendData.spec_value= null
          sendData.goods_storage= this.formForNotiveChild1.count
        }else{
          // 多规格
          let tempMutil = []
          let tempSepc_value = []
          for(let i=0,len=this.formForNotiveChild2List.length;i<len;i++){
            tempMutil.push({
              price:this.formForNotiveChild2List[i].price,
              marketprice:this.formForNotiveChild2List[i].price,
              sp_value:this.formForNotiveChild2List[i].name,
              stock:this.formForNotiveChild2List[i].count
            })
            tempSepc_value.push(this.formForNotiveChild2List[i].name)
          }
          sendData.spec_value = tempSepc_value
          sendData.goods_storage = ''
          sendData.spec = tempMutil
        }
        // 运费
        sendData.goods_freight= this.formForNotive.goodsTrans

        addGoods_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '上传成功',
              message: '已新增商品',
              type: 'success'
            })
            this.getList()
          }else{
            this.$notify({
              title: '上传失败',
              message: '新增商品失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.waitAddNotice = false
          this.addNewShow = false
          console.error('manageShop:addGoods_api 接口错误')
        })
      },
      async editNewNotice(formName){
          if(this.formForNotive.size === 'one'){
            //如果 size是统一 仅对统一表单进行验证
            let resChild1 = await new Promise((res,rej)=>{
              this.$refs['ruleFormChild1'].validate((valid) => {
                  if (valid) {
                    // alert('submit!');
                    res(true)
                  } else {
                    res(false)
                    // console.log('error submit!!');
                    // return false;
                  }
                })
              })
              if(!resChild1){
                return 
              }
          }else{
            //如果 size是 多个 仅对 多个表单进行验证
            let formChild2PromiseList = []
            for(let i=0;i<this.formForNotiveChild2List.length;i++){
              console.log(this.formForNotiveChild2List.length)
              let one = new Promise((res,rej)=>{
                this.$refs['ruleFormChild2'][i].validate((valid) => {
                    if (valid) {
                      // alert('submit!');
                      res(true)
                    } else {
                      rej(false)
                      // console.log('error submit!!');
                      // return false;
                    }
                  })
                })
              formChild2PromiseList.push(one)
            }
            let resChild2 = await Promise.all(formChild2PromiseList)
              if(!resChild2){
                return 
              }
          }
        //基础验证
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
        // 通过验证
        
        this.waitAddNotice = true
        let sendData = {}
        // gc_id
        //id
        sendData.goods_commonid = this.formForNotive.id
        //good_state
        sendData.goods_state = this.formForNotive.isUp
        // 类型转换
        this.formForNotiveChild1.price =  this.formForNotiveChild1.price?Number(this.formForNotiveChild1.price):0
        //废物值 编辑特殊情况
        if(this.formForNotive.size === 'mutil'){
          sendData.goods_commend = 0
          sendData.gc_id = 764
          sendData.cate_id = 764
          sendData.cate_name = '自定义分类'
          sendData.type_id = 0
          sendData.goods_discount = 1
        }
        sendData.mobile_body = 764
        sendData.goods_marketprice = this.formForNotive.goodsPrice
        sendData.goods_costprice = this.formForNotive.goodsPrice
        // 近似 废物值
        sendData.virtual_limit = 10
        sendData.virtual_indate = ''
        sendData.is_platform_store = false
        //是否是虚拟商品
        sendData.is_virtual = this.formForNotive.is_virtual

        // 商品图片
        let fileAndUrl0 = this.getFiles(this.formForNotive.fileList1)
        let files0 = fileAndUrl0.files
        let urls0Piece1 = await uploadFn(files0)
        let urls0 = urls0Piece1.concat(fileAndUrl0.urls)
        sendData.goods_image= urls0?JSON.stringify(urls0):''
        

        // 商品详情 万金油
        let fileAndUrl = this.getFiles(this.formForNotive.fileList2)
        let files2 = fileAndUrl.files
        console.log('files2',files2,'-------------------------')
        let urls2Piece1 = await uploadFn(files2)
        console.log('urls2Piece1',urls2Piece1,'-------------------------')
        let urls2 = urls2Piece1.concat(fileAndUrl.urls)
        sendData.goods_body= urls2?JSON.stringify(urls2):''

        // 商品类型 
        sendData.is_appoint= this.formForNotive.goodsType===1
        //商品名称
        sendData.goods_name= this.formForNotive.goodsName
        //商品价格
        if(this.formForNotive.size === 'one'){
          sendData.goods_price= this.formForNotiveChild1.price
          sendData.goods_marketprice = this.formForNotiveChild1.marketprice
          sendData.goods_costprice = this.formForNotiveChild1.price
        }else{
          // 类型转换
          let temp = this.formForNotiveChild2List[0].price?Number(this.formForNotiveChild2List[0].price):0
          sendData.goods_price= temp
          sendData.goods_marketprice = this.formForNotiveChild2List[0].marketprice
          sendData.goods_costprice = temp
        }
        // 商品编号
        sendData.goods_serial= this.formForNotive.goodsNum
        // 门店
        sendData.school_id= 0
        let tempArray = []
        for(let i=0,len=this.schoolList.length;i<len;i++){
          //获取门店名
          if(this.formForNotive.school.indexOf(this.schoolList[i].value)>=0){
              tempArray.push({id:this.schoolList[i].value,name:this.schoolList[i].label})
          }
          // if(this.schoolList[i].value===this.formForNotive.school){
          //   sendData.school_name = this.schoolList[i].label
          //   break
          // }
        }
        sendData.school_name = JSON.stringify(tempArray)
        
        //库存 放在规格里 sendData.goodsTotal= this.formForNotive.goodsTotal

        //分类
        if(this.formForNotive.size === 'one'){
          sendData.goods_stcids= this.formForNotive.industry
        }else{
          sendData.storegc_id= this.formForNotive.industry
        }
        //描述
        sendData.goods_advword= this.formForNotive.goodsDescribe
        //规格
        if(this.formForNotive.size === 'one'){
          //单规格
          // sendData.spec_value= null
          sendData.goods_storage= this.formForNotiveChild1.count
        }else{
          sendData.spec_name= this.formForNotive.size
          // 多规格
          let tempMutil = []
          let tempSepc_value = []
          for(let i=0,len=this.formForNotiveChild2List.length;i<len;i++){
            tempMutil.push({
              price:this.formForNotiveChild2List[i].price,
              marketprice:this.formForNotiveChild2List[i].price,
              sp_value:this.formForNotiveChild2List[i].name,
              stock:this.formForNotiveChild2List[i].count
            })
            tempSepc_value.push(this.formForNotiveChild2List[i].name)
          }
          sendData.spec_value = tempSepc_value
          sendData.goods_storage = ''
          sendData.spec = tempMutil
        }
        // 运费
        sendData.goods_freight= this.formForNotive.goodsTrans

        editGoods_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '成功',
              message: '已修改商品',
              type: 'success'
            })
            this.getList()
          }else{
            this.$notify({
              title: '失败',
              message: '修改商品失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.waitAddNotice = false
          this.addNewShow = false
          console.error('manageShop:addGoods_api 接口错误')
        })
      },
    //head
      
      // addItem(){ //显示 弹框
      //   this.isAddItem = true
      //   this.addNewShow = true
      //   this.formForNotive = Object.assign({},formForNotive)
      //   this.formForNotiveChild1 = Object.assign({},formForNotiveChild1)
      //   this.formForNotiveChild2List = Object.assign([],formForNotiveChild2List)
      // },
    //body
      handleSelectionChange(row){ //批量处理
        this.selectedItem = row
      },
      editItem(index,raw){ //由于该页面结构出现变化 故该方法需要给 正式方法传一个id
        if(!raw||!raw.id){
            this.$notify.error({
              title: '错误',
              message: 'id不存在'
          })
          return
        }
        this.isAddItem = false
        this.addNewShow = true
        this.editLoading = true
        let id = raw.id
        let sendData = {
          goods_commonid:id
        }
        getGoods_api(sendData).then(data=>{
          this.editLoading = false
          this.waitAddNotice = false
          if(data.status===0){
            data = data.data 
            //获取数据成功，这填充数据，三个formNative
            let tempForm = {}
            tempForm.id = data.goods_commonid
            
            tempForm.isUp = data.goods_state 
            //商品图片
            tempForm.fileList1 = []
            let goodsimagesListTemp = data.goodsimagesList
            let fileList1Temp = []
            try{
              for(let i=0,len = goodsimagesListTemp.length;i<len;i++){
                fileList1Temp.push({
                  url:goodsimagesListTemp[i].goodsimage_url
                })
              }
              tempForm.fileList1 = fileList1Temp
            }catch(error){
              tempForm.fileList1 = []
            }
            
            try{
              let tempImgs0 = JSON.parse(data.goods_image)
              let tempFileList0 = []
              for(let i=0,len = tempImgs0.length;i<len;i++){
                tempFileList0.push({
                  url:tempImgs[i]
                })
              }
              tempForm.fileList1 = tempFileList0
            }catch(error){
              tempForm.fileList0 = []
            }
            //虚拟 

              let tempSchool = []
            try{
              let Tempschool = JSON.parse(data.school_name)
              if(Tempschool instanceof Array){
                Tempschool.forEach(item=>{
                  tempSchool.push(item.id)
                })
              }
            }catch(err){
                tempSchool.push(data.school_id)
                console.log('111111111111',err)
            }

            tempForm.is_virtual = data.is_virtual
            tempForm.goodsType = data.is_appoint 
            tempForm.goodsName = data.goods_name
            tempForm.goodsNum = data.goods_serial
            console.log(tempSchool);
            tempForm.school = tempSchool

            tempForm.industry = Number(data.goods_stcids)
            tempForm.goodsDescribe = data.goods_advword
            tempForm.size = data.spec_value?'mutil':'one'
            tempForm.goodsTrans = Number(data.goods_freight)
            try{
              let tempImgs = JSON.parse(data.goods_body)
              let tempFileList2 = []
              for(let i=0,len = tempImgs.length;i<len;i++){
                tempFileList2.push({
                  url:tempImgs[i]
                })
              }
              tempForm.fileList2 = tempFileList2
            }catch(error){
              tempForm.fileList2 = []
            }
            this.formForNotive = tempForm //基础form完成填充
            // 此时需要 判断 规格 单或多
            let tempForm2 = {} //单规格 零时变量
            let tempForm3 = [] //多规格 零时变量
            if(tempForm.size==='mutil'){
                for(let i = 0 ,len = data.SKUList.length;i<len;i++){
                  tempForm3.push({
                    price:Number(data.SKUList[i].goods_price),
                    marketprice:Number(data.SKUList[i].goods_marketprice),
                    name:data.SKUList[i].goods_spec,
                    count:Number(data.SKUList[i].goods_storage),
                  })
                }
                this.formForNotiveChild2List = tempForm3 
            }else{
              tempForm2 = {
                price:Number(data.goods_price),
                marketprice:Number(data.goods_marketprice),
                count:Number(data.SKUList[0].goods_storage)
              }
              this.formForNotiveChild1 = tempForm2
            }
          }else{
            this.$notify({
              title: '失败',
              message: '数据获取失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.waitAddNotice = false
          this.editLoading = false
          console.error('manageShop:getGoods_api 接口错误')
        })
        // this.formForNotive =  Object.assign({},this.tableData)

        // this.formForNotiveChild1 = Object.assign({},formForNotiveChild1)
        // this.formForNotiveChild2List = Object.assign([],formForNotiveChild2List)
      },
      async downShop(id,wantUp,mutil){ //批量传mutil
        let sendData = {
          goods_commonid:[id],
          type:wantUp===0?'offline':'online'
        }
        if(mutil){
          let tempIdList = []
          for(let i =0 ;i<this.selectedItem.length;i++){
            tempIdList.push(this.selectedItem[i].id)
          }
          sendData = {
            goods_commonid:tempIdList,
            type:wantUp===0?'offline':'online'
          }
        }else{
          sendData = {
            goods_commonid:[id],
            type:wantUp===0?'offline':'online'
          }
        }
        upDownGoods_api(sendData).then(res=>{
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
          console.error('upDownShop')
        })
      },
      async downMutilItem(wantUp){
        this.$confirm(`此操作将${wantUp===1?'批量上架':'批量下架'}该商品, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downShop(0,wantUp,true) //批量
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
      },
      async downItem(index,data,wantUp){
        let id = data.id
        this.$confirm(`此操作将${wantUp===1?'上架':'下架'}该商品, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downShop(id,wantUp)
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
      },
      getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        // if(!sendData.time){
        //   delete sendData.time
        // }
        getGoodsList_api(sendData).then(response => {
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              
              let temp_fileList1 =[]
              let temp_fileList2 =[]
              if(aData.goods_image){
                temp_fileList1.push({url:aData.goods_image})
              }
              if(aData.id_card_front){
                temp_fileList2.push({url:aData.id_card_front})
              }
              if(aData.id_card_behind){
                temp_fileList2.push({url:aData.id_card_behind})
              }
              // goodstotal 库存 前后端不一致 需要特殊处理
              let goodsTotal = 0
              if(aData.spec_name==='one'){
                goodsTotal = aData.goods_storage
              }else{
                goodsTotal = aData.goods_storage
              }
              //对  mutil类型的表单 处理

              // ！！！！！这里暂停工作 因为暂时没有接口
              
              tempTableData.push({
                //后端生成
                id:aData.goods_commonid,
                isUp:aData.goods_state,
                //前后统一
                
                goodsImage: typeof aData.goods_image === 'string' ? [aData.goods_image] : aData.goods_image,//显示
                goodsType:aData.is_appoint?1:0,
                is_virtualTXT:aData.is_virtual?'虚拟':'实体',//显示补充，实际无用

                goodsName:aData.goods_name,//显示
                goodsPrice:aData.goods_price,//显示
                goodsNum:aData.goods_serial,//显示
                goodsBody: JSON.parse(aData.goods_body),
                // goodsState:'在售',//显示 ！！！ 掩耳盗铃
                // goodsSell:Math.floor(Math.random()*1000),//显示 ！！！ 掩耳盗铃
                // school:aData.school_id,
                //库存没有接受的字段
                // goodsTotal:goodsTotal,//显示

                // industry:aData.storegc_id, 
                // goodsElement:aData.store_id,
                // goodsDescribe:aData.goods_advword,
                // goodsTrans:aData.goods_freight,
                // size:aData.spec_name,

                //child1 one 类型的表单
                // childForm1:{
                //   price:aData.spec_value,
                //   count:aData.goods_storage
                // },
                //child2 mutil类型的表单
                // childForm2:[],
                // fileList1:temp_fileList1,
                // fileList2:temp_fileList2,
              })
            })
            this.tableData = tempTableData
            this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          }else{

          }
          console.log("getList",response)
          // this.list = response
          this.listLoading = false
        }).catch(e=>{
          this.listLoading = false
        })
      },
    // -------------------------------------------------------------
    // ------------------------------------
    //out
    addDetailItem(){
      this.formForNotive.goodsDetail.push({
            fileList:[],
            title:'xxx',
            content:'cccxxx',
          })
    },
      //file upload
      
    
    getList_detail(){
      console.log('getList_detail 暂时留白')
    },
    handleSizeChange_detail(val) {
      this.listQuery_detail.limit = val
      this.getList_detail()
    },
    handleCurrentChange_detail(val) {
      this.listQuery_detail.page = val
      this.getList_detail()
    },
    
    // addItem(){
    //   this.isAddItem = true
    //   this.addNewShow = true
    //   // this.formForNotive = {}
    // },
    //body
    
    lookItem() {
      console.log(arguments)
      this.detailShow = true
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