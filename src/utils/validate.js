let empty = /^\s*$/,
    mobile = /^[1-9]\d{10}$/,
    positiveInteger = /^\+??[1-9]\d*$/;

function isEmpty(v) {
  return  empty.test(v);
}

function isMobile(v) {
  return mobile.test(v);
}

function isPositiveInteger(v) {
  return positiveInteger.test(v);
}

export default {
  isEmpty,

  isMobile,

  isPositiveInteger,
}