# 
vue + element

### components
- customInput

  + property

    | props | type | desc |
    |-------|------|------|
    | obj   |Object|  |

    - obj  
      > 如果声明custom，type属性会被忽略

      custom: `{ pattern: RegExp, alert: null }`  
      type: positive|integer|number|string 
      preValue: `输入框前缀`  
      value: `输入框值`  
      postValue: `输入框后缀`  
      title: `标题`
      width: `标题宽度`

***

- customDate

  + property

    |  props  | type | desc |  
    |---------|------|------|  
    |   obj   |Object|  |

    - obj 
      type: `[date|datetime|datetimerange]`  
      title: `标题`
      isNow: `禁用今天之前时间`
      preventValidate: `取消检验`

***

- customImg

  + property

    |  props  | type | desc |  
    |---------|------|------|  
    |   obj   |Object|  |

    - obj 
      limit: `图片可允许最大数量`
      value: `图片地址数组`
      preventValidate: `取消检验`
      url: `自动上传地址`
      body: `请求体内容`
      title: `标题`
      width: `标题宽度`

***

- customHead

  + property

    |  props  | type | desc |  
    |---------|------|------|  
    |  config |Object|  |

    - config  
      title: `编辑标题, 显示声明编辑按钮显示`  
      showExport: `显示声明导出按钮显示`  
      btnList: `[ { titleKey: xx, title: xx } ], 显示声明按钮显示`  
      placeHolder: `文本输入占位符,显示声明input组件显示`  
      dateWidth: `日期组件宽度，显示声明日期组件显示`  
      selectList: `[ [ {id: xx, title: xx} ] ], 显示声明select组件显示`  
      selectLabelList: `[ xx ], selectList对应索引项的标题`  
      selectWidth: `select组件宽度`

  + Methods
    
    |  props  |   type   | desc |  
    |---------|----------|------|  
    |   add   | Function | 编辑按钮回调 |
    |   emit  | Function | btnList回调 |
    |  export | Function | 导出按钮回调 |
    |  search | Function | input, date, select组件回调 |

***

- customTable

  + property

    |  props  | type | desc |  
    |---------|------|------|  
    |  config |Object|  |
    |  data   |Array|  |
    |  total  |Number|  |
    |  flag   |String|  |

    - config  
      loading: `加载状态`  
      classList: `[ { key: xx, value: xx(identifiers), isImg|isAvatar|isRadio|isRate|isMulti| } ], 内容列表`  
      showOperate: `是否显示按钮`  
      btnList: `[ [ { key: xx(identifiers), value: xx, type: 'primary'|'danger'|'warning' } ] ], 按钮列表`  
      showPagination: `是否显示分页`
      flag: `标记table`

    - total
      `列表数据总数`

  + Methods
    
    |  props  |   param | desc |  
    |---------|----------|------|  
    |  modify | (item, index, flag) | btnList按钮回调 |
    |  change | (query, flag) | 换页，换limit回调 |

***

### utils
- COS upload

###  template
一些常用页面的模板
- list
> 展示列表页
