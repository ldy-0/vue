// tencent: <script src="https://ssl.captcha.qq.com/TCaptcha.js"></script>
const TencentID = '';

function getCaptcha(){
  return new Promise(resolve => {
    if(window.TencentCaptcha){
      let o = new TencentCaptcha(TencentID, cb);
      o.show();
    }

    function cb(res){
      if(res.ret === 2) return resolve(null);

      resolve(res);
    }
  });
}



export default {
  getCaptcha,
}