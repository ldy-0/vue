export function getTime(timeStamp){
  let t = new Date(timeStamp * 1000); 

  return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
}