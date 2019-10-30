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

      custom: `{ pattern: RegExp, alert: null }自定义验证规则`  
      type: positive|integer|number|string|normal|text  
      pre(preValue): `输入框前缀`  
      value: `输入框值`  
      post(postValue): `输入框后缀`  
      title: `标题`  
      width(labelWidth): `标题宽度`  
      disabled: `是否禁止输入`

***

- customDate

  + property

    |  props  | type | desc |  
    |---------|------|------|  
    |   obj   |Object|  |

    - obj  
      > type为time|timerange时, 为时间选择

      type: `[date|datetime|datetimerange|time|timerange]`  
      isNow: `禁用今天之前时间`  
      title: `标题`  
      width: `标题宽度`  
      preventValidate: `取消检验`  
      disabled: `是否禁止输入`

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
      disabled: `是否禁止输入`

***

- customHead

  + property

    |  props  | type | desc |  
    |---------|------|------|  
    |  config |Object|  |

    - config  
      title: `编辑标题, 编辑按钮显示`  
      showExport: `导出按钮显示`  
      btnList: `每项为按钮配置[ { titleKey: xx, title: xx, } ](仅多btn)`  
      placeHolder: `文本输入占位符(仅单input)`  
      inputList: `每项为输入框配置[ { title(name|label): '', placeholder: '', width: '100px' } ](仅多input)`  
      dateWidth: `日期组件宽度(仅单date)`  
      dateLabelWidth: `日期组件标签宽度(仅dateList)`  
      dateList: `[ { title(name|label): String, width: '100px'(日期组件宽度), } ](仅dateList)`  
      selectList: Array `select组件数据配置`  
      selectWidth: 'xxpx' `select组件宽度`  
      selectTitle: String `标题(仅单select)`  
      status: String|Number `指定状态值(仅单select)`  
      statusList: Array `每项为每个select的状态值(仅多select)`  
      switchList: `[ { title: '', value: '', color: '#13ce66', inactiveColor: '#c0ccda', disabled: false } ]`
  
    - btnList项  
      title: `显示文字`  
      titleKey: `item[titleKey]为显示文字`   
      type: `类型，import为导入按钮`  
      url: `上传路径(仅type=import有效)`  
      header: `上传请求头信息(仅type=import有效)`  
      body: `上传请求体信息(仅type=import有效)`  
      limit: `上传数量限制(仅type=import有效)`  

    - selectList项  
      title(name|label): xx `单select表示select中每项的标题，多select表示每个select的标题`  
      value(id): Number|String `单select表示select中每项的值`  
      list: [] `有表示多select, 没有表示单select`  
      width: 'xxpx' `多select表示每个select的宽度(覆盖config.selectWidth)`

  + Methods
    
    |  props  |   type   | desc |  
    |---------|----------|------|  
    |   add   | Function | 编辑按钮回调 |
    |  export | Function | 导出按钮回调 |
    |  click  | Function | btnList回调 |
    |  search | Function | input, date, select组件回调 |
    |  beforeUpload | Function | 导入按钮上传前回调 |
    |  uploadSuccess | Function | 导入按钮上传成功回调 |
    |  uploadError | Function | 导入按钮上传失败回调 |

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
      btnList: `[ [ { key: xx(identifiers), value(title|name|label): xx, type: 'primary'|'danger'|'warning' } ] ], 按钮列表`  
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

- customSelect/customRadio

  + property

    | props | type | desc |
    |-------|------|------|
    | obj   |Object|  |

    - obj  

      type: 'multi' `多选`
      value: `值`  
      list: [ { title: '项名', value: '项值' } ]
      titleKey: `项名对应属性`
      valueKey: `项值对应属性`
      title(name|label): `标题`  
      width(labelWidth): `标题宽度` 
      placeholder: `占位内容` 
      disabled: `是否禁止输入`
    
  + methods

    |  props  |   param | desc |  
    |---------|----------|------|  
    |  change | (item, flag) | value值修改回调 |
    |  show   | null     |  显示下拉框回调(仅customSelect)   |
    |  hide   | null     |  隐藏下拉框回调(仅customSelect)   |

***

- copyRight
> 版权组件

  + property

    | props | type | desc |
    |-------|------|------|
    | obj   |Object|  |

    - obj
      
      year: '年份'
      company: '公司名称'
      province: '省简称'
      record: '备案号'

***


### utils
- COS upload

###  template
一些常用页面的模板
- list
> 展示列表页
