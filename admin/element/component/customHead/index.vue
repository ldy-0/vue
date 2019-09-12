<template>
    <div>

      <!-- 添加class='form'属性会不显示 -->
      <el-form :inline="true">

        <!-- btn -->
        <el-form-item v-if='config.title'>
          <el-button type="primary" icon="el-icon-edit-outline" @click="click('add')">{{config.title}}</el-button>
        </el-form-item>

        <!-- Export -->
        <el-form-item label="" v-if='config.showExport'>
          <el-button  type="primary" icon="document" @click="click('export')">导出Excel</el-button>
        </el-form-item>

        <!-- btnList -->
        <el-form-item v-if='config.btnList'>
          <el-button class='btn_wrap' type="primary" @click="click('click', index, $event)" v-for='(item, index) in config.btnList' :key='index'>{{item.titleKey ? item[item.titleKey] : item.title}}</el-button>
        </el-form-item>

        <!-- input -->
        <el-form-item v-if='config.showKeywordSearch || config.placeHolder'>
            <el-input :style="{ width: config.width || '300px' }" :placeholder="config.placeHolder" v-model="keyword"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <!-- Date -->
        <el-form-item label="日期查询" v-if='config.dateWidth'>
            <el-date-picker :style="{ width: config.dateWidth }" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="date">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <el-form-item :label="config.selectLabel" :label-width="config.selectWidth" v-if='config.categories'> 
          <el-select placeholder="请选择" v-model='config.status || status' @change='search'> <!-- multiple  -->
            <el-option v-for="item in config.categories" :key="item.id" :label="item.title || item.name || item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- selectList -->
        <el-form-item :label="config.selectLabelList && config.selectLabelList[selectIndex]" 
                      :label-width="config.selectWidth" 
                      v-for='(select, selectIndex) in config.selectList' :key='selectIndex' v-if='config.selectList'> 

          <el-select placeholder="请选择" v-model='statusList[selectIndex]' @change='search($event, selectIndex)'> <!-- multiple  -->
            <el-option v-for="item in select" :key="item.id" :label="item.title || item.name || item.label" :value="item.id"></el-option>
          </el-select>

        </el-form-item>

        <!-- switch -->
        <el-form-item label="" v-if="'switchList' in config">
          <el-switch v-model="item.value" 
                     v-for="(item, index) in config.switchList" :key="index"
                     :disabled="item.disabled"
                     :active-text="item.title || item.activeText || '开关'"
                     :active-color="item.color || item.activeColor || '#13ce66'" :inactive-color="item.inactiveColor || '#C0CCDA'" @change="change('switch', index, $event)"></el-switch>
        </el-form-item>

      </el-form>
    </div>

</template>

<script>
export default {
  // Version 1.0.0

  name: 'customHead',
  
  props: {

    config: {
      type: Object,
      default: function() {
        return {
          inputWidth: '340px',
          dateWidth: '400px',
          placeholder: '请输入联系方式',
          selectLabel: '订单状态',
        }
      }
    },

  },

  data() {
    return {
      keyword: '',
      date: '',
      status: '',
      statusList: [],
      param: {
        statusList: [],
      },
    }
  },

  watch: {
  },

  mounted(){
    let selectList = this.config.selectList;
    // console.error(JSON.stringify(this.config.selectList));

    // init statusList
    if(selectList) this.statusList = selectList.map(v => v[0].id);
  },
  
  methods: {
    // btn click
    click(type, index, other){
      if(type == 'export') var loading = this.$loading({ fullscreen: true })

      this.$emit(type, index || loading, other);
    },

    // switch change
    change(type, index, e){
      this.$emit('change', type, index, e);
    },

    search(index, selectIndex){
      let param = this.param,
          date = this.date;

      param.search = this.keyword;

      // date search
      param.date = this.date 
      ? { startDate: new Date(this.date[0]).toLocaleDateString(), endDate: new Date(this.date[1]+86400000).toLocaleDateString(), }
      : null;

      // single status search
      param.status = typeof index === 'number' && typeof selectIndex !== 'number' ? index : null;

      if(typeof selectIndex === 'number'){
        param.statusList[selectIndex] = index;
      }

      this.$emit('search', param);
    },
    
  },

}
</script>

<style scoped>
.btn_wrap{
  margin-right: 20px;
} 
</style>
