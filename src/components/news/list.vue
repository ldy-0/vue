<template>
  <div class="news_module_wrap flex">
    <div class="main_news_wrap" @click="goDetail(firstNews)">
      <img class="main_img img" :src="firstNews.news_image" alt="">

      <div class="mt20 between">
        <div class="flex">
          <div class="main_number s_fc_f s_bg_10">1</div>
          <div class="main_title bold ellipsis ml10 s_fc_10">{{firstNews.news_title}}</div>
        </div>

        <div class="time">{{firstNews.time}}</div>
      </div>

      <div class="main_desc mt20" v-html="firstNews.news_content"></div>
    </div>

    <div class="news_list_wrap">
      <div class="news_title bold">新闻排行</div>

      <ul class="mt30">
        <li class="news_item_wrap flex" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
          <div class="number s_fc_f" :class="[index > 2 ? 's_bg_12' :  index > 0 ? 's_bg_11' : 's_bg_10']">{{index + 2}}</div>

          <img class="news_img img" :src="item.news_image" alt="">

          <div class="news_info ml20">
            <div class="between">
              <div class="title ellipsis bold">{{item.news_title}}</div>
              <div class="time">{{item.time}}</div>
            </div>

            <div class="desc mt20" v-html="item.news_content"></div>
          </div>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
export default {
  name: '',

  props: {
    config: Array, 
  },

  computed: {
    firstNews(){ return this.config && this.config[0] || {}; },
    list(){ return this.config.slice(1, 6); },
  },

  methods: {
    goDetail(item) {
      this.$router.push({ name: 'newsDetail', query: { id: item.news_id, }, });
    },
  },

  
}
</script>

<style scoped>
.news_module_wrap{
  font-size: 16px;
}
.news_list_wrap{
  align-self: flex-start;
  width: 33.8vw;
  padding: 0 0 0 3vw;
}
.news_title{
  font-size: 2em;
  line-height: 1.4;
  padding: 0 0 15px 0;
  border-bottom: 1px solid #EAEAEA;
}
.news_item_wrap{
  position: relative;
  margin: 8px 0 0; 
  cursor: pointer;
}
.news_info{
  width: 21.8vw;
}

.main_news_wrap{
 width: 38.4vw;
 cursor: pointer;
}
.main_img{
  display: block;
  height: 26.8vw;
}
.main_title{
  font-size: 1.875em;
  width: 26vw;
}
.main_number{
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 1px;
}
.main_desc{
  height: 6em;
  line-height: 1.5;
  overflow: hidden;
}

.number{
  position: absolute;
  top: 0;
  left: -30px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 1px;
}
.news_img{
  width: 10.6vw;
  height: 5.8vw;
}
.title{
  font-size: 1.5em;
}
.time{
  flex-shrink: 0;
}
.desc{
  position: relative;
  height: 3em;
  line-height: 1.5;
  overflow: hidden;
}

@media only screen and (max-width: 1500px){
  .news_module_wrap{
    font-size: 13px;
  } 

  .main_number{
    width: 22px;
    height: 22px;
    line-height: 22px;
  }
  .number{
    left: -24px;
    width: 16px;
    height: 16px;
    line-height: 16px;
  }
}

@media only screen and (max-width: 1200px){
  .main_title{
    width: 24vw;
  }
}

.s_fc_10{ color: #373C59; }

.s_bg_10{ background: #FE5C5C; }
.s_bg_11{ background: #FE8140; }
.s_bg_12{ background: #FD8181; }
</style>