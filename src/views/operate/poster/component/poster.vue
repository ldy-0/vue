<style scoped>

</style>

<template>
  <el-form label-width='100px'>
    <!-- <custom-date :obj='date'></custom-date> -->
    <!-- <custom-time :obj='time'></custom-time> -->

    <custom-select :obj="classify"></custom-select>

    <custom-img :obj='img'></custom-img>

    <custom-img :obj='sketch'></custom-img>

    <custom-input :obj='name'></custom-input>

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
import customSelect from '@/components/customSelect';

export default {
  props: {
    obj: {
      type: Object,
    },
    classList: {
      type: Array,
    },
  },

  components: {
    customInput,
    customImg,
    customSelect,
    customDate,
    customTime: customDate,
  },

  data(){
    return {
      form: {},

      // date:   { type: 'daterange', title: '活动日期', value: '', from: 'date', alert: null, width: '180px', },
      // time:   { type: 'timerange', title: '活动时间', value: '', from: 'time', alert: null, width: '180px', },
      name: { type: 'string', title: '图片名称', value: '', from: 'name', alert: null, disabled: false, },
      img: { title: '活动图片', value: [], from: 'imgList', limit: 1, alert: null, disabled: false, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      sketch: { title: '示意图', value: [], from: 'sketchList', limit: 1, alert: null, disabled: false, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      classify: { title: '选择类别', value: '', from: 'class_id', list: [], alert: null, },

      submited: false,
    }
  },

  methods: {
    close(){ this.$emit('cancel', this.form); },

    init(o){
      let img = this.img,
          list = [this.classify, this.name, this.img, this.sketch];

      this.classify.list = this.classList;

      if(!o) return ;

      list.forEach(v => {
        v.value = o[v.from];
        v.alert = null;
        // v.disabled = true;
      }); 

      // 未开始状态
      // if(o.status == 0) img.disabled = false;
    },

    validateError(){
      let list = [this.name, this.classify],
          img = this.img,
          sketch = this.sketch;
      
      for(let i = list.length - 1; i >= 0; i--){
        let item = list[i];

        if(item.alert) return true;

        if(!item.value) return item.alert = `${item.title}不能为空!`;
      }

      if(!img.value.length) return img.alert = '请选择活动图片';
      if(!sketch.value.length) return sketch.alert = '请选择示意图';
    },

    submit(){ 
      let classify = this.classify.value,
          name = this.name.value,
          imgList = this.img.value,
          sketchList = this.sketch.value,
          param, timeArr;
      // this.mock();

      if(this.validateError()) return ;
      
      let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      let sketch = sketchList.map(v => { return v.raw ? `${this.sketch.cdnUrl}/${v.response.key}` : v.url });

      param = {
        class_id: classify,
        name,
        bg_image: img[0],
        image: sketch[0],
      };

      this.$emit('submit', param); 
    },

    async getUploadToken(){
      let sketch = this.sketch.body,
          img = this.img.body,
          res = await commonReq.getUploadToken();

      if(typeof res == 'string' || !res || res.error) return this.$message.error(`getUploadToken: ${res ? res.error || res : '获取七牛token失败'}`);

      sketch.token = img.token = res.data;
      sketch.config = img.config = "{ useCdnDomain: true }";
    },

    mock(){
      this.sketch.value = this.img.value = [{ url: 'https://cdn.health.healthplatform.xyz/Fj8MCYMw8rWnjcX04s3ZFO49LfSn' }];
    }
  },

  created(){
    this.getUploadToken();

    this.init(this.obj);
  }

}
</script>