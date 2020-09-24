import moment from 'moment';

// 文章新闻
function formatArticle(v) {
  v.time = moment(v.add_time * 1000).format('yyyy/MM/DD HH:mm:ss');

  return v;
}

// 视频新闻
function formatVideoNews(v) {
  try{
    let videoList = JSON.parse(v.news_content);
    v.video = videoList[0].url;
  }catch(e){
    v.video = '';
  }

  v.time = moment(v.add_time * 1000).format('yyyy/MM/DD HH:mm:ss');

  return v;
}

// 产品类目
function formatClass(v) {
  try{
    v.imgList = (JSON.parse(v.classify_image)).map(v => v.url);
  }catch(e){
    v.imgList = [];
  }

  return v;
}

export default {
  formatArticle,
  formatVideoNews,

  formatClass,
}