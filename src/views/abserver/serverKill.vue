<style lang="stylus">
.notice {
  .header {
    margin-top: 20px;
  }
}
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->
<el-dialog
  title="添加砍价商品"
  :visible.sync="addNewShow"
  width="80%"
  >
  <el-dialog
      :title="QisAddItem?'新增砍价':'编辑砍价'"
      :visible.sync="QaddNewShow" 
      width="50%" 
      append-to-body
      >
      <el-form :model="QformForNotive"  ref="qruleForm" :rules="Qrules" >
        <el-form-item label="最低价格" :label-width="formLabelWidth"  prop="min_price">
          <el-input v-model.number="QformForNotive.min_price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label=" 每次砍价金额" :label-width="formLabelWidth"  prop="cut_price">
          <el-input v-model.number="QformForNotive.cut_price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="持续小时数" :label-width="formLabelWidth"  prop="outime">
          <el-input v-model.number="QformForNotive.outime" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="QaddNewShow=false" >取消</el-button>
        <el-button v-if="QisAddItem" type="primary" @click="QaddOne('ruleForm')"
        :disabled="QwaitAddNotice"
        :loading="QwaitAddNotice">确 定</el-button>
        <el-button v-else type="primary" @click="QeditOne('ruleForm')"
        :disabled="QwaitAddNotice" 
        :loading="QwaitAddNotice">确认修改</el-button>
      </span>
  </el-dialog>
  <el-container class="notice">
        <el-header class="header">
          <el-form :inline="true" :model="formInline" class="form">
            <el-form-item>
                <el-input style="width: 340px;" placeholder="请输入商品名称、编码" v-model="listQuery2.search"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search2">查询</el-button>
            </el-form-item>
            <el-form-item label="分类" :label-width="formLabelWidth">
                <el-select v-model="listQuery2.storegc_id" placeholder="请选择">
                        <el-option
                        v-for="item in industryList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                  </el-select>
                </el-form-item>
          </el-form>       
        </el-header>
        <el-container>
          <el-main>
              <el-table
                :data="tableData2"
                stripe 
                v-loading="listLoading" element-loading-text="给我一点时间" 
                style="width: 100%" >
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
                  <!-- <el-table-column
                  label="状态" 
                  prop="goodsState"
                  >
                </el-table-column> -->
                <el-table-column
                  label="价格" 
                  prop="goodsPrice"
                  >
                </el-table-column>
                <!-- <el-table-column
                  label="库存" 
                  prop="goodsTotal"
                  >
                </el-table-column> -->
                <!-- <el-table-column
                  label="销量" 
                  prop="goodsSell"
                  >
                </el-table-column> -->
                <el-table-column
                  label="操作" 
                  min-width='300px'
                  >
                  <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="editItem(scope.$index, scope.row)">选择</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-main>
        </el-container>
        <el-footer>
          <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="listQuery2.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery2.limit" layout="total, sizes, prev, pager, next" :total="total2">
          </el-pagination>
        </el-footer>
  </el-container>
  <!-- <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button type="primary" @click="addNewNotice"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span> -->
</el-dialog>

<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">添加砍价商品</el-button>
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
        label="商品图片"
        >
        <template slot-scope="scope">
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.image" alt="" style="width:100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="ID" 
        prop="id"
        >
      </el-table-column>
      <el-table-column
        label="商品名" 
        prop="name"
        >
      </el-table-column>
      <el-table-column
        label="价格" 
        prop="price"
        >
      </el-table-column>
      <el-table-column
        label="每次砍价金额" 
        prop="cut_price"
        >
      </el-table-column>
      <el-table-column
        label="最低金额" 
        prop="min_price"
        >
      </el-table-column>
      <el-table-column
        label="砍价持续小时数" 
        prop="outime"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <!-- <el-button size="mini"  @click="HeditItem(scope.$index, scope.row)">编辑</el-button> -->
        <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">取消砍价</el-button>
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
  getGoodsList_api,
  getKillList_api,
  addKillBuy_api,
  getEntryList_api,
  editAllBuy_api,
  deleteKill_api
} from "@/api/seller";
// import {getGoodsList_api,getAllBuyList_api,addAllBuy_api,getEntryList_api,editAllBuy_api,deleteAllBuy_api,} from "@/api/seller"
const QformForNotive = {};

export default {
  data() {
    return {
      // out Q
      // out
      QrulesChild: {},
      QisAddItem: false,
      QwaitAddNotice: false,
      QaddNewShow: false,
      QformForNotive: Object.assign({}, QformForNotive),
      Qrules: {
        min_price: [
          {
            required: true,
            message: "请输入最低价格,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ],
        cut_price: [
          {
            required: true,
            message: "请输入每次砍价金额,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ],
        outime: [
          {
            required: true,
            message: "砍价持续时间(小时),不少于0，且为整数",
            trigger: "blur",
            min: 0,
            type: "integer"
          }
        ]
      },

      Q_outData: "",
      Q_Aid: "",

      Qlistshow: false,
      inline: true,
      QaddNewShow: false,
      QtableData: [],
      QlistLoading: false,
      QlistQuery: {
        page: 1,
        limit: 10,
        search: "",
        time: ""
      },
      Qtotal: 1,
      //out
      addNewShow: false,
      formInline: {},
      listQuery2: {
        page: 1,
        limit: 10,
        search: "",
        time: ""
      },
      total2: 1,
      tableData2: [
        // {
        //   goodsImage:
        //     "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3942989250,3371488751&fm=27&gp=0.jpg",
        //   goodsName: "老北京鸡肉卷",
        //   goodsType: "炸鸡",
        //   goodsNum: "123987",
        //   goodsState: "在售",
        //   goodsPrice: "321",
        //   goodsTotal: "321",
        //   goodsSell: "321"
        //   //   opera: '查看123'
        // },
        // {
        //   goodsImage:
        //     "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4005596794,992112216&fm=27&gp=0.jpg",
        //   goodsName: "香辣鸡腿堡",
        //   goodsType: "炸鸡",
        //   goodsNum: "1223987",
        //   goodsState: "在售",
        //   goodsPrice: "3221",
        //   goodsTotal: "3221",
        //   goodsSell: "3212"
        //   //   opera: '查看123'
        // }
      ],
      listLoading2: false,
      dialogImageUrl: "",
      imgLimit1: 1,
      dialogVisible: false,
      fileList1: [
        {
          url:
            "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3994633895,563142661&fm=27&gp=0.jpg"
        }
      ],
      fileList2: [
        {
          url:
            "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3994633895,563142661&fm=27&gp=0.jpg"
        }
      ],
      industryList: [],

      isAddItem: true,
      waitAddNotice: false,
      // ---------------------
      formForNotive: {
        name: "奥术大师",
        value: "100"
      },
      addNewShow: false,
      formLabelWidth: "120px",
      //header
      industry: "",
      formInline: {},
      // body
      listLoading: false,
      tableData: [
        // {
        //   image:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2544791346,860572115&fm=27&gp=0.jpg',
        //   goodsName:'鸡腿',
        //   goodsPrice:'10',
        // }
      ],
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
  async created() {
    await this.getindustryList(); //自定义分类
    this.getList();
  },
  methods: {
    // Q
    HeditItem(id) {
      this.QformForNotive = Object.assign({ id });
      this.QaddNewShow = true;
    },
    // out Q
    // out
    async QaddOne() {
      this.QeditOne();
    },
    async QeditOne() {
      let res = await new Promise((res, rej) => {
        this.$refs["qruleForm"].validate(valid => {
          if (valid) {
            res(true);
          } else {
            res(false);
          }
        });
      });
      if (!res) {
        return;
      }
      this.QwaitAddNotice = true;

      let sendData = {
        goods_commonid: this.QformForNotive.id,
        min_price: this.QformForNotive.min_price,
        cut_price: this.QformForNotive.cut_price,
        outime: this.QformForNotive.outime
      };
      addKillBuy_api(sendData)
        .then(data => {
          this.QwaitAddNotice = false;
          this.QaddNewShow = false;
          if (data && data.status === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
            this.QaddNewShow = false;
            this.addNewShow = false;
          } else {
            this.$notify({
              title: "失败",
              message: data.error,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.QwaitAddNotice = false;
          this.QaddNewShow = false;
          console.error("manageShop:editAllBuy_api 接口错误");
        });
    },
    QdeleteAA(index) {
      this.QformForNotiveChildList.splice(index, 1);
    },
    QaddAA() {
      this.QformForNotiveChildList.push({});
    },
    // head
    QaddItem() {
      //显示 弹框
      this.QisAddItem = true;
      this.QaddNewShow = true;
      this.QformForNotive = Object.assign({}, QformForNotive);
    },
    // body

    QgetList() {
      this.QlistLoading = true;
      let sendData = Object.assign({}, this.QlistQuery);
      sendData.id = this.Q_Aid;
      getQList_api(sendData)
        .then(response => {
          if (response && response.status == "success") {
            let result = response.result;
            let tempTableData = [];
            result.forEach(aData => {
              tempTableData.push({
                id: aData.examinationId, //试卷id
                QID: aData.id, //题目id
                title: aData.title, //问题
                order: aData.order, //序号
                answer: aData.answer //答案
              });
            });
            this.QtableData = tempTableData;
          }
          // this.list = response
          this.Qtotal =
            response.paging && response.paging.total
              ? response.paging.total
              : 0;
          this.QlistLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.QlistLoading = false;
        });
    },
    QeditItem(index, rowData) {
      // this.editLoading = true
      this.QformForNotive = Object.assign({}, rowData);
      let answerList = JSON.parse(rowData.answer);
      this.QformForNotiveChildList = Object.assign([], answerList);
      this.QisAddItem = false;
      this.QaddNewShow = true;
    },
    QdeleteNewNotice(id, QID) {
      let sendData = {
        examinationId: id,
        questionId: QID // 父亲(外层)id
      };
      deleteQOne_api(sendData)
        .then(res => {
          if (res && res.status === "success") {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.QgetList();
          } else {
            this.$notify({
              title: "错误",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteAdmin_api");
        });
    },
    QdeleteItem(index, row) {
      let QID = row.QID;
      let id = row.cp_id;
      this.$confirm(`此操作将删除该条目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.QdeleteNewNotice(id, QID);
        })
        .catch(() => {
          this.$notify.info({
            title: "消息",
            message: "已取消"
          });
        });
    },
    Qsave() {},
    // foot
    QhandleSizeChange(val) {
      this.QlistQuery.limit = val;
      this.getList();
    },
    QhandleCurrentChange(val) {
      this.QlistQuery.page = val;
      this.getList();
    },

    search2() {
      this.listQuery2.page = 1;
      this.getList2();
    },
    handleSizeChange2(val) {
      this.listQuery2.limit = val;
      this.getList2();
    },
    handleCurrentChange2(val) {
      this.listQuery2.page = val;
      this.getList2();
    },
    //out
    getindustryList() {
      return new Promise((res, rej) => {
        getEntryList_api({ limit: 0 })
          .then(data => {
            if (data.status === 0) {
              let tempData = [{ label: "全部分类", value: null }];
              for (let i = 0, len = data.data.length; i < len; i++) {
                tempData.push({
                  label: data.data[i].storegc_name,
                  value: data.data[i].storegc_id
                });
              }
              this.industryList = tempData;
              res();
            } else {
              console.error("manageShop:getEntryList_api 状态码为1");
              rej(data);
            }
          })
          .catch(e => {
            console.error("manageShop:getEntryList_api 接口错误");
            rej();
          });
      });
    },
    addDetailItem() {
      this.formForNotive.goodsDetail.push({
        fileList: [],
        title: "xxx",
        content: "cccxxx"
      });
    },
    //file upload
    onsuccess() {
      console.log("sucess----", arguments);
    },
    beforere() {
      console.log("beforere----", arguments);
    },
    beforeup() {
      console.log("beforeup----", arguments);
    },
    remove() {
      console.log("remove----", arguments);
    },
    change() {
      console.log("change----", arguments);
    },
    preview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log("preview----", arguments);
    },

    getList_detail() {
      console.log("getList_detail 暂时留白");
    },
    handleSizeChange_detail(val) {
      this.listQuery_detail.limit = val;
      this.getList_detail();
    },
    handleCurrentChange_detail(val) {
      this.listQuery_detail.page = val;
      this.getList_detail();
    },
    addNewNotice() {
      this.waitAddNotice = true;
      setTimeout(() => {
        //发送成功该做的事情
        this.waitAddNotice = false;
        this.addNewShow = false;
        this.form = {};
        this.$notify({
          title: "发送成功",
          message: "这是一条成功的提示消息",
          type: "success"
        });
        //如果失败
        // this.waitAddNotice = false
      }, 2000);
    },
    addItem() {
      this.isAddItem = true;
      this.addNewShow = true;
      this.getList2();
    },

    getList2() {
      this.listLoading2 = true;
      let sendData = Object.assign({}, this.listQuery2);
      getGoodsList_api(sendData)
        .then(response => {
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if (response && response.status == 0) {
            let result = response.data;
            let tempTableData = [];
            result.forEach(aData => {
              let temp_fileList1 = [];
              let temp_fileList2 = [];
              if (aData.goods_image) {
                temp_fileList1.push({ url: aData.goods_image });
              }
              if (aData.id_card_front) {
                temp_fileList2.push({ url: aData.id_card_front });
              }
              if (aData.id_card_behind) {
                temp_fileList2.push({ url: aData.id_card_behind });
              }
              // goodstotal 库存 前后端不一致 需要特殊处理
              let goodsTotal = 0;
              if (aData.spec_name === "one") {
                goodsTotal = aData.goods_storage;
              } else {
                goodsTotal = aData.goods_storage;
              }
              //对  mutil类型的表单 处理

              // ！！！！！这里暂停工作 因为暂时没有接口

              tempTableData.push({
                //后端生成
                id: aData.goods_commonid,
                isUp: aData.goods_state,
                //前后统一
                goodsImage: aData.goods_image, //显示
                goodsType: aData.is_appoint ? 1 : 0,
                is_virtualTXT: aData.is_virtual ? "虚拟" : "实体", //显示补充，实际无用
                goodsName: aData.goods_name, //显示
                goodsPrice: aData.goods_price, //显示
                goodsNum: aData.goods_serial //显示
              });
            });
            this.tableData2 = tempTableData;
            this.total2 =
              response.pagination && response.pagination.total
                ? response.pagination.total
                : 1;
          } else {
          }
          // this.list = response
          this.listLoading2 = false;
        })
        .catch(e => {
          this.listLoading2 = false;
        });
    },
    //body
    editNewNotice(id) {
      let sendData = {
        goods_commonid: id,
        pin_token: "join"
      };
      addAllBuy_api(sendData)
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
          console.error("addAllBuy_api");
        });
    },

    editItem(index, row) {
      //点击选择商品
      let id = row.id;
      this.HeditItem(id); //弹出表单
    },
    deleteNewNotice(id) {
      let sendData = {
        cp_id: id
      };
      deleteKill_api(sendData)
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
              message: res.error,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteAdmin_api");
        });
    },
    deleteItem(index, row) {
      let id = row.cp_id;
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
    },
    getList() {
      this.listLoading = true;
      let sendData = Object.assign({}, this.listQuery);
      getKillList_api(sendData)
        .then(response => {
          console.log(response);
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if (response && response.status == 0) {
            let result = response.data;
            let tempTableData = [];
            result.forEach(aData => {
              tempTableData.push({
                cp_id: aData.cp_id,
                //后端生成
                id: aData.goods_commonid,
                image: aData.goods_image,
                name: aData.goods_name,
                price: aData.goods_price,
                cut_price: aData.cut_price,
                min_price: aData.min_price,
                outime: aData.outime
              });
            });
            this.tableData = tempTableData;
            this.total =
              response.pagination && response.pagination.total
                ? response.pagination.total
                : 0;
          } else {
          }
          console.log("getKillList_api", response);
          // this.list = response
          this.listLoading = false;
        })
        .catch(e => {
          this.listLoading = false;
        });
    }
  }
};
</script>