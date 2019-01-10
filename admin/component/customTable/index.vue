<template>
  <div>

    <el-table :data="data" stripe v-loading="isLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList || config.classList' :key='index'>
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
          
          <el-button size="mini" type="text"
                    @click="changeState(scope.$index, scope.row)" 
                    v-if="config.showDeliver && scope.row.order_state === '已支付'">{{scope.row.payment_name === '在线付款' ? '发货' : '结算'}}</el-button>
          <el-button size="mini" type="text" @click="showDetail(scope.$index, scope.row)" v-if='config.showDetail'>详情</el-button>
          <el-button size="mini" type="text" @click="showUpdate(scope.$index, scope.row)" v-if='config.updateTitle' v-text='config.updateTitle'></el-button>
          <el-button size="mini" type="text" @click="showLook(scope.$index, scope.row)" v-if='config.lookTitle' v-text='config.lookTitle'></el-button>
          <el-button size="mini" type="text" @click="showAuth(scope.$index, scope.row, 1)" v-if='config.showAuth'>同意</el-button>
          <el-button size="mini" type="text" @click="showAuth(scope.$index, scope.row, 0)" v-if='config.showAuth'>拒绝</el-button>

          <el-button size="mini" type="text" @click="showCustom(scope.$index, scope.row)" v-if="config.custom && typeof config.custom === 'string'" 
                    v-text='config.custom'></el-button>
          
          <el-button size="mini" type="text" @click="showJudge(scope.$index, scope.row)" v-if="config.judge" 
                    v-text='scope.row[config.judge[0]] ? config.judge[1] : config.judge[2]'></el-button>

          <el-button size="mini" type="text" @click="showAuthUpdate(scope.$index, scope.row)" v-if='config.showAuthUpdate'>{{scope.row.canUpdate ? '取消修改权限' : '授权修改'}}</el-button>
          <el-button size="mini" type="text" @click="showAuthShow(scope.$index, scope.row)" v-if='config.showAuthShow'>{{scope.row.canShow ? '取消查看权限' : '授权查看'}}</el-button>
          <el-button size="mini" type="text" @click="showSelect(scope.$index, scope.row)" v-if='config.showSelect'>{{config.selectTitle}}</el-button>
          <el-button size="mini" type="text" @click="showAdd(scope.$index, scope.row)" v-if='config.showAdd'>增加期数</el-button>
          <el-button size="mini" type="text" @click="showMinus(scope.$index, scope.row)" v-if='config.showMinus'>减少期数</el-button>
          <el-button size="mini" type="text" @click="showDeleteDialog(scope.$index, scope.row)" v-if='config.showDelete'>删除</el-button>
          <el-button size="mini" type="text" @click="showCome(scope.$index, scope.row)" v-if='config.showCome'>未到岗</el-button>
          <el-button size="mini" type="text" @click="showSignIn(scope.$index, scope.row)" v-if='config.showSignIn'>查看签到</el-button>
          <el-button size="mini" type="text" @click="showSignOut(scope.$index, scope.row)" v-if='config.showSignOut'>查看离开</el-button>
          <!-- <slot name='scope.row'></slot> -->
        </template>
      </el-table-column>

    </el-table>

    <el-pagination background :page-sizes="[10, 20, 30, 50]"
                  :current-page="query.page"
                  :page-size="query.limit"
                  :total="total"
                  @size-change="changeSize" 
                  @current-change="changePage" layout="total, sizes, prev, pager, next" >
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
    }
  },

  data() {
    return {
      query: {
        limit: 10,
        page: 1,
        keyWord: '',
      }
    }
  },
  
  methods: {
    showDetail(index, row) { this.$emit('showDetail', row); },
    showUpdate(index, row) { this.$emit('update', row); },
    showLook(index, row) { this.$emit('look', row); },
    showAuth(index, row, state) { this.$emit('auth', row, state) },
    showCustom(index, row) { this.$emit('custom', row, 'custom') },
    showJudge(index, row) { this.$emit('judge', row) },
    showDeleteDialog(index, row) {
      let config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }

      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', config).then(() => this.$emit('delete', row)).catch(e => this.$notify.info({ message: '已取消' }))
    },

    showAuthUpdate(index, row){
      this.$emit('authUpdate', 'update', row);
    },
    showAuthShow(index, row){
      this.$emit('authShow', 'show', row);
    },
    showSelect(index, row){ this.$emit('select', row); },
    showAdd(index, row){
      this.$emit('showAdd', row);
    },
    showMinus(index, row){
      this.$emit('showMinus', row);
    },
    showCome(index, row){ this.$emit('uncome', row); },
    showSignIn(index, row){ this.$emit('signIn', row); },
    showSignOut(index, row){ this.$emit('signOut', row); },
    changeState(index, row){
      this.$emit('changeState', row);
    },
    changeSize(val){
      this.query.limit = val;
      this.query.page = 1;
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
.thumb_img{
  width: 100px;
  height: 100px;
}
</style>
