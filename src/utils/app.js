// 跳转App

// 跳转App首页
export function goHome() {
  location.href = `${process.env.VUE_APP_GO_URL}?type=shop`;
}