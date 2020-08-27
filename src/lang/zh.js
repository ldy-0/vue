export default {
  route: {
    
    app:'APP介绍',
    banner:'轮播图',
		company: '企业介绍' ,
    news: '新闻资讯',
    contact: '联系我们',
    setting:'设置',

    information:'咨询列表',
    sellerUser:'用户列表',
    settingPay:'付款方式',
    settingGoodsType:'商品类型',
    comment:'评论列表',
    infoManagement:"运营",
    type:'分类信息',
    caseShow: '案例列表',
    memberList:'会员列表',
    manage:'提现管理',
    record:'提现记录',
    statistics:'分销统计',
    groupBuying: '团购管理',
    coupon: '优惠券',
    killPrice:'秒杀管理',
    groupBuyOrder:'团购订单',
    bargainOrder:'砍价订单',
    seckillOrder:'秒杀订单',

    goods: '商品列表',
    goodsExpect: '超值期待',
    commodityManagement:'商品管理',
    orderManagement:'订单管理',
    bargain:'砍价管理',
    order:'普通订单',
    rOrder:'实物订单',
    vOrder:'虚拟订单',
    appointment:'预约',

    server:'运营',
    serverBanner:'首页轮播图',
    serverEnrty:'商品分类',
    recommended:'精品推荐',
    serverAct:'动态',
    serverShop:'店铺介绍',
    serverAllbuy:'团购',
    serverKill:'砍价',
    newPeople: '新人专享',
    serverActivity:'活动',
    distribute:'用户列表',
    evaluation : '评价管理',
    authorityManagement:'权限管理',
    business: '招商申请',

    finance: '财务管理',
    deal: '交易明细',
    reward: '奖励明细',

    sellerStore: '商家入驻',
    storeList: '商家列表',
    storeCheck: '入驻审核',
    storeRecommend: '商家推荐',
    goodsAuth: '上架审核',
    goodsPreAuth: '预审核',

    withdraw: '提现列表',
    balanceWithdraw: '余额提现',
    dscoreWithdraw: '德分提现',
    sellerWithdraw: '商家提现',

    //平台
    home: '首页',
    notice: '公告',

    auth: '授权管理',
    icons: '图标',
    avatarUpload: '头像上传',
    backToTop: '返回顶部',
    dragDialog: '拖拽 Dialog',
    charts: '图表',
    keyboardChart: '键盘图表',
    lineChart: '折线图',
    form: '表单',
    createArticle: '创建文章',
    editArticle: '编辑文章',
    articleList: '文章列表',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    errorLog: '错误日志',
    theme: '换肤',
    i18n: '国际化'
  },
  navbar: {
    HSBopera: '修改密码',
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    screenfull: '全屏',
    theme: '换肤'
  },
  login: {
    title: '平台登录',
    title2: '商家登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  permission: {
    roles: '你的权限',
    switchRoles: '切换权限'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  }
}
