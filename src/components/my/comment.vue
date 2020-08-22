<template>
  <div class="comment_wrap">
    <div>
      <div class="flex align">
        <img class="i_avatar" :src="config.geval_frommemberavatar" alt="">

        <div class="user_name s_fc_11">{{config.geval_frommembername}}</div>

        <van-rate class="rate_wrap" v-model="config.geval_scores" :size="16" color="#4fb84a" void-icon="star" void-color="#eee" readonly /> 
      </div>

      <div class="comment_ctn s_fc_2">{{config.geval_content}}</div>
    </div>

    <div class="img_wrap flex" @click="preview">
      <img class="i_eval" :src="item" alt="" v-for="(item, index) in imgList" :key="index" />
    </div>
  </div>
</template>
<script>
import { ImagePreview } from 'vant';

export default {
  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {
      imgList: [],
    };
  },

  methods: {
    init() {
      this.format(this.config);
    },

    format(v) {
      try{
        this.imgList = JSON.parse(v.geval_image);
      }catch(e){
        this.imgList = [];
        console.error(e.message);
      }
    },

    preview() {
      ImagePreview({
        images: this.imgList,
      });
    },
  },

  created() {
    this.init();
  },

};
</script>
<style lang='less' scoped>
.comment_wrap {
  padding: 20px 0 30px;
  font-size: 28px;
  word-break: break-all;
}

.img_wrap{
  flex-wrap: wrap;
}

.user_name{
  max-width: 600px;
  margin: 0 0 0 20px;
  font-size: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rate_wrap{
  margin: 0 0 0 20px;
}
.comment_ctn{
  margin: 10px 0 0; 
}

.i_avatar{
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.i_eval{
  flex-shrink: 0;
  width: 176px;
  height: 176px;
  margin: 4px 30px 0 0;
  border-radius: 5px;
}

.align{
  align-items: center;
}

.s_fc_11{ color: #636363; }
</style>