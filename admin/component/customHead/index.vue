<template>

      <el-form :inline="true" class="form">

        <el-form-item v-if='config.title'>
          <el-button type="primary" icon="el-icon-edit-outline" @click="showForm">{{config.title}}</el-button>
        </el-form-item>

        <el-form-item v-if='config.showKeywordSearch || config.placeHolder'>
            <el-input :style="{ width: config.width || '300px' }" :placeholder="config.placeHolder" v-model="keyword"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchByKeyWord">查询</el-button>
        </el-form-item>

        <el-form-item label="日期查询" v-if='config.dateWidth'>
            <el-date-picker :style="{ width: config.dateWidth }" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="date">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button>
        </el-form-item>

        <el-form-item :label="config.selectLabel" :label-width="config.selectWidth" v-if='config.categories'> 
          <el-select placeholder="请选择" v-model='status' @change='changeStatus'> <!-- multiple  -->
            <el-option v-for="item in config.categories" :key="item.id" :label="item.title || item.name || item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="config.selectLabelList && config.selectLabelList[selectIndex]" 
                      :label-width="config.selectWidth" 
                      v-for='(select, selectIndex) in config.selectList' :key='selectIndex' v-if='config.selectList'> 

          <el-select placeholder="请选择" v-model='statusList[selectIndex]' @change='changeStatus(selectIndex)'> <!-- multiple  -->
            <el-option v-for="item in select" :key="item.id" :label="item.title || item.name || item.label" :value="item.id"></el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="" v-if='config.showExport'>
          <el-button  type="primary" icon="document" @click="exportFile">导出Excel</el-button>
          <!-- <span class="hbs-inline-tips">导出所有数据，这个过程可能会需要花费  <span class="hbs-hot">几分钟</span> 的时间，请耐心等待</span> -->
        </el-form-item>

      </el-form>

</template>

<script>
export default {
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
          // categories: [
          //   { id: null, title: '全部' },
          //   { id: 0, title: '已取消' },
          //   { id: 10, title: '未付款' },
          //   { id: 20, title: '已付款' },
          //   { id: 30, title: '已发货' },
          //   { id: 40, title: '已收货' },
          //   { id: 50, title: '未评价' },
          // ],
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
    }
  },
  
  methods: {
    showForm(){
      console.log('emit add');
      this.$emit('add');
    },
    searchByKeyWord() { this.$emit('search', this.keyword); },
    changeStatus(index) { this.$emit('searchByStatus', index === undefined ? this.status : this.statusList, index) },
    searchByDate(){
      console.log('search date:', this.date);
      let date = {
        startDate: new Date(this.date[0]).toLocaleDateString(),
        endDate: new Date(this.date[1]).toLocaleDateString(),
      };

      this.$emit('searchByDate', date, 'date');
    },
    async exportFile() {
      let loading = this.$loading({ fullscreen: true })

      console.log('emit export file');
      this.$emit('exportFile', loading);

        // import('@/vendor/Export2Excel').then(excel => {
        //   const tHeader = this.classList.map(v => v.key)
        //   const filterVal = this.classList.map(v => v.value) 

        //   let data = this.tableData.map(v => filterVal.map(val => v[val] || '' ) )
        //   console.log(tHeader, filterVal, data)

        //   excel.export_json_to_excel({
        //     header: tHeader,
        //     data,
        //     filename: 'list',
        //     autoWidth: true 
        //   })
        //   loading.close() 
        // })
    },
  }
}
</script>

<style scoped>
  
</style>
