<style lang="css">
.header {
  margin: 20px 0;
  height: 88px !important;
}
</style>

<template>
  <div>

    <el-header class="header">
      <custom-head style="display:inline-block" :config='headConfig' @add='updateForm(1)' @search='search'></custom-head>
      <el-form :inline="true" style="display:inline-block">
        <multiSelect :obj='headConfig.multiSelect' @load='loadClass2' @search="searchByclass"></multiSelect>
      </el-form>
    </el-header>

    <custom-table :config='tableConfig' :data='list' :total='total' :isLoading='isLoading' @update='updateForm' @delete='deleteItem' @judge="judgeItem" @change='change'></custom-table>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <el-form label-width='100px'>
        <custom-img :obj='img'></custom-img>

        <custom-img :obj='detailImg'></custom-img>

        <custom-input :obj='name'></custom-input>

        <custom-select :obj='category'></custom-select>

        <multiSelect :obj='classify' @load='loadClass'></multiSelect>

        <custom-radio :obj='spec'></custom-radio>

        <div v-if="spec.value == 1">
          <custom-input :obj='sku'></custom-input>
          <number :obj='marketprice'></number>
          <number :obj='price'></number>
          <integer :obj='amount'></integer>
          <!-- <number :obj='profit'></number> -->
          <div v-if='category.value == 0'>
            <number :obj='vip1_commission'></number>
            <number :obj='vip2_commission'></number>
            <number :obj='vip3_commission'></number>
            <number :obj='vip4_commission'></number>
          </div>
        </div>
        <div v-if="spec.value == 2">
          <el-form-item>
            <multi-sku :type='category.value' :classList='skuClassList' :skuList='skuList' :limit='5' @update='updateMultiSku'></multi-sku>
          </el-form-item>
        </div>

        <number :obj='freight'></number>
        <number :obj='goods_sort'></number>
        <el-form-item :label="content.title" v-if='dialogConfig.status'>
          <editor style='width: 800px;' v-model='content.value'></editor>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import customInput from "@/components/input";
import customSelect from "@/components/select";
import multiSelect from "@/components/multiSelect";
import customRadio from "@/components/radio";
import number from "@/components/number";
import integer from "@/components/integer";
import dateTimeRange from "@/components/dateTimeRange";
import customImg from "@/components/customImg";
import editor from "@/components/Tinymce";
import multiSku from "@/components/multiSku";
import api from "@/api/goods";
import commonReq from "@/api/common";
import classAPI from "@/api/classify";
import { voidTypeAnnotation } from "babel-types";

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customSelect,
    multiSelect,
    customRadio,
    number,
    integer,
    dateTimeRange,
    customImg,
    editor,
    multiSku
  },

  computed: {
    showDialog() {
      return Boolean(this.dialogConfig.status);
    }
  },

  data() {
    return {
      dialogConfig: {
        title: "",
        status: 0 // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      img: {
        title: "商品图片",
        value: [],
        limit: 1,
        alert: null,
        url: "https://up-z2.qiniup.com",
        cdnUrl: "https://cdn.health.healthplatform.xyz",
        body: {}
      },
      detailImg: {
        title: "详情图片",
        value: [],
        limit: 10,
        alert: null,
        url: "https://up-z2.qiniup.com",
        cdnUrl: "https://cdn.health.healthplatform.xyz",
        body: {}
      },
      name: { title: "商品名称", value: "", alert: null },
      category: {
        title: "类别",
        categories: [{ id: 0, title: "常规商品" }, { id: 1, title: "VIP商品" }],
        value: "",
        alert: null
      },
      classify: { title: "分类", source: [], value: [], alert: null },
      spec: {
        title: "规格",
        categories: [{ id: 1, title: "单规格" }, { id: 2, title: "多规格" }],
        value: 1,
        alert: null
      },
      sku: { title: "商品编号", value: "", alert: null },
      marketprice: { title: "原价", value: "", alert: null },
      price: { title: "售价", value: "", alert: null },
      amount: { title: "库存", value: "", alert: null },
      freight: { title: "运费", value: "", alert: null, isZero: true },
      goods_sort: { title: "排序序号", value: "", alert: null },
      profit: { title: "平台利润", value: 0, alert: null },
      vip1_commission: { title: "VIP1佣金", value: "", alert: null },
      vip2_commission: { title: "VIP2佣金", value: "", alert: null },
      vip3_commission: { title: "VIP3佣金", value: "", alert: null },
      vip4_commission: { title: "VIP4佣金", value: "", alert: null },
      content: { title: "商品详情", value: "", alert: null },
      skuClassList: [],
      skuList: [],
      classList: [],
      specList: [],
      detail: null,
      stopSubmit: false,

      headConfig: {
        title: "添加商品",
        placeHolder: "请输入商品名称",
        showKeywordSearch: "slkfjlksdajf",
        selectLabelList: ["类别", "状态"],
        multiSelect: {
          title: "分类",
          source: [],
          value: [],
          alert: null,
          search: true
        },
        selectList: [
          [
            { id: null, name: "全部" },
            { id: 0, name: "常规商品" },
            { id: 1, name: "VIP商品" }
          ],
          [
            { id: null, name: "全部" },
            { id: 1, name: "上架" },
            { id: 0, name: "下架" }
          ]
        ]
      },

      tableConfig: {
        showOperate: true,
        updateTitle: "编辑",
        showDelete: true,
        judge: ["goods_state", "下架", "上架"],
        classList: [
          { key: "排序序号", value: "goods_sort" },
          { key: "图片", value: "goods_image", isImg: true },
          { key: "商品名称", value: "goods_name" },
          { key: "一级分类", value: "gc_name_1" },
          { key: "二级分类", value: "gc_name_2" },
          { key: "三级分类", value: "gc_name_3" },
          { key: "库存", value: "goods_storage" },
          { key: "原价", value: "goods_marketprice" },
          { key: "售价", value: "goods_price" },
          { key: "类别", value: "is_vipStr" },
          { key: "状态", value: "goods_stateStr" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10
      },
      isLoading: true,

      allClass: []
    };
  },
  methods: {
    search(param) {
      this.query.search = param.search;
      this.query.is_vip = param.statusList[0];
      this.query.goods_state = param.statusList[1];
      this.getList();
    },
    searchByclass(param) {
      this.query.page = 1;
      this.query.gc_id = param[2];
      this.getList();
    },

    async updateForm(status) {
      let goods;
      this.spec.value = 1;
      this.dialogConfig.status = typeof status === "number" ? status : 2;

      // Edit
      if (status != 1) {
        let res = await api.getGoods(status.goods_commonid);
        if (res.error) return this.$message.error(res.error);
        goods = res.data;
      }

      // get first class list
      let classRes = await classAPI.getClassList({ parent_id: 0 });
      classRes.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        v.children = [];
      });
      this.classify.source = classRes.data;

      if (goods) {
        await this.loadClass([goods.gc_id_1, 0, 0]);
        await this.loadClass([goods.gc_id_1, goods.gc_id_2, 0]);
      }

      this.img.value = goods ? [{ url: goods.goods_image }] : [];
      this.detailImg.value = goods
        ? goods.goodsimagesList
            .map(v => {
              return { url: v.goodsimage_url };
            })
            .slice(1)
        : [];
      this.name.value = goods ? goods.goods_name : "";
      this.category.value = goods
        ? "is_vip" in goods ? goods.is_vip : ""
        : "";
      this.classify.value = goods
        ? [goods.gc_id_1, goods.gc_id_2, goods.gc_id_3]
        : [];
      this.freight.value = goods ? goods.goods_freight : "";
      this.content.value = goods ? goods.goods_body : "";
      this.goods_sort.value = goods ? goods.goods_sort : '';

      this.spec.value = goods ? (goods.spec_value ? 2 : 1) : 1;
      if (goods ? !goods.spec_value : true) {
        let sku = goods ? goods.SKUList[0] : {};
        this.sku.value = goods ? sku.goods_serial : "";
        this.marketprice.value = goods ? goods.goods_marketprice : "";
        this.price.value = goods ? goods.goods_price : "";
        this.amount.value = goods ? sku.goods_storage : "";
        this.profit.value = 0;
        this.vip1_commission.value = goods ? sku.vip1_commission : "";
        this.vip2_commission.value = goods ? sku.vip2_commission : "";
        this.vip3_commission.value = goods ? sku.vip3_commission : "";
        this.vip4_commission.value = goods ? sku.vip4_commission : "";
      } else {
        this.skuClassList = goods.spec_name.map((v, i) => {
          return {
            name: v,
            skus: goods.spec_value[i].map(val => {
              return { name: val };
            })
          };
        });
        goods.SKUList.forEach(v => {
          v.price = Number(v.goods_price);
          v.marketprice = Number(v.goods_marketprice);
          v.count = Number(v.goods_storage);
          v.sku = v.goods_serial;
        });
        this.skuList = goods.SKUList;
      }

      this.detail = goods;
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },
    change(param) {
      console.log("param :", param);
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    // Update multi sku goods
    updateMultiSku(classList, skus) {
      console.log("update", classList, skus);
      this.classList = classList;
      this.specList = skus;
    },
    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },
    async submit() {
      let paramArr = ["name"],
        spec = this.spec,
        imgList = this.img.value,
        firstSpec = this.specList[0],
        param;

      if (!imgList.length) return (this.img.alert = "请选择图片作为主图");

      if (spec.value == 1)
        paramArr.push(
          "sku",
          "marketprice",
          "price",
          "amount",
          "vip1_commission",
          "vip2_commission",
          "vip3_commission",
          "vip4_commission"
        );

      // vip
      if(this.category.value){
        paramArr = paramArr.slice(0, 4);
        this.vip1_commission.value = this.vip2_commission.value = this.vip3_commission.value = this.vip4_commission.value = 0;
      }

      if (
        paramArr.some(v => {
          return this[v].value
            ? false
            : (this[v].alert = `请输入${this[v].title}`);
        })
      )
        return;
      if (typeof this.category.value !== "number")
        return (this.category.alert = `请选择${this.category.title}`);
      if (!this.classify.value[2])
        return (this.classify.alert = `请选择${this.classify.title}`);

      // multiSku
      if (spec.value == 2) {
        let err = "";
        if (!this.specList.length) return this.$message.error(`规格类别不能空`);

        this.specList.some(item => {
          let arr = [
            { key: "VIP4佣金", value: "vip4_commission" },
            { key: "VIP3佣金", value: "vip3_commission" },
            { key: "VIP2佣金", value: "vip2_commission" },
            { key: "VIP1佣金", value: "vip1_commission" },
            // { key: "平台利润", value: "profit" },
            { key: "库存数量", value: "count" },
            { key: "价格", value: "price" },
            { key: "sku", value: "sku" },
          ];

          if(this.category.value){
            arr = arr.slice(4);
            item.vip1_commission = item.vip2_commission = item.vip3_commission = item.vip4_commission = 0;
          }

          arr.forEach((v, i) => {
            if (!(item[v.value] > 0)) err = `${v.key}必须为大于零的数字`;
          });

          return err;
        });

        if (err) return this.$message.error(err);
      }
      // freight
      if (!this.freight.value)
        return (this.freight.alert = `请选择${this.freight.title}`);

      this.stopSubmit = true;

      imgList = imgList.concat(this.detailImg.value);
      let img = imgList.map(v => {
        return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url;
      });
      if (!img[0]) return console.error("img value :", img);

      param = {
        goods_image: img,
        goods_name: this.name.value,
        is_vip: this.category.value,
        gc_id_1: this.classify.value[0],
        gc_id_2: this.classify.value[1],
        gc_id_3: this.classify.value[2],
        gc_id: this.classify.value[2],
        goods_freight: this.freight.value,
        goods_sort: this.goods_sort.value,
        goods_body: this.content.value,
        goods_price: firstSpec ? firstSpec.price : this.price.value,
        goods_marketprice: firstSpec ? firstSpec.marketprice : this.marketprice.value,
      };

      if (spec.value == 1) {
        let o = {};
        [
          "sku",
          "price",
          "marketprice",
          "profit",
          "vip1_commission",
          "vip2_commission",
          "vip3_commission",
          "vip4_commission"
        ].forEach(prop => (o[prop] = this[prop].value));
        o.stock = this.amount.value;
        o.spec_attr = "";

        param.spec_name = null;
        param.spec_value = o.sp_value = null;
        param.spec = [o];
      } else {
        let spec_name = {},
          spec_value = {};

        this.classList.forEach((v, i) => {
          let o = {};
          v.skus.forEach((sku, skuIndex) => (o[skuIndex] = sku.name));
          spec_value[i] = o;
        });
        this.classList.forEach((v, i) => (spec_name[i] = v.name));

        let spec = this.specList.map(v => {
          let o = {};
          [
            "sku",
            "price",
            "marketprice",
            "profit",
            "vip1_commission",
            "vip2_commission",
            "vip3_commission",
            "vip4_commission"
          ].forEach(prop => (o[prop] = v[prop]));
          (o.spec_attr = v.index.join("_")),
            (o.sp_value = this.formatName(v.name));
          o.stock = v.count;
          return o;
        });

        param.spec_value = spec_value;
        param.spec_name = spec_name;
        param.spec = spec;
      }

      // return console.error(img, o, 'about param : ', param);
      this.save(param);
    },
    async format(item) {
      let matcher,
        arr = ["is_vip", "goods_state"],
        selectList = this.headConfig.selectList,
        classify;

      item.img = [{ url: item.goods_image }];
      item.detailImg = item.detailImg
        ? item.detailImg.map(v => {
            return { url: v };
          })
        : [];

      // get match
      matcher = this.exchange(selectList, arr.map(v => item[v]), "id", "name");
      arr.forEach((v, i) => (item[`${v}Str`] = matcher[i]));

      // 分类名
      this.allClass.filter(v => {
        if (v.storegc_id == item.gc_id_1) {
          item.gc_name_1 = v.storegc_name;
        }
      });
      this.allClass.filter(v => {
        if (v.storegc_id == item.gc_id_2) {
          item.gc_name_2 = v.storegc_name;
        }
      });
      this.allClass.filter(v => {
        if (v.storegc_id == item.gc_id_3) {
          item.gc_name_3 = v.storegc_name;
        }
      });
    },
    exchange(sourceList, valueList, filterProperty, destProperty) {
      let res,
        resList = [];

      sourceList.forEach((list, index) => {
        res = list.filter(v => v[filterProperty] == valueList[index])[0];
        resList[index] = res ? res[destProperty] : "";
      });
      return resList;
    },
    //
    async loadClass(val) {
      let param,
        selClass,
        source = this.classify.source;

      selClass = source.find(v => v.value == val[0]);
      if(!selClass) return ;

      if (val[1]) selClass = selClass.children.find(v => v.value == val[1]);

      let res = await classAPI.getClassList({ parent_id: val[1] || val[0] });

      res.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        if (!val[1]) v.children = [];
      });

      selClass.children = res.data;
    },
    async loadClass2(val) {
      let param,
        selClass,
        source = this.headConfig.multiSelect.source;

      selClass = source.find(v => v.value == val[0]);
      if (val[1]) selClass = selClass.children.find(v => v.value == val[1]);

      let res = await classAPI.getClassList({ parent_id: val[1] || val[0] });

      res.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        if (!val[1]) v.children = [];
      });

      selClass.children = res.data;
    },

    async save(param) {
      let status = this.dialogConfig.status;
      console.log("save: ", param, status);
      let res =
        status == 1
          ? await api.addGoods(param)
          : await api.setGoods(this.detail.goods_commonid, param);

      this.getList();
      this.stopSubmit = false;
      this.dialogConfig.status = 0;
    },

    async getList() {
      //获取列表
      this.isLoading = true;
      this.query.type = 'sort'
      let res = await api.getGoodsList(this.query, this);

      if (res.error) return this.$message.error(res.error);

      // get all class list
      let allClass = await classAPI.getClassList();
      if (allClass.error) this.$message.error(allClass.error);
      this.allClass = allClass.data;
      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.isLoading = false;
    },

    async deleteItem(item) {
      let res = await api.deleteGoods(item.goods_commonid);

      this.getList();
    },

    async judgeItem(item) {
      let send = {
        goods_commonid: [item.goods_commonid]
      };
      if (item.goods_state == 1) {
        send.type = "offline";
      } else {
        send.type = "online";
      }

      let res = await api.UpDownGoods(send);
      if (res.status == 0) {
        this.$message.success("操作成功");
        this.getList();
      } else {
        this.$message.error("操作失败，请刷新重试");
      }
    },
    async getUploadToken() {
      let res = await commonReq.getUploadToken();

      if (res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.detailImg.body.token = this.img.body.token = res.data;
      this.detailImg.body.config = this.img.body.config =
        "{ useCdnDomain: true }";
    },

    // utils
    formatClass() {
      let arr = this.classify.value,
        source = this.classify.source;
      return source[arr[0]].children[arr[1]].children[arr[2]];
    },
    formatName(name) {
      let o = {};

      name
        .replace(/;$/, "")
        .split(";")
        .forEach((v, i) => (o[this.classList[i].name] = v));

      return o;
    }
  },

  async created() {
    this.getList();
    this.getUploadToken();
    let classRes = await classAPI.getClassList({ parent_id: 0 });
    classRes.data.forEach(v => {
      v.label = v.storegc_name;
      v.value = v.storegc_id;
      v.children = [];
    });
    this.headConfig.multiSelect.source = classRes.data;
  }
};
</script>