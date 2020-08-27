
function formatDate(timestamp){ 
  let t = new Date(timestamp);

  return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`; 
}

function formatTime(timestamp){
  let t = new Date(timestamp),
      month = t.getMonth() + 1,
      date = t.getDate(),
      hour = t.getHour(),
      minute = t.getMinute(),
      second = t.getSecond();

  let str = t.getFullYear();

  str += `/${month < 10 ? '0' : ''}${month}`;
  str += `/${date < 10 ? '0' : ''}${date}`;
  str += `/${hour < 10 ? '0' : ''}${hour}`;
  str += `/${minute < 10 ? '0' : ''}${minute}`;
  str += `/${second < 10 ? '0' : ''}${second}`;

  return str;
}

export default {
  formatDate,
  formatTime,  
}