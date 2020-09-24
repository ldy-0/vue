<template>
  <div class="m_news_wrap s_fc_f">
    <div class="article_container bg" :style="{ backgroundImage: `url(${articleBg})` }">
      <img class="article_title_bg" src="../../assets/home/articleTitle.png" alt="">

      <div class="article_wrap">
        <div class="article_list_wrap flex s_fc_f">
          <div class="article_item flex" :class="{article_item_head: index % 3 == 0 }" v-for="(item, index) in articleList" :key="index" @click="goNews(item)">
            <div class="article_body">
              <div class="article_title ellipsis">{{item.news_title}}</div>

              <div class="article_time">{{item.time}}</div>

              <div class="article_desc" v-html="item.news_content"></div>
            </div>

            <img class="article_img" :src="item.news_image" alt="">
          </div>
        </div>

        <div class="article_more" @click="goNews()">
          <img class="img" src="../../assets/home/articleArrow.png" alt="">
        </div>
      </div> 
    </div>

    <!-- 视频 -->
    <div class="video_wrap flex">
      <div class="half">
        <video class="img" :src="firstVideo.url" controls></video>
      </div>
      
      <div class="half">
        <div class="video_list_title bold s_fc_12">视频栏目</div>

        <div class="video_list_wrap flex">
          <div class="video_item s_bg_f" :class="{ video_item_sel: index == firstIndex }" v-for="(item, index) in firstVideoList" :key="index" @click="changeVideo(index, 'firstIndex')">
            <img class="video_img" :src="item.news_image" alt="">

            <div class="video_time s_fc_11">
              <div>{{item.date}}</div>
              <div>{{item.time}}</div>
            </div>

            <div class="video_title ellipsis s_fc_10">{{item.news_title}}</div>

            <img class="i_arrow i_arrow_reverse" :src="index == firstIndex ? require('../../assets/home/arrow_sel.png') : require('../../assets/home/arrow.png')" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="video_wrap second_video_wrap flex">
      <div class="half">
        <video class="img" :src="secondVideo.url" controls></video>
      </div>
      
      <div class="half">
        <div class="video_list_title bold s_fc_12">视频栏目</div>

        <div class="video_list_wrap flex">
          <div class="video_item s_bg_f" :class="{ video_item_sel: index == secondIndex }" v-for="(item, index) in secondVideoList" :key="index" @click="changeVideo(index, 'secondIndex')">
            <img class="video_img" :src="item.news_image" alt="">

            <div class="video_time s_fc_11">
              <div>{{item.date}}</div>
              <div>{{item.time}}</div>
            </div>

            <div class="video_title ellipsis s_fc_10">{{item.news_title}}</div>

            <img class="i_arrow" :src="index == secondIndex ? require('../../assets/home/arrow_sel.png') : require('../../assets/home/arrow.png')" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import aboutApi from '@/api/about';
import moment from 'moment';
import f from '@/utils/format';

export default {
  name: 'news',

  props: {
    config: Object,
  },

  data(){
    return {
      articleBg: require('../../assets/home/articleBg.png'),
      img: '',
      imgList: [],

      articleList: [],

      videoList: [],
      firstIndex: 0,
      secondIndex: 0,
    };
  },

  computed: {
    firstVideoList(){ return this.videoList.slice(0, 3); },
    secondVideoList(){ return this.videoList.slice(3, 6); },
    firstVideo(){ return this.firstVideoList[this.firstIndex] ? this.firstVideoList[this.firstIndex].video : 0; },
    secondVideo(){ return this.secondVideoList[this.secondIndex] ? this.secondVideoList[this.secondIndex].video : 0; },
  },
  
  methods: {
    goNews(item) {
      if(item) return this.$router.push({ name: 'newsDetail', query: { id: item.news_id, }, });

      this.$router.push({ name: 'news', });
    },

    changeVideo(index, key) {
      this[key] = index;
    },

    format(o) {
      o.time = moment(o.add_time * 1000).format('yyyy/MM/DD HH:mm:ss');
      
      return o;
    },

    async getArticleList() {
      let res = await aboutApi.getNewsList({ news_type: 1, page: 1, limit: 6, });

      if(res && res.status == 0){
        res.data.forEach(f.formatArticle);
        // res.data = res.data.concat(res.data);
        // res.data = res.data.concat(res.data);
        return this.articleList = res.data;
      }

      alert(res ? res.error || res : '获取文章信息失败!');
    },

    async getVideoList() {
      let res = await aboutApi.getNewsList({ news_type: 2, page: 1, limit: 6, });

      if(res && res.status == 0){
        res.data.forEach(this.formatVideo);
        // res.data = res.data.concat(res.data, res.data);
        return this.videoList = res.data;
      }

      alert(res ? res.error || res : '获取视频信息失败!');
    },

    formatVideo(v) {
      try{
        v.video = (JSON.parse(v.news_content))[0];
      }catch(e){
        v.video = '';
      }

      v.date = moment(v.add_time * 1000).format('yyyy/MM/DD');
      v.time = moment(v.add_time * 1000).format('HH:mm:ss');
      return v;
    },

  },

  created() {
    this.getArticleList();
    this.getVideoList();
  },
}
</script>

<style scoped>
.m_news_wrap{
  font-size: 14px;
}

.article_container{
  position: relative;
  height: 1130px;
}
.article_title_bg{
  position: absolute;
  top: 2.8vw;
  left: 9.3vw;
  width: 82.3vw;
  height: 18.1vw;
}
.article_wrap{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
  max-width: 80vw;
  margin: 0 auto;
}
.article_list_wrap{
  flex-wrap: wrap;
}
.article_item{
  align-items: flex-start;
  height: 9.1vw;
  margin: 2.5vw 0 0 4.1vw;
  cursor: pointer;
}
.article_item_head{
  margin-left: 0;
}
.article_body{
  flex-shrink: 0;
  width: 13.3vw;
}
.article_title{
  margin: 0 0 0 10px;
  font-size: 2.14em;
  line-height: 1.4;
}
.article_time{
  margin: 0 0 0 10px;
  line-height: 1.4;
}
.article_desc{
  height: 5.6em;
  margin: 1.5vw 0 0;
  padding: 0 0 0 10px;
  border-left: 2px solid #fff;
  overflow: hidden;
}
.article_img{
  flex-shrink: 0;
  width: 9.1vw;
  height: 100%;
  margin: 0 0 0 1.5vw;
}
.article_more{
  float: right;
  width: 50px;
  height: 50px;
  margin: 2.9vw 0 0;
  cursor: pointer;
}

.video_wrap{
  margin: 1.8vw 3vw 0;
  text-align: center;
}
.second_video_wrap{
  margin-top: 0;
  flex-direction: row-reverse;
}
.half{
  width: 50%;
  height: 28.1vw;
}
.video_list_title{
  padding: 2vw 0 0;
  font-size: 1.78em;
  letter-spacing: 0.5em;
}
.video_list_wrap{
  padding: 2vw 3vw 0;
  box-sizing: border-box;
}
.video_item{
  margin: 0 0 0 1.8vw;
  padding: 1.8vw 1.5vw 1.5vw;
  border-radius: 10px;
  border: 1px solid #B1B1B1;
  cursor: pointer;
}
.video_img{
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
}
.video_title{
  margin: 1vw 0 0;
  width: 8.85vw;
  font-size: 1.1em;
}
.video_item_sel{
  border-color: #32B48E;
}

.i_arrow{
  display: block;
  width: 30px;
  height: 24px;
  margin: 1.5vw 0 0;
}
.i_arrow_reverse{
  transform: rotateZ(180deg);
}

@media only screen and (max-width: 1500px){
  .m_news_wrap{
    font-size: 12px;
  }

  
}

.s_fc_10{ color: #4E4E4E; }
.s_fc_11{ color: #9C9C9C; }
.s_fc_12{ color: #323855; }
</style>