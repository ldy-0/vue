function isWxBrowser(agent){ 
  if(!agent) agent = navigator.userAgent;

  return /MicroMessenger/i.test(agent); 
}

function isMobile(v){
  return /^[1-9]\d{10}$/.test(v);
}

function isAuth(){
  return localStorage.getItem('token');
}

export default {
  isWxBrowser,

  isMobile,

  isAuth,
}