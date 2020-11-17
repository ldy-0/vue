<template>
  <div class="news_wrap s_fc_11">
    <div class="main_wrap">

      <div class="title_wrap">
        <div class="title bold s_fc_10">{{detail.news_title}}</div>
        <div class="">{{detail.time}}</div>
      </div>

      <div class="mt20">
        <div class="desc" v-html="content" v-if="isArticle"></div>

        <div v-else>
          <video class="video_img" :src="detail.video" controls @click.stop=""></video>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import aboutApi from '@/api/about';
import f from '@/utils/format';

export default {
  name: 'newsDetail',

  components: {
  },

  data() {
    return {
      id: null,
      detail: {},
    };
  },

  computed: {
    isArticle(){ return this.detail.news_type == 1; },
    content(){ return this.detail.news_content && this.detail.news_content.replace(/<img/g, '$& style="display: block; width: 100%;"'); }
  },

  methods: {
    async getInfo() {
      let res = await aboutApi.getNewsList({ news_id: this.id });

      if(res && res.status == 0){
        res.data.forEach(f.formatVideoNews);
        return this.detail = res.data[0];
      }

      alert(res ? res.error || res : '获取详情信息失败!');
    },
  },

  created() {
    let route = this.$route,
        query = route.query;

    scrollTo(0, 0);

    this.id = query.id;
    if(!this.id) return alert('news_id不存在!');

    this.getInfo();
  }
}
</script>
<style scoped>
.news_wrap{
  min-height: 700px;
  font-size: 16px;
}

.main_wrap{
  max-width: calc(1920px - 720px);
  margin: 40px auto 0;
}

.title_wrap{
  position: relative;
  line-height: 1.4;
  text-align: center;
}
.title{
  font-size: 1.875em;
}

.desc{
  text-indent: 2em;
  text-align: left;
}
.video_img{
  width: 100%;
}

@media only screen and (max-width: 1500px){
  .news_wrap{
    font-size: 13px;
  }
}

.s_fc_10{ color: #373C59; }
.s_fc_11{ color: #48495E; }
</style>