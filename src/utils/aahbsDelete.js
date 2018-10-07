function getFiles(arr){
  let arr2 = []
  arr.forEach(item=>{
    if(item.url){
      continue
    }else{
      arr2.push(item.raw)
    }
  })
  return arr2
}