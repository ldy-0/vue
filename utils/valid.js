function isWxBrowser(agent){ 
  return /MicroMessenger/i.test(agent); 
}

function isMobile(v){
  return /^[1-9]\d{10}$/.test(v);
}

export default {
  isWxBrowser,

  isMobile,
}