
function download(blob, filename){
  if (window.navigator.msSaveOrOpenBlob) {
    return window.navigator.msSaveBlob(blob, filename);
  }

  let url = window.URL.createObjectURL(blob),
      a = document.createElement('a');

  a.href = url;
  a.setAttribute('download', filename);
  a.click();

  window.URL.revokeObjectURL(url);
}

export default {
  download,
}