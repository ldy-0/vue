import moment from 'moment';

// 文章新闻
function formatArticle(v) {
  v.time = moment(v.add_time * 1000).format('yyyy/MM/DD HH:mm:ss');

  v.desc = v.news_content.replace(/(<.*?>)|(\s*)/g, '');

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
  // v.video = 'http://pgc.qcdn.xiaodutv.com/1396369388_724315367_2020091011080820200910115946.mp4';

  v.time = moment(v.add_time * 1000).format('yyyy/MM/DD HH:mm:ss');

  return v;
}

// 公司介绍
function formatCompany(v) {
  try{
    v.imgList = JSON.parse(v.company_image);
  }catch(e){
    v.imgList = [];
  }

  v.desc = v.company_brief.replace('<img', '<img style="width: 100%;"');

  return v;
}


export default {
  formatArticle,
  formatVideoNews,

  formatCompany,
}
