const TencentID = /dev/.test(process.env.NODE_ENV) ? '2034218683' : '2006574121';

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