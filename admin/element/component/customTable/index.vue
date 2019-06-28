<template>
  <div>

    <el-table :data="data" stripe v-loading="config.loading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column align='center' :label="item.key" :prop="item.value" v-for='(item, index) in classList || config.classList' :key='index'>
        <template slot-scope="scope">
          <!-- thumb/avatar -->
          <img :class="{ 'thumb_img': item.isImg, 'avatar_img': item.isAvatar }" :src='scope.row[item.value]' v-if='item.isImg || item.isAvatar' />

          <!-- radio -->
          <div v-else-if='item.isRadio'>
            <i class='el-icon-check' v-if='scope.row[item.value]'></i>
            <i class='el-icon-close' v-else></i>
          </div>

          <!-- level -->
          <el-rate disabled v-model='scope.row[item.value]' v-else-if='item.isRate'></el-rate>

          <!-- list -->
          <el-popover trigger="hover" placement="top" v-else-if='item.isMulti'>
            <div v-for='(item, index) in scope.row[item.value]' :key='index'>
              <p>{{ item }}</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row[item.value][0] }}</el-tag>
            </div>
          </el-popover>

          <!-- normal text -->
          <div v-else>{{scope.row[item.value]}}</div>

        </template>
      </el-table-column>

      <el-table-column label="操作" v-if='config.showOperate'>
        <template slot-scope="scope">
          
          <el-button size="mini" type="primary" @click="emit(scope.$index, scope.row, 'show')" v-if='config.showDetail || config.detailTitle'>{{config.detailTitle || '详情'}}</el-button>

          <el-button size="mini" type="primary" @click="emit(scope.$index, scope.row, 'update')" v-if='config.updateTitle' v-text='config.updateTitle'></el-button>

          <el-button size="mini" type="primary" @click="emit(scope.$index, scope.row, 'look')" v-if='config.lookTitle' v-text='config.lookTitle'></el-button>

          <el-button size='mini' type="primary" @click="show(scope.$index, scope.row, index)" v-for='(item, index) in config.btnList' :key='index' v-if='scope.row[item.key]'>{{item.value}}</el-button>

          <!-- auth status -->
          <el-button size="mini" type="success" @click="showAuth(scope.$index, scope.row, 1)" v-if='config.showAuth && scope.row.state == 0'>同意</el-button>
          <el-button size="mini" type="warning" @click="showAuth(scope.$index, scope.row, 2)" v-if='config.showAuth && scope.row.state == 0'>拒绝</el-button>

          <el-button size="mini" type="primary" @click="showCustom(scope.$index, scope.row)" v-if="config.custom && typeof config.custom === 'string'" 
                    v-text='config.custom'></el-button>

          <el-button size="mini" type="primary" @click="showFinish(scope.$index, scope.row)" v-if="config.showFinish &&scope.row[config.showFinish[0]]"
                    v-text='config.showFinish[1]'></el-button>
          
          <el-button size="mini" type="warning" @click="showJudge(scope.$index, scope.row)" v-if="config.judge" 
                    v-text='scope.row[config.judge[0]] ? config.judge[1] : config.judge[2]'></el-button>

          <!-- <el-button size="mini" type="primary" @click="showSelect(scope.$index, scope.row)" v-if='config.showSelect'>{{config.selectTitle}}</el-button> -->

          <el-button size="mini" type="danger" @click="showDeleteDialog(scope.$index, scope.row)" v-if='config.showDelete || config.deleteTitle'>删除</el-button>

        </template>
      </el-table-column>

    </el-table>

    <el-pagination ref='pagination'
                  background :page-sizes="[10, 20, 30, 50]"
                  :current-page="query.page"
                  :page-size="query.limit"
                  :total="total"
                  @size-change="changeSize" 
                  v-if="'showPagination' in config ? config.showPagination : showPagination"
                  class="showPagination"
                  @current-change="changePage" layout="total, sizes, prev, pager, next" >
    </el-pagination>
    
  </div>
</template>

<script>
export default {
  name: 'customTable',

  props: {
    flag: {
      type: String,
    },

    config: {
      type: Object,
      default: function() {
        return {
          // {String|Array} custom 1. [judge conditional, TrueText, FalseText] 
        }
      }
    },

    data: {
      type: Array,
    },

    classList: {
      type: Array,
    },

    isLoading: {
      type: Boolean,
    },

    total: {
      type: Number,
    },

    showPagination:{
      type:Boolean,
      default:true
    }
  },

  data() {
    return {
      query: {
        limit: 10,
        page: 1,
        keyWord: '',
      },
    }
  },
  
  methods: {
    show(i, row, index){ this.$emit('modify', row, index); },
    showAuth(index, row, state){ this.$emit('auth', row, state) },
    showCustom(index, row){ this.$emit('custom', row, 'custom') },
    showJudge(index, row){ this.$emit('judge', row) },

    emit(index, row, eventName) { this.$emit(eventName, row, this.flag); },

    showDeleteDialog(index, row) {
      let config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      };

      this.$confirm(`确认要删除该项数据吗?`, '提示', config).then(() => {
        let loading = this.$loading({ text: '正在删除...', background: 'rgba(0, 0, 0, 0.7)' });

        this.$emit('delete', row, loading, this.flag);
      }).catch(e => this.$notify.info({ message: '已取消' }))
    },

    showFinish(index, row) {
      let config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }

      this.$confirm(`确认操作, 是否继续?`, '提示', config).then(() => this.$emit('finish', row)).catch(e => this.$notify.info({ message: '已取消' }))
    },

    // showSelect(index, row){ this.$emit('select', row); },

    changeSize(val){
      this.query.limit = val;
      this.query.page = 1;
      this.$emit('change', this.query, this.flag);
    },

    changePage(val){
      this.query.page = val;
      this.$emit('change', this.query, this.flag);
    },

    init(){
      this.query.page = 1;
      this.query.keyWord = '';

      // reset pagination when dynamic change current-page property value
      this.$refs.pagination.lastEmittedPage = 1;
    }
  },

  beforeDestroyed(){
    // this.query.page = 1;

    // this.$refs.pagination.lastEmittedPage = 1;
  }
}
</script>

<style scoped>
.thumb_img{
  width: 100px;
  height: 100px;
}
.avatar_img{
  width: 66px;
  height: 66px;
  border-radius: 50%;
}
.showPagination{
  margin-bottom: 100px;
}
</style>
