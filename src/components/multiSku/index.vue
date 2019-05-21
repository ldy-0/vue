<template>
  <div class="">
    <el-button class='' type='primary' v-text='multiSkuConfig.classText' @click='addSkuClass'></el-button>

    <div class='class_item' v-for='(class_item, class_index) in skuClassList' :key='class_index'>

      <input class='class_input' v-model="class_item.name" />
      <el-button class='' v-text='multiSkuConfig.skuText' @click='addSku(class_index)'></el-button>
      <i class='el-icon-close class_close' @click='deleteSkuClass(class_index)'></i>

      <!-- skus -->
      <div>
        <div class='sku_item' v-for='(sku, sku_index) in class_item.skus' :key='sku_index'>
          <input class='sku_input' v-model='sku.name' />
          <i class='el-icon-close' @click='deleteSku(class_index, sku_index)'></i>
        </div>
      </div>

    </div>

    <!-- sku List -->
    <div class=''>

      <!-- sku goods title -->
      <div class='title'>
        <div class='column' v-for='(item, index) in skusTitle' :key='index' v-text='item.key'></div>
      </div>

        <div v-for='(sku, sku_index) in skuArr' :key='sku_index' :model='sku'>
          <div class='column' v-for='(item, index) in skusTitle' :key='index'>
            <input class='field_input' v-model='sku[item.value]' @input='change' v-if='isNaN(Number(item.value))' />
            <div v-text='sku[item.value]' v-else></div>
          </div>
        </div>

    </div>

  </div>
</template>
<script>

export default {
  name: 'multiSku',

  components: {
  },

  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    classList: {
      type: Array,
    },
    skuList: {
      type: Array,
    },
    limit: {
      type: Number,
      default(){ return Infinity }
    },
    type: {
      type: Number 
    },
  },

  data(){
    return {
      multiSkuConfig: {
        classText: '添加规格类别',
        skuText: '添加规格',
      },
      skuClassList: [],
      skus: [],
      attributeList: [
        { key: '商品编号', value: 'sku' },
        { key: '价格(元)', value: 'price' },
        { key: '标价(元)', value: 'marketprice' },
        { key: '库存', value: 'count' },
        // { key: '平台利润', value: 'profit' },
        { key: 'VIP1佣金', value: 'vip1_commission' },
        { key: 'VIP2佣金', value: 'vip2_commission' },
        { key: 'VIP3佣金', value: 'vip3_commission' },
        { key: 'VIP4佣金', value: 'vip4_commission' },
      ],
      rulesChild2: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur", min: 1, type: "string" }
        ],
        price: [
          { required: true, message: "请输入商品价格,不少于0", trigger: "blur", min: 0, type: "number" }
        ],
        // marketprice: [
        //   { required: true, message: "请输入参考价格,不少于0", trigger: "blur", min: 0, type: "number" }
        // ],
      }
    };
  },

  // watch: {
  //   skuList(v1, v2){
  //     console.error('watch: ', v1, v2);
  //   }
  // },

  computed: {
    skusTitle(){
      if(this.skuClassList && this.skuClassList.length){
        return this.skuClassList.map((v, i) => { return { key: v.name, value: i } }).concat(this.type === 1 ? this.attributeList.slice(0, 4) : this.attributeList);
      }
    },
    skuArr(){
      let classList = this.skuClassList;

      if(classList && this.skuClassList.length){
        let arr = this.update();
        this.skus = arr;
        return arr;
      }

      return [];
    }
  },

  methods: {
    addSkuClass(){
      let list = this.skuClassList,
          o = {
            // name: `新建规格分类${list.length + 1}`,
            name: ``,
            skus: [],
          };

      if(list.length >= this.limit) return this.$message.error(`规格类别最多为${this.limit}种`);

      list.push(o);

      this.addSku(list.length - 1);
      // console.error(this.skuClassList);
    },
    deleteSkuClass(index){
      this.skuClassList.splice(index, 1);

      this.update();
    },

    addSku(index){
      let list = this.skuClassList[index].skus,
          sku = {
            // name: `新建规格${list.length + 1}`,
            name: ``,
          };

      list.push(sku);

    },
    deleteSku(index, i){
      let class_item = this.skuClassList[index];

      class_item.skus.splice(i, 1);

      if(!class_item.skus.length) this.skuClassList.splice(index, 1);

      this.update();
    },

    change(){
      this.$emit('update', this.skuClassList, this.skus);
    },

    // update skus
    update(){
      let classList = this.skuClassList,
          skus = this.skus,
          skuList = [],
          skuIndex = [],
          sku,
          classArr,
          length;
      
      // compute skuList length 
      length = classList.length ? classList.reduce((len, v, i) => len *= v.skus.length, 1) : 0;

      // format skuClassList
      classArr = classList.map(v => v.skus);

      for(let i = 0; i < length; i++){
        skuIndex = this.getArray(i, classArr);
        sku = { name: '', index: skuIndex, };

        skuIndex.forEach((val, index) => {
          sku[index] = classList[index].skus[val].name;
          sku.name += `${sku[index]};`;
        });

        let match = skus.filter(v => v.name === sku.name)[0];
        if(match){
          sku.sku = match.sku;
          sku.price = match.price;
          sku.marketprice = match.marketprice;
          sku.count = match.count;
          // sku.profit = match.profit;
          sku.profit = 0;
          sku.vip1_commission = match.vip1_commission;
          sku.vip2_commission = match.vip2_commission;
          sku.vip3_commission = match.vip3_commission;
          sku.vip4_commission = match.vip4_commission;
          // this.classList[i].items[skuIndex].isNull = matchArr.every(goodsIndex => this.skus[goodsIndex].count <= this.skus[goodsIndex].secureAmount);
        }

        // handle modify sku name
        if(skus.length === length){
          sku.sku = skus[i].sku;
          sku.price = skus[i].price;
          sku.marketprice = skus[i].marketprice;
          sku.count = skus[i].count;
          // sku.profit = skus[i].profit;
          sku.profit =0;
          sku.vip1_commission = skus[i].vip1_commission;
          sku.vip2_commission = skus[i].vip2_commission;
          sku.vip3_commission = skus[i].vip3_commission;
          sku.vip4_commission = skus[i].vip4_commission;
        }

        skuList[i] = sku;
      }

      // console.error(skuList, length);
      this.$emit('update', classList, skuList);
      return skuList;
    },

    getArray(integer, arr){
      let len,
          new_arr = arr.map(v => 0);

      arr.forEach((v, i) => {

        for(let index = 0, L = v.length; index < L; index++){
          len = arr.slice(i + 1).reduce((pre, val) => pre * val.length, 1); 

          if(integer >= len){
            integer -= len;
            continue;
          }

          new_arr[i] = index;
          integer = integer % len;
          break;
        };
        
      });

      return new_arr;
    },

  },

  mounted(){
    this.skuClassList = JSON.parse(JSON.stringify(this.classList));
    this.skus = JSON.parse(JSON.stringify(this.skuList));

    // console.error('mounted', this.classList, this.skuClassList);
  }
}
</script>
<style lang="css" scoped>
input{
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  background: transparent;
}

.class_item{
  position: relative;
  padding: 10px 5px;
  border-bottom: 4px solid #f8f8f8;
}
.class_input{
  width: 200px;
  height: 32px;
  border: 1px solid #ccc;
}
.class_close{
  position: absolute;
  right: 0;
  font-size: 18px;
}

.sku_item{
  display: inline-block;
  width: 100px;
  height: 24px;
  margin: 0 20px 0 0;
  font-size: 12px;
}
.sku_input{
  width: 80px;
  padding: 2px 4px;
}

.column{
  display: inline-block;
  width: 10%;
}
.field_input{
  width: 80%;
  padding: 2px 4px;
  border: 1px solid #ccc;
}

.s_bg_1{ background: #fff; }
.s_bg_2{ background: green; }
</style>