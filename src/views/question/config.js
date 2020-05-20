import api from '@/api/api'

export default {
  created(){
    console.log('config.js --');
  },
  data() {
    return {
      headConfig: {
        width: '300px',
        showKeywordSearch: true,
        placeHolder: '手机号搜索',
      },
      tableConfig: {
        showOperate: true,
        showLook: true,
        lookTitle: '查看问卷',
        classList: [
          { key: '商品名称', value: 'storegc_name' },
          { key: '买家', value: 'storegc_sort' },
          { key: '商品价格(￥)', value: 'storegc_sort' },
        ],
      },
      dialogConfig: {
        isDisabled: true,
        // isCustom: true,
        // classList: [
        //   { key: '分类名称', value: 'storegc_name', isText: true, },
        //   { key: '排序', value: 'storegc_sort', isText: true, },
        // ],
        // rules: {
        //   'storegc_name': [
        //     { required: true, message: '请输入分类名称', trigger: 'blur' },
        //     { message: '不能超过15个字符!', max: 15, trigger: 'blur' }
        //   ],
        //   'storegc_sort': [ { required: true, message: '值不能为空!', trigger: 'blur' } ],
        // },
        // canSubmit: true,
      },
      formData: {
        storegc_name: '',
        storegc_sort: '',
      },
      searchKeyWord: ''
    }
  },
  methods: {
    searchByPhone(v) {
      this.searchKeyWord = v
      this.getList()
    },
    async getList() {
      this.isLoading = true

      console.log('param', this.listQuery)
      let res = await api.getClassList(this.listQuery, this)

      this.list = res.data && res.data || [];
      this.total = this.list.length; // res.pagination ? res.pagination.total : 0;
      this.isLoading = false
      console.log('classList res: ', res, this.list);
    },
    async submit(formName) {

      this.dialogConfig.canSubmit = true
      console.log('formData', this.formData)

      let o = this.formData,
          param = {
            storegc_name: o.storegc_name, 
            storegc_parent_id: o.storegc_parent_id,
            storegc_sort: o.storegc_sort,
          };

      let res = this.isAddItem ? await api.setClass(param, this) : await api.updateClass(this.detail.storegc_id, param, this);

      this.dialogConfig.canSubmit = true;
      this.isShow = false;

      this.showClass ? this.getTwoList() : this.getList();

    },
  }
}