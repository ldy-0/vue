<template>
  <div class="platform_wrap">
    <banner class="banner_wrap" :config="bannerConfig"></banner>

    <div class="main_wrap">
      <!-- 新闻排行 -->
      <div class="mt80">
        <news-list class="s_fc_11" :config="topArticleList"></news-list>
      </div>

      <!-- 视频资讯 -->
      <div class="title_wrap mt80 s_fc_10">
        <div class="title bold">视频资讯</div>
      </div>

      <div class="list_wrap flex mt30">
        <div class="video_item_wrap s_bg_f" v-for="(item, index) in videoList" :key="index" @click="goDetail(item)">
          <video class="video_img" :src="item.video" controls @click.stop=""></video>

          <div class="between mt20">
            <div class="video_title ellipsis s_fc_10">{{item.news_title}}</div>
            <div class="video_time s_fc_11">{{item.time}}</div>
          </div>
        </div>
      </div>

      <!-- 新闻资讯 -->
      <div class="title_wrap mt80 s_fc_10">
        <div class="title bold">新闻资讯</div>
      </div>

      <div class="list_wrap between mt30">
        <div class="msg_item_wrap flex mt20 s_bg_f" v-for="(item, index) in articleList" :key="index" @click="goDetail(item)">
          <img class="msg_img img" :src="item.news_image" alt="">

          <div class="msg_info_wrap fs16 ml30 s_fc_11">
            <div class="msg_title ellipsis s_fc_10">{{item.news_title}}</div>
            <div class="msg_time mt10">{{item.time}}</div>
            <div class="msg_desc mt30" v-html="item.news_content"></div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import banner from '@/components/banner';
import newsList from '@/components/news/list';
import aboutApi from '@/api/about';
import bannerApi from '@/api/banner';
import f from '@/utils/format';

export default {
  name: 'news',

  components: {
    banner,
    newsList,
  },

  data() {
    return {
      bannerConfig: {
        config: {
          loop: true,
          autoplay: true,
        },
        from: 'banner_image',
        list: [],
      },

      detail: {},

      topArticleList: [],
      articleList: [],
      videoList: [],

      page: 1,
      limit: 6,

      doing: false,
    };
  },

  methods: {
    goDetail(item) {
      if(this.doing) return ;
      this.doing = true;

      this.$router.push({ name: 'newsDetail', query: { id: item.news_id, }, });
    },

    async getBannerList() {
      let res = await bannerApi.getList({ banner_programa: 4, });

      if(res && res.status == 0){
        return this.bannerConfig.list = res.data;
      }

      alert(res ? res.error || res : '获取轮播图信息失败!');
    },

    async getArticleList() {
      let res = await aboutApi.getNewsList({ news_type: 1, page: this.page, limit: this.limit, });

      if(res && res.status == 0){
        res.data.forEach(f.formatArticle);
        // 顶部新闻列表
        if(this.page == 1){
          this.topArticleList = res.data;
          return this.getArticleList(this.page++);
        }

        // res.data = this.topArticleList;
        return this.articleList = this.articleList.concat(res.data);
      }

      alert(res ? res.error || res : '获取文章信息失败!');
    },

    async getVideoList() {
      let res = await aboutApi.getNewsList({ news_type: 2, });

      if(res && res.status == 0){
        res.data.forEach(f.formatVideoNews);
        return this.videoList = res.data;
      }

      alert(res ? res.error || res : '获取视频信息失败!');
    },

  },

  created() {
    this.doing = false;
    scrollTo(0, 0);

    this.getBannerList();
    this.getArticleList();
    this.getVideoList();
  }
}
</script>
<style scoped>
.platform_wrap{
  font-size: 24px;
}

.banner_wrap{
  height: 550px;
}

.main_wrap{
  max-width: 76vw;
  margin: 0 auto;
}

.title_wrap{
  position: relative;
  padding: 30px 0 0;
  font-size: 32px;
  line-height: 1.4;
}
.title{
  padding: 0 30px;
}
.title::after{
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 100%;
  background: #32B48F;
  border-radius: 1px;
  z-index: -1;
}

.desc{
  text-indent: 2em;
  text-align: left;
}

.list_wrap{
  flex-wrap: wrap;
}

.video_item_wrap{
  flex-shrink: 0;
  width: 24.4vw;
  margin: 1vw 0.8vw 0 0;
  font-size: 14px;
  box-sizing: border-box;
  cursor: pointer;
}
.video_img{
  width: 100%;
  height: 13.3vw;  
}
.video_title{
  font-size: 1.57em;
  line-height: 1.36;
}
.video_time{
  flex-shrink: 0;
  align-self: flex-end;
  text-align: right;
}

.msg_item_wrap{
  flex-shrink: 0;
  align-items: flex-start;
  cursor: pointer;
}
.msg_img{
  width: 15.4vw;
  height: 13vw;
}
.msg_info_wrap{
  width: 17.1vw;
  font-size: 16px;
}
.msg_title{
  font-size: 1.875em;
}
.msg_desc{
  height: 7.5em;
  line-height: 1.5;
  overflow: hidden;
}

@media screen and (max-width: 1500px){
  .title_wrap{
    font-size: 25px;
  }

  .video_item_wrap{
    font-size: 12px;
  }

  .msg_info_wrap{
    font-size: 13px;
  }
}

.s_fc_10{ color: #373C59; }
.s_fc_11{ color: #48495E; }
</style>