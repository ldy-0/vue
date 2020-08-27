// import customHead from '@/components/customHead'
import customTable from '@/components/customTable'
import customForm from '@/components/customForm'

export default {
  components: {
    // customHead,
    customTable,
    customForm
  },

  data(){
    return {
      isShowForm: true,
      list: [],
      param: {
        page: 1,
        limit: 10,
      },
      total: 0,
      isLoading: false,
      name: 'base'
    }
  },

  methods: {
    showForm(item) {
      this.isShowForm = true; 
      this.isAdd = !item;

      this.dialogConfig.classList = item ? this.dialogConfig.updateList : this.dialogConfig.addList;
      this.initForm(item);
    },
    cancel(){ this.isShowForm = false; },
    change(v){
      this.param.page = v.page;
      this.param.limit = v.limit;
      this.getList();
    },
  },

  // created(){ this.getList(); }
}