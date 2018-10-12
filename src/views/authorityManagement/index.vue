<style lang="stylus">
.notice {
  .header {
    margin-top: 20px;
  }

  .big-icon {
    font-size: 30px;
    color: #409EFF;
  }

  .big-icon-no {
    font-size: 30px;
    color: #b19999;
    // color #F56C6C
  }
}
</style>

<template>
<div>
<el-dialog
  :title="isAddItem?'新增管理员':'编辑管理员'"
  :visible.sync="addNewShow"
  width="30%"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="姓名" :label-width="formLabelWidth"  prop="username">
      <el-input v-model="formForNotive.username" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
      <el-input v-model="formForNotive.account" 
      :disabled="!isAddItem" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
      <el-input v-model="formForNotive.password" auto-complete="off" 
      :placeholder="(!isAddItem)&&'此处可修改密码'"></el-input>
    </el-form-item>
    <el-form-item label="授予权限" v-if="!isAddItem" :label-width="formLabelWidth" >
      <el-checkbox-group v-model="formForNotive.checkboxGroup1">
        <el-checkbox-button v-for="(item,index) of rolesList" :label="item.label" :key="index">{{item.text}}</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow=false" >取消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="addAuth('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
    <el-button v-else type="primary" @click="editAuth('ruleForm')"
    :disabled="waitAddNotice" 
    :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<el-header class="header">
<el-form :inline="true" :model="formInline" class="form">
  <el-form-item>
    <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增管理员</el-button>
  </el-form-item>
</el-form>       
</el-header>
<el-main>
    <el-table
      :data="tableData"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间"
      style="width: 100%" >
      <el-table-column
        label="姓名" 
        prop="username"
        >
      </el-table-column>
      <el-table-column
        label="账号" 
        prop="account"
        >
      </el-table-column>
      <el-table-column 
        label="超级管理员" 
        prop="super"
        >
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.super=='1'?'':'info'">{{ scope.row.super=='1'?'是':'否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width='200px'
        >
        <template slot-scope="scope">
        <el-button
          size="mini" 
          type="primary" 
          @click="editItem(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini" 
          type="danger" 
          @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>
</div>
</template>
<script>
// getList 接口 获取
// addNotice 接口 添加

import {
  getAuthList_api,
  deleteAuth_api,
  addAuth_api,
  editAuth_api
} from "@/api/seller";
import { getSellerAuth } from "@/api/login";
const formForNotive = {
  //此页面 静态数据
  username: "",
  account: "",
  password: "",
  checkboxGroup1: []
};
export default {
  created() {
    this.getList();
    getSellerAuth().then(res => {
      res.data = res.data.replace(/\s/gi, "");
      let rolesarry = eval("(" + res.data + ")");
      this.rolesList = rolesarry
    });
  },
  data() {
    return {
      //out
      //状态层
      waitAddNotice: false,
      addNewShow: false,
      isAddItem: true,
      //以下来匹配路由权限的，label和路由roles一致，才有权限（seller表示是超级管理员，不用匹配，seller2则不是超级管理员）
      rolesList:[
      	{
      		label:'commodityManagement',
      		text:'商品管理'
      	},
      	{
      		label:'orderManagement',
      		text:'订单管理'
      	},
      	{
      		label:'memberList',
      		text:'人员列表'
      	},
      	{
      		label:'authorityManagement',
      		text:'权限管理'
      	},
      	{
      		label:'infoManagement',
      		text:'运营'
      	},
      
      
      ],
      formLabelWidth: "140px", //弹框1 左侧文字默认宽度
      formForNotive: Object.assign({}, formForNotive),
      rules: {
        username: [
          { required: true, message: "请输入昵称", trigger: "blur", min: 1 }
        ],
        account: [
          {
            required: true,
            message: "请输入账号，长度至少5位",
            trigger: "blur",
            min: 5
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码，长度至少6位",
            trigger: "blur",
            min: 6
          }
        ]
      },
      //body

      tableData: [{}],
      // -------------------------

      // ----------------------
      //out
      //  waitAddNotice:false,
      //         formForNotive:{
      //           name:'',
      //           account:'',
      //           password:'',
      //         },
      //  addNewShow:false,
      // formLabelWidth:'80px',
      //header
      industry: "",
      industryList: [
        {
          value: "edu",
          label: "教育"
        },
        {
          value: "others",
          label: "其他"
        }
      ],
      formInline: {},
      // body
      listLoading: false,

      // footer
      listQuery: {
        page: 1,
        limit: 20,
        search: "",
        time: ""
      },
      total: 1
    };
  },
  methods: {
    // out
    async addAuth(formName) {
      let res = await new Promise((res, rej) => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // alert('submit!');
            res(true);
          } else {
            res(false);
            // console.log('error submit!!');
            // return false;
          }
        });
      });
      if (!res) {
        return;
      }
      this.waitAddNotice = true;
      let sendData = {
        seller_nick: this.formForNotive.username,
        seller_name: this.formForNotive.account,
        seller_password: this.formForNotive.password,
        sellergroup_id: 0
      };
      addAuth_api(sendData)
        .then(data => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          if (data.status === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "失败",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(e => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          console.error("appointmentShop:addIndustry_api 接口错误");
        });
    },
    addItem() {
      //显示 弹框
      // this.editLoading = false
      this.isAddItem = true;
      this.addNewShow = true;
      this.formForNotive = Object.assign({}, formForNotive);
    },
    async editAuth(formName) {
      let res = await new Promise((res, rej) => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // alert('submit!');
            res(true);
          } else {
            res(false);
            // console.log('error submit!!');
            // return false;
          }
        });
      });
      if (!res) {
        return;
      }
      this.waitAddNotice = true;
      let sendData = {
        // 后端生成
        seller_id: this.formForNotive.id,
        // 前段统一
        seller_nick: this.formForNotive.username,
        seller_name: this.formForNotive.account,
        seller_password: this.formForNotive.password,
        seller_limits: this.formForNotive.checkboxGroup1,
        sellergroup_id: 0
      };
      editAuth_api(sendData)
        .then(data => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          if (data.status === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "失败",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(e => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          console.error("editAuth_api 接口错误");
        });
    },
    editItem(index, rowData) {
      console.log(rowData);
      // this.editLoading = true
      this.formForNotive = Object.assign({}, rowData);
      this.isAddItem = false;
      this.addNewShow = true;
    },
    // body
    getList() {
      //获取列表
      this.listLoading = true;
      let sendData = Object.assign({}, this.listQuery);
      getAuthList_api(sendData).then(response => {
        if (response && response.status == 0) {
          let result = response.data;
          let tempTableData = [];
          result.forEach(aData => {
            tempTableData.push({
              //后端生成
              id: aData.seller_id,
              //前后统一
              username: aData.seller_nick,
              password: aData.seller_password,
              account: aData.seller_name,
              //
              checkboxGroup1: aData.seller_limits,
              //超级管理员标识
              super: aData.is_admin
            });
          });
          this.tableData = tempTableData;
          console.log("权限");
          console.log(this.tableData);
          this.total = response.pagination.total
            ? response.pagination.total
            : 1;
        } else {
        }
        console.log("getList", response);
        // this.list = response
        this.listLoading = false;
      });
    },
    deleteItem(index, row) {
      let id = row.id;
      this.$confirm(`此操作将删除该条目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteNewNotice(id);
        })
        .catch(() => {
          this.$notify.info({
            title: "消息",
            message: "已取消"
          });
        });
    },
    deleteNewNotice(id) {
      let sendData = {
        seller_id: id
      };

      deleteAuth_api(sendData)
        .then(res => {
          if (res && res.status === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "错误",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteseller_api");
        });
    },
    // ----------------------

    searchByDate() {
      if (
        !this.dataRange ||
        !this.dataRange.length ||
        this.dataRange.length !== 2
      ) {
        return console.log("日期错误");
      }
      let dateS = this.dataRange[0];
      let dateE = this.dataRange[1];
      let Sstr =
        dateS.getFullYear() +
        "-" +
        (dateS.getMonth() + 1 > 9
          ? dateS.getMonth() + 1
          : "0" + dateS.getMonth()) +
        "-" +
        (dateS.getDate() + 1 > 9 ? dateS.getDate() + 1 : "0" + dateS.getDate());
      let Estr =
        dateE.getFullYear() +
        "-" +
        (dateE.getMonth() + 1 > 9
          ? dateE.getMonth() + 1
          : "0" + dateE.getMonth()) +
        "-" +
        (dateE.getDate() + 1 > 9 ? dateE.getDate() + 1 : "0" + dateE.getDate());
      this.listQuery.time = Sstr + "," + Estr;
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>