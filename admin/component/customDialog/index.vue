<template>
 <el-dialog :visible='visible' :before-close='cancel' :width="config.width || '80%'">

    <div v-if='config.isCustom'>
      <slot></slot>
    </div>

    <el-form :label-width="config.labelWidth || '100px'" :disabled='config.isDisabled' :model='detail' ref='ruleForm' :rules='config.rules' v-else>

      <el-form-item :label="item.key"  
                    v-for='(item, index) in list || config.classList' 
                    :key='index' 
                    v-if='!item.isHide && !(config.isDisabled && !detail[item.value])' 
                    :prop='item.value'>

        <!-- input -->
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isText'></el-input>
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isNumber' @input='validateNumber(item)'></el-input>
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isInteger' @input='input(item)'></el-input>
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isPhone' @input='input(item)'></el-input>

        <!-- textarea -->
        <el-input type='textarea' v-model="detail[item.value]" auto-complete="off" :disabled='true' v-if='item.isTexts'></el-input>

        <!-- date
              dateType: datetime | datetimerange
         -->
        <el-date-picker style="width:400px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
                          :type="item.dateType"
                          v-model="detail[item.value]"
                          v-if='item.dateType'>
        </el-date-picker>

        <!-- imgs -->
        <img class='detail_imgs' :src='v.url || v' v-for='(v, i) in detail[item.value]' :key='i' v-if='item.isImgs' />

        <!-- img -->
        <el-upload action=''
            list-type="picture-card"
            :auto-upload="false"
            :limit='item.limit'
            :file-list='detail[item.value]' 
            :on-remove='changeImgs'
            :on-change="changeImgs"
            v-if='item.isImg'>

            <i class="el-icon-plus"></i>

        </el-upload>

        <!-- radio -->
        <el-radio-group v-model='detail[item.value]' v-if='item.isRadio'>
          <el-radio :label='1'>是</el-radio>
          <el-radio :label='0'>否</el-radio>
        </el-radio-group>

        <!-- select -->
        <el-select v-model="detail[item.value]" :placeholder="item.placeholder" v-if='item.isSelect' @change='selectChange(item.value, $event)'>
          <el-option v-for="option in item.list" :key="option[item.id]" :label="option[item.name]" :value="option[item.id]"></el-option>
        </el-select>
        <!-- <div v-if='item.isSelect && item.isShowDetail'>
          <div class='course_detail' v-for='(detail, index) in item.detailList' :key='index'>
            <span class='interval'>教师：{{detail.teacher_name}}</span>
            <span class='interval'>教学点: {{detail.address_name}}</span>
            <span class='interval'>可预约人数: {{detail.max_stunum}}</span>
            <div>教学时间:
              <ul><li v-for='(time, i) in detail.time' :key='i'>{{time.join()}}</li></ul>
            </div>
          </div>
        </div> -->

        <!-- multiSelect -->
        <el-select :style="{ width: item.width || '400px' }" v-model="detail[item.value]" multiple :placeholder="item.placeholder" v-if='item.isMultiSelect'>
          <el-option v-for="option in item.list" :key="option[item.id]" :label="option[item.name]" :value="option[item.id]"></el-option>
        </el-select>

        <!-- dates -->
        <div v-if='item.isDates'>
          <el-date-picker style="width:400px" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
                          v-model="date"
                          @change='addDate(item.value, $event)'>
          </el-date-picker>
          <div class='time' v-for='(item, index) in detail[item.value]' :key='index'>
            <div class='f-fs' v-text='item.start'></div>-<div class='f-fs' v-text='item.end'></div>
            <el-button style='margin-left: 20px;' @click='deleteDate(index)' type='danger' size='mini'>删除</el-button>
          </div>
        </div>

        <!-- tag -->
        <div v-if='item.isTagList'>
          <el-tag style='margin-right: 20px;' v-for='(tag, index) in item.list' :key='index'>{{tag[item.name]}}{{tag.time ? '(' + tag.time[0].join() + ')' : ''}}</el-tag>
        </div>

        <!-- detail -->
        <div v-if='item.isDetail'>
          <el-button @click="addDetail(item.value)" v-text='item.title' v-if='item.title'></el-button>
          <slot></slot>
        </div>

        <!-- goods img -->
        <el-upload action=''
            list-type="picture-card"
            :auto-upload="false"
            :file-list='detail[item.value]'
            :on-remove='changeGoodsImgs'
            :on-change="changeGoodsImgs"
            v-if='item.isGoodsImg'>

            <i class="el-icon-plus"></i>

        </el-upload>


      </el-form-item>
      
    </el-form>

    <!-- auth button -->
    <div class='auth_wrap' v-if='config.showAuth'>
      <el-button type='success' @click='auth(1)'>同意</el-button>
      <el-button type='danger' @click='auth(0)'>拒绝</el-button>
    </div>

    <span slot="footer" class="dialog-footer" v-if='!config.isDisabled'>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :disabled="!config.canSubmit" :loading="!config.canSubmit" @click="submitForm('ruleForm')">确 定</el-button>
    </span>

  </el-dialog> 
</template>

<script>
import upLoadFile from '@/utils/aahbs.js'

export default {
  name: 'dialog',

  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    detail: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    list: {
      type: Array
    }
  },

  data() {
    return {
      goodsImgs: [],
      imgs: [],
      date: '',  
      timeKey: '', // 时间段字段名 
      error: [], // 错误列表
      canSubmit: true,
      interval: null,
      // rules: {
      //     'seller_name': [
      //       { required: true, message: '请输入名字', trigger: 'blur' },
      //       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      //     ],
      //     // 'seller_id': [
      //     //   { type: 'number', message: '编号必须为数字值'}
      //     // ]
      //   },
    }
  },
  
  methods: {
    auth(state) { this.$emit('auth', this.detail, state) },
    cancel() {
      console.log('cancel dialog --');
      this.$emit('cancel');
    },
    async submitForm(form) {
      let res = await this.$refs['ruleForm'].validate().catch(e => e);
      if(!res) return ;

      if(!this.canSubmit) return ;

      if(this.detail[this.timeKey] && !this.detail[this.timeKey].length)return this.$message({ message: '请添加日期' });

      // NOTE: $message.error()传对象会修改对象，出现提示无法消失问题
      if(this.error.length) return this.$message.error(this.error[0].message);

      // format img url
      let uploadList = this.imgs.filter(v => v.raw),
          imgs = [];

      // console.warn('upload list: ', uploadList);
      if(uploadList.length) imgs = await upLoadFile(uploadList.map(v => v.raw));

      this.$emit('submit', this.imgs.filter(v => !v.raw).concat(imgs.map(v => { return { url: v }; })), this.goodsImgs);
    },

    // select
    selectChange(v, id){ this.$emit(`change${v}`, id, v); },


    changeImgs(e, list){
      this.imgs = list;
      console.log(`change img : `, this.imgs)
    },

    changeGoodsImgs(file, files){
      this.goodsImgs = files; 
    },

    // dates
    addDate(key, e){
      let dateList = this.detail[key],
          time = e[0].getTime(),
          newTime = { start: e[0].toLocaleString(), startTemp: e[0].getTime(), end: e[1].toLocaleString(), endTemp: e[1].getTime() };

      this.timeKey = key;

      if(time < Date.now()) return this.$message({ message: '选择时间无效' });

      // this.detail[key].push({ start: e[0].toLocaleString(), startTemp: e[0].getTime(), end: e[1].toLocaleString(), endTemp: e[1].getTime() });
      for(var i = 0, len = dateList.length; i < len; i++){

        if(dateList[i].startTemp >= time){
          this.detail[key] = dateList.concat(newTime, dateList.splice(i));
          break;
        }
      }
      this.detail[key].length === i && this.detail[key].push(newTime);

      console.log('add date', key, this.detail[key], e);
    },
    deleteDate(index){
      console.log('delete date', index);
      this.detail[this.timeKey].splice(index, 1);
    },
    addDetail(key){
      this.$emit('addDetail');
    },
    blur(v){
      if(!v) this.$message.error({ message: '内容不能为空!' })
    },

    validateNumber(item){
      let v = this.detail[item.value];

      v >= 0
      ? this.error = this.error.filter(v => v.name !== `${item.value}1`)
      : this.error.push({ name: `${item.value}1`, prop: item.value, message: '请输入数字!' });
    },
    input(item){
      let v = this.detail[item.value],
          phonePattern = /^((13[0-9])|(14[5|7|9])|(15([0-3]|[5-9]))|(17[0,1,3,5,6,7,8])|(18[0-9]))\d{8}$/;

      console.warn('input --', item, v)
      if(isNaN(Number(v)))return ;

      if(item.isNumber && v <= 0)return this.error.push({ prop: item.value, message: '值必须大于零' });

      if(item.isInteger && v % 1 !== 0)return this.error.push({ prop: item.value, message: '值必须为整数' });

      if(item.isPhone && !phonePattern.test(v)) return this.error.push({ prop: item.value, message: '手机号不合法!', duration: 1500 });

      this.error = this.error.filter(v => v.prop !== item.value); // clear error
      this.detail[item.value] = item.isPhone ? v : Number(v);

    } 
  }
}
</script>

<style scoped>
.course_detail{
  border-bottom: 1px solid gray;
}

.interval{
  margin-right: 100px;
}

.auth_wrap{
  position: relative;
  width: 200px;
  left: calc(50% - 100px);
  text-align: center;
}
</style>
