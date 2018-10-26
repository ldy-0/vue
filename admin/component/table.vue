<template>
  <div>

    <el-table :data="data" stripe v-loading="isLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList' :key='index'>
        <template slot-scope="scope">
          
          <img class='thumb_img' :src='scope.row[item.value]' v-if='item.isImg' />

          <div v-else-if='item.isIcon'>
            <i class='el-icon-check' v-if='scope.row[item.value]'></i>
            <i class='el-icon-close' v-else></i>
          </div>

          <!-- -->
          <el-popover trigger="hover" placement="top" v-else-if='item.isMulti'>
            <div v-for='(item, index) in scope.row[item.value]' :key='index'>
              <p>{{ item }}</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row[item.value][0] }}</el-tag>
            </div>
          </el-popover>

          <div v-else>{{scope.row[item.value]}}</div>

        </template>
      </el-table-column>

      <el-table-column label="操作" v-if='config.showOperate'>
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="text" @click="showDialog(scope.$index, scope.row)" v-if='showEdit'>编辑</el-button> -->
          <el-button size="mini" type="text"
                    @click="changeState(scope.$index, scope.row)" 
                    v-if="config.showDeliver && scope.row.order_state === '已支付'">{{scope.row.payment_name === '在线付款' ? '发货' : '结算'}}</el-button>
          <el-button size="mini" type="text" @click="showDetail(scope.$index, scope.row)" v-if='config.showDetail'>详情</el-button>
          <el-button size="mini" type="text" @click="showUpdate(scope.$index, scope.row)" v-if='config.showUpdate'>修改</el-button>
          <el-button size="mini" type="text" @click="showDetail(scope.$index, scope.row)" v-if='config.showLook'>查看</el-button>
          <el-button size="mini" type="text" @click="showAuthShow(scope.$index, scope.row)" v-if='config.showAuthUpdate'>授权修改</el-button>
          <el-button size="mini" type="text" @click="showAuthUpdate(scope.$index, scope.row)" v-if='config.showAuthShow'>授权查看</el-button>
          <el-button size="mini" type="text" @click="showStudent(scope.$index, scope.row)" v-if='config.showStudent'>查看学生</el-button>
          <el-button size="mini" type="text" @click="showAdd(scope.$index, scope.row)" v-if='config.showAdd'>增加期数</el-button>
          <el-button size="mini" type="text" @click="showMinus(scope.$index, scope.row)" v-if='config.showMinus'>减少期数</el-button>
          <el-button size="mini" type="text" @click="showDeleteDialog(scope.$index, scope.row)" v-if='config.showDelete'>删除</el-button>
          <!-- <slot name='scope.row'></slot> -->
        </template>
      </el-table-column>

    </el-table>

    <el-pagination background @size-change="changeSize" @current-change="changePage" :current-page="query.page" :page-sizes="[10,2,30, 50]" :page-size="query.limit" layout="total, sizes, prev, pager, next" :total="total">
    </el-pagination>
    
  </div>
</template>

<script>
export default {
  name: 'customTable',

  props: {
    config: {
      type: Object,
      default: function() {
        return {
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
    }
  },

  data() {
    return {
      query: {
        limit: null,
        page: 1,
        keyWord: '',
      }
    }
  },
  
  methods: {
    showDetail(index, row){ this.$emit('showDetail', row); },
    showUpdate(index, row){ this.$emit('update', row); },
    showDeleteDialog(index, row){
      let config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      };

      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', config).then(() => this.$emit('delete', row)).catch(e => this.$notify.info(e))
    },
    showAuthUpdate(index, row){
      this.$emit('authUpdate', row);
    },
    showAuthShow(index, row){
      this.$emit('authShow', row);
    },
    showStudent(index, row){
      this.$emit('showStudent', row);
    },
    showAdd(index, row){
      this.$emit('showAdd', row);
    },
    showMinus(index, row){
      this.$emit('showMinus', row);
    },
    changeState(index, row){
      this.$emit('changeState', row);
    },
    changeSize(val){
      this.query.limit = val;
      this.$emit('change', this.query);
    },
    changePage(val){
      this.query.page = val;
      this.$emit('change', this.query);
    },
    init(){
      console.log('table init ...')
      this.query.page = 1;
      this.query.keyWord = '';
    }
  }
}
</script>

<style scoped>

</style>
