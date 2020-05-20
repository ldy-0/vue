import customTable from '@/components/customTable'
import customHead from '@/components/customHead'
import customDialog from '@/components/customDialog'
import api from '@/api/api'

export default {
  components: {
    customTable,
    customHead,
    customDialog
  },

  data() {
    return {
      isShow: false, // Dialog visible
      isAddItem: true,
      isLoading: false, // Table Loading
      list: [], // Table Data
      detail: null,
      listQuery: { // table Data param
        page: 1,
        limit: 10
      },
      total: 0
    }
  },

  methods: {
    searchByPhone(v) {
      this.searchKeyWord = v
      this.getList()
    },
    changeState(state) {
      console.warn('state: ', state)
    },
    showForm(item) { //
      if (item) {
        this.detail = item
        this.isAddItem = false
      } else {
        this.isAddItem = true
      }

      this.initForm(item)
      this.isShow = true
    },
    cancel() { this.isShow = false },
    change(v) {
      this.listQuery.page = v.page
      this.listQuery.limit = v.limit
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
    }
  },

  created() {
    this.getList()
  }
}