<template>
 <!-- <el-dialog :visible.sync='isShowDialog'> -->
 <el-dialog :visible='visible' :before-close='cancel' :width='config.width'>

    <el-form :label-width="config.labelWidth" :disabled='config.isDisabled' :model='detail' ref='ruleForm' :rules='config.rules'>

      <el-form-item :label="item.key"  v-for='(item, index) in config.classList' :key='index' v-if='!item.isHide' :prop='item.value'>

        <!-- input -->
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isText'></el-input>
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isNumber' @input='input(item)'></el-input>
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isInteger' @input='input(item)'></el-input>
        <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isPhone' @input='input(item)'></el-input>

        <!-- textarea -->
        <el-input type='textarea' v-model="detail[item.value]" auto-complete="off" :disabled='true' v-if='item.isTexts'></el-input>

        <div v-if='item.isCreateQrcode'>
          <el-button type='primary' size='mini' @click='getQrcode'>生成二维码</el-button>

          <img class='detail_img' :src='detail[item.value]' />

          <el-button type='primary' size='mini'><a :href='detail[item.value]'>下载</a></el-button>
        </div>

        <!-- img -->
        <el-upload action=''
            list-type="picture-card"
            :auto-upload="false"
            :limit='3'
            :file-list='detail[item.value]' 
            :on-remove='removeImg'
            :on-change="changeImgs"
            v-if='item.isImg'>

            <i class="el-icon-plus"></i>

        </el-upload>

        <!-- imgs -->
        <img class='detail_imgs' :src='v' v-for='(v, i) in detail[item.value]' :key='i' v-if='item.isImgs' />

        <!-- radio -->
        <el-radio-group v-model='detail[item.value]' v-if='item.isRadio'>
          <el-radio label=1>是</el-radio>
          <el-radio label=0>否</el-radio>
        </el-radio-group>

        <!-- select -->
        <el-select v-model="detail[item.value]" :placeholder="item.placeholder" v-if='item.isSelect'>
          <el-option v-for="option in item.list" :key="option[item.id]" :label="option[item.name]" :value="option[item.id]"></el-option>
        </el-select>

        <el-select v-model="detail[item.value]" multiple :placeholder="item.placeholder" v-if='item.isMultiSelect'>
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

        <div v-if='item.isDetail'>
          <el-button @click="addDetail(item.value)" v-text='item.key'></el-button>
          <slot></slot>
        </div>

        <!-- slot -->
        <!-- <div v-if='item.isCustom'>
          <slot :name='detail[item.value]' :k='item.value'></slot> 
        </div> -->

      </el-form-item>
      
    </el-form>

    <span slot="footer" class="dialog-footer" v-if='!config.isDisabled'>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :disabled="!config.canSubmit" :loading="!config.canSubmit" @click="submitForm('ruleForm')">确 定</el-button>
    </span>

  </el-dialog> 
</template>

<script>
export default {
  name: 'dialog',

  props: {
    config: {
      type: Object,
      default: function () {
        return {
          width: '60%',
          labelWidth: '50px',
        }
      }
    },
    detail: {
      type: Object,
    },
    visible: {
      type: Boolean,
    }, 
  },

  data() {
    return {
      imgs: [],
      date: '',  
      timeKey: '', // 时间段字段名 
      error: null, // 暂存错误
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
    cancel(){
      console.log('cancel dialog --');
      this.$emit('cancel');
    },
    async submitForm(form){
      let res = await this.$refs['ruleForm'].validate().catch(e => e);
      if(!res) return ;

      if(!this.canSubmit)return ;

      if(this.detail[this.timeKey] && !this.detail[this.timeKey].length)return this.$message({ message: '请添加日期' });

      if(this.error)return this.$message(this.error);

      console.log('submit dialog --', this.detail);
      this.$emit('submit', this.imgs);
    },

    getQrcode(){
      // this.detail.qrcode = [ { url: 'http://admin-1256953590.cos.ap-shanghai.myqcloud.com/1539331723928tab_fenxiangzhuan%402x.png'}];  
      // this.detail.qrcode = 'http://admin-1256953590.cos.ap-shanghai.myqcloud.com/1539331723928tab_fenxiangzhuan%402x.png';  
      // console.log('param --', this.detail, this.appUrl)
      this.$emit('getQrcode')
    },

    changeImgs(e, list){
      console.log('change img--', list)
      this.imgs = list;
    },
    removeImg(file, list){
      console.log('remove', list)
      this.imgs = list;
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
    input(item){
      let v = this.detail[item.value],
          phonePattern = /^((13[0-9])|(14[5|7|9])|(15([0-3]|[5-9]))|(17[0,1,3,5,6,7,8])|(18[0-9]))\d{8}$/;

      console.log('input --', item, v)
      if(isNaN(Number(v)))return ;

      if(item.isInteger && v % 1 !== 0)return this.$message({ message: '值必须为整数' });

      if(item.isPhone && !phonePattern.test(v)) return this.$message(this.error = { message: '手机号不合法!' });

      this.error = null; // clear error
      this.detail[item.value] = item.isPhone ? v : Number(v);

    } 
  }
}
</script>

<style scoped>
  
</style>
