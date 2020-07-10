<template>
  <div>
    <div class="info">
      <van-nav-bar left-arrow title="公司新闻" fixed @click-left="goBack"></van-nav-bar>

      <van-image width="100%" height="200px" fit="cover" :src="info.information_image" />
      <div class="info_content">
        <div class="info_title">{{info.information_title}}</div>
        <div class="info_time">{{info.addtime | dateFormat}}</div>
        <div class="info_time">{{info.information_desc}}</div>
        <video v-if="info.type==2" class="video" :src="info.information_content" autoplay controls>
          您的浏览器不支持视频格式
        </video>
        <audio v-if="info.type==3" autoplay @ended="endPlay" @timeupdate="updateTime" ref="audio" class="audio"
          :src="info.information_content">
          您的浏览器不支持音频格式
        </audio>
        <div class="audio_box" v-if="info.type==3">
          <div class="img_box">
            <img @click="pause" v-if="showAudio" src="../../assets/images/card/icon_9_zanting@2x.png" alt="">
            <img @click="play" v-else src="../../assets/images/card/icon_9_bofang@2x.png" alt="">
          </div>
          <div style="width:70%;padding:0 10px;">
            <div class="audio-time">
              {{currentTime}}/{{totalTime}}
            </div>
            <div class="audio-title">
              {{title}}
            </div>
          </div>
        </div>
        <div class="text" v-if="info.type==1" v-html="info.information_content">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Image } from 'vant';
import navBar from '@/components/navBar';

import request from '@/utils/request';
export default {
  components: {
    [Image.name]: Image,
    navBar: navBar
  },
  data() {
    return {
      id: null,
      info: {},
      showAudio: true,
      currentTime: '00:00',
      totalTime: '00:00',
      title: ''
    };
  },

  computed: {
    isBack() { return this.$route.meta.isBack; },
  },

  activated() {
    if(this.isBack) return ;

    this.id = this.$route.query.id;
    this.getList();
  },

  methods: {
    async getList() {
      let res = await request.get('/api/v2/member/information/' + this.id);
      if (res.status == 0) {
        if (res.data.type == 3 || res.data.type == 2) {
          this.title = JSON.parse(res.data.information_content)[0].name;
          res.data.information_content = JSON.parse(res.data.information_content)[0].url;
        } else {
          res.data.information_content = res.data.information_content.replace(/<img/g, "<img style='display: block; width: 100%;'");
          res.data.information_content = res.data.information_content.replace(/<p>&nbsp;<\/p>/g, " ");
          res.data.information_content = res.data.information_content.replace(/↵/g, " ");
        }
        this.info = res.data;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    pause() {
      this.showAudio = false;
      this.$refs.audio.pause();
    },
    play() {
      this.showAudio = true;;
      this.$refs.audio.play();
    },
    updateTime(e) {
      this.currentTime = this.secondFormat(e.target.currentTime);
      this.totalTime = this.secondFormat(e.target.duration);
    },
    secondFormat(second) {
      var timeTxt = "";
      var hh, mm, ss;
      hh = second / 3600 | 0;
      second = Math.round(second) - hh * 3600;
      mm = second / 60 | 0;
      ss = Math.round(second) - mm * 60;
      if (hh !== 0) {
        if (hh < 10) {
          timeTxt = "0" + hh + ":";
        }
        else {
          timeTxt = hh + ":";
        }
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      timeTxt = timeTxt + mm;
      if (ss < 10) {
        ss = "0" + ss;
      }
      timeTxt = timeTxt + ":" + ss;
      return timeTxt;
    },
    endPlay() {
      this.showAudio = false;
      this.$refs.audio.initialTime();
    }
  }
}
</script>
<style lang='less' scoped>
.info {
  background: #fff;
  padding: 128px 0 0;
  min-height: 100vh;
  overflow: hidden;
  word-break: break-all;
}
.info_content {
  padding: 25px 30px;
  line-height: 50px;
}
.info_img {
  width: 100%;
  height: 400px;
}
.info_title {
  color: #000;
  font-size: 34px;
}
.info_time {
  color: #666;
  font-size: 26px;
}
.video {
  width: 100%;
  height: 400px;
  display: block !important;
}
.text {
  font-size: 28px;
}
.audio_box {
  width: 80%;
  height: 140px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: row;
  .img_box {
    width: 140px;
    height: 140px;
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 70px;
      height: 70px;
    }
  }
}
.audio-time {
  font-size: 20px;
  color: #999;
  text-align: right;
}
.audio-title {
  width: 100%;
  font-size: 24px;
  color: #999;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
}
</style>