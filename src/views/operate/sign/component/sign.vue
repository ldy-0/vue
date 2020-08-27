<style scoped>

</style>

<template>
  <el-form label-width='100px'>
    <custom-date :obj='date'></custom-date>
    <custom-time :obj='time'></custom-time>

    <custom-input :obj='number'></custom-input>

    <custom-img :obj='img'></custom-img>

    <!-- <el-form-item :label="content.title" label-width='180px'>
      <editor style='width: 800px;' :disabled='content.disabled' v-model='content.value'></editor>
      <el-alert type='error' :title='content.alert' v-if='content.alert'></el-alert>
    </el-form-item> -->

    <div v-if="obj">
      <el-form-item :label="info.title" label-width='180px' v-for="(info, infoIndex) in infoList" :key="infoIndex">{{obj[info.from]}}</el-form-item>
    </div>

    <el-form-item label-width='180px'>
      <el-button @click="close" >取消</el-button>
      <el-button type="primary" :disabled="submited" :loading="submited" @click="submit" v-if="!img.disabled">确 定</el-button>
    </el-form-item>
      
  </el-form>
</template>

<script>
import commonReq from '@/api/common' 
import api from '@/api/activity' 
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import customDate from '@/components/customDate'

export default {
  props: {
    obj: {
      type: Object,
    },
  },

  components: {
    customInput,
    customImg,
    customDate,
    customTime: customDate,
  },

  data(){
    return {
      form: {},

      date:   { type: 'daterange', title: '活动日期', value: '', from: 'date', alert: null, width: '180px', },
      time:   { type: 'timerange', title: '活动时间', value: '', from: 'time', alert: null, width: '180px', },
      number: { type: 'positive', title: '签到红包', value: '', from: 'amount', alert: null, width: '180px', disabled: false, },
      img:    { title: '签到背景', value: [], from: 'imgList', limit: 1, alert: null, width: '180px', disabled: false, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      // content: { title: '活动规则', value: '', alert: null, disabled: false, },
      validList: ['date', 'time', 'number'],

      infoList: [
        { title: '状态', from: 'statusStr', },
        { title: '参与人数', from: 'member_count', },
        { title: '发放红包', from: 'max_amount', },
      ],

      submited: false,
      pattern: /\s.*$/,
    }
  },

  methods: {
    close(){ this.$emit('cancel', this.form); },

    init(o){
      let date = this.date,
          time = this.time,
          number = this.number,
          img = this.img,
          list = [date, time, number, img];

      if(!o) return ;

      list.forEach(v => {
        v.value = o[v.from];
        v.alert = null;
        v.disabled = true;
      }); 

      // 未开始状态
      // if(o.status == 0) img.disabled = false;
    },

    validateError(){
      let validArr = this.validList;
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(this[key].alert) return true;

        if(!this[key].value){
          return this[key].alert = `${this[key].title}不能为空!`;
        }
      }

      if(!this.img.value.length) return this.img.alert = '请选择图片';
    },

    submit(){
      // this.mock();

      let date = this.date.value,
          time = this.time.value,
          imgList = this.img.value,
          param, timeArr;

      if(this.validateError()) return ;
      
      let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      date[1].setHours(23, 59, 59);
      param = {
        start_time: date[0],
        end_time: date[1],
        signin_start_time: time[0].toTimeString().replace(this.pattern, ''),
        signin_end_time: time[1].toTimeString().replace(this.pattern, ''),
        amount: this.number.value,
        // explain: this.content.value,
        banner: img[0],
      };

      this.$emit('submit', param); 
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(typeof res == 'string' || !res || res.error) return this.$message.error(`getUploadToken: ${res ? res.error || res : '获取七牛token失败'}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
    },

    mock(){
      let d = new Date();

      this.img.value = [{ url: 'https://cdn.health.healthplatform.xyz/Fj8MCYMw8rWnjcX04s3ZFO49LfSn' }];
      this.number.value = 2;
      this.date.value = [d, d];
      this.time.value = [d, new Date(d.getTime() + 60 * 1000)];
    }
  },

  created(){
    this.getUploadToken();

    this.init(this.obj);
  }

}
</script>