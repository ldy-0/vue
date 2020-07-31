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
          <el-button class='btn_wrap' type="primary" @click="click('emit', btnIndex, $event)" 
                     v-for='(item, btnIndex) in config.btnList' :key='btnIndex'>

                     <el-upload class='clear_upload' :action='item.url' :headers='item.header' :data='item.body' :limit='item.limit' :file-list='item.value' :show-file-list='false' multiple
                                :before-upload='beforeUpload'
                                :on-success='uploadSuccess'
                                :on-error='uploadError'
                                v-if="item.type == 'import'">{{item.titleKey ? item[item.titleKey] : item.title}}</el-upload>
                     
                     <div v-else>{{item.titleKey ? item[item.titleKey] : item.title}}</div>
          </el-button>
        </el-form-item>

        <!-- input -->
        <el-form-item v-if='config.showKeywordSearch || config.placeHolder'>
            <el-input :style="{ width: config.width || '300px' }" :placeholder="config.placeHolder" v-model="keyword"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <!-- inputList -->
        <el-form-item v-for='(inputItem, inputIndex) in config.inputList' :key='inputItem.placeholder'
                      :label="inputItem.title || inputItem.name || inputItem.label" 
                      :label-width="config.inputLabelWidth" 
                      v-if='config.inputList'>
            <el-input :style="{ width: inputItem.width || config.width || '300px' }" :placeholder="inputItem.placeholder || config.placeholder" v-model="inputList[inputIndex]"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <!-- Date -->
        <el-form-item label="日期查询" v-if='config.dateWidth'>
            <el-date-picker :style="{ width: config.dateWidth }" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="date">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <!-- DateList -->
        <el-form-item v-for='(dateItem, dateIndex) in config.dateList' :key='dateItem.title'
                      :label="dateItem.title || dateItem.name || dateItem.label" 
                      :label-width="config.dateLabelWidth" 
                      v-if='config.dateList'>

            <el-date-picker value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            :style="{ width: dateItem.width || config.dateWidth }" v-model="dateList[dateIndex]">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>

        </el-form-item>

        <!-- select -->
        <el-form-item :label="config.selectTitle || config.selectLabel" :label-width="config.selectWidth" v-if='isSelect'> 

          <el-select placeholder="请选择" v-model='status' @change='search'> <!-- multiple  -->
            <el-option v-for="item in config.selectList" :key="item.value || item.id" 
                       :label="item.title || item.name || item.label" 
                       :value="item.value || item.id"></el-option>
          </el-select>

        </el-form-item>

        <!-- selectList -->
        <el-form-item v-for='(select, selectIndex) in config.selectList' :key='selectIndex' 
                      :label="select.title || select.name || select.label" 
                      :label-width="select.width || config.selectWidth" 
                      v-if='isSelectList'> 

          <el-select placeholder="请选择" v-model='statusList[selectIndex]' @change='search($event, selectIndex)'> <!-- multiple  -->
            <el-option v-for="item in select.list" :key="item.value || item.id" 
                       :label="item[select.titleKey] || item.title || item.name || item.label" 
                       :value="item[select.valueKey] || item.value || item.id"></el-option>
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
      inputList: [],
      date: '',
      dateList: [],
      status: '',
      statusList: [],

      param: {},
    }
  },

  computed: {
    isSelect(){ 
      let config = this.config;

      return config.selectList && !config.selectList[0].list;
    },

    isSelectList(){
      let config = this.config;

      return config.selectList && config.selectList[0].list;
    },
  },

  watch: {
    status(v1, v2){ console.error(v1, v2); }
  },

  mounted(){
    let selectList = this.config.selectList,
        dateList = this.config.dateList,
        status = this.config.status,
        statusList = this.config.statusList || [];
    // console.error(JSON.stringify(this.config.selectList));

    // init Status
    this.status = status || '';

    // init statusList
    if(selectList && selectList[0].list) this.statusList = statusList;

    // init dateList
    // if(dateList) this.dateList = dateList.map((v, i) => '');
  },
  
  methods: {
    // btn click
    click(type, index, other){
      if(type == 'export') var loading = this.$loading({ fullscreen: true })

      this.$emit(type, typeof index == 'number' ? index : index || loading, other);
    },

    beforeUpload(file){
      this.$emit('beforeUpload', file);
      return true;
    },

    uploadSuccess(res, file, list){
      this.$emit('uploadSuccess', res, file, list);
    },

    uploadError(err){
      this.$emit('uploadError', err);
    },

    // switch change
    change(type, index, e){
      this.$emit('change', type, index, e);
    },

    search(index, selectIndex){
      let param = this.param,
          date = this.date;

      param.search = this.keyword;
      param.inputList = this.inputList;

      // date search
      param.date = this.date 
      ? { startDate: new Date(this.date[0]).toLocaleDateString(), endDate: new Date(this.date[1]+86400000).toLocaleDateString(), }
      : null;

      param.dateList = this.dateList[0] ? this.dateList.map(v => [v[0], v[1] + 86400000]) : this.dateList;

      // single status search
      param.status = typeof index === 'number' && typeof selectIndex !== 'number' ? index || 0 : null;

      param.statusList = this.statusList;

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
<style>
.el-header{
  height: auto!important;
}

.el-upload:focus{
  color: #fff!important;
}
</style>
