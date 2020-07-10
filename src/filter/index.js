
export function dateFormat(dataStr) {
    var time = new Date(Number(dataStr)*1000);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + timeAdd0(m) + '-' + timeAdd0(d);
}
function timeAdd0(str) {
    if (str < 10) {
        str = '0' + str;
    }
    return str
}