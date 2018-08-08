<template>
  <ul class='pagination'>
        <li class='top' @click="minusPage()">&lt;</li>
        <li class='item' v-if='paginationList[paginationIndex - 1]' @click="switchPage('-')">...</li>
        <li class='item' :class="item === params.page ? 'checked' : ''" v-for='item in paginationList[paginationIndex]' @click='changePage(item)'>{{item}}</li>
        <li class='item' v-if='paginationList[paginationIndex + 1]' @click="switchPage('+')">...</li>
        <li class='end' @click="addPage()">&gt;</li>
  </ul>
</template>

<script>

export default {
  components:{
  },
  data(){
      return {
        newsList: [],
        total: 0,
        params: {
            page: 1,
            limit: 1,
            // consult_classid: 26,
        },
        paginationList: [],
        PaginationSize: 4,
        paginationIndex: 0,
      };
  },
  created(){

    this.getNewsList(this.params, () => {
        this.paginationList[0] = [];

        for(let i = 0, len = this.total; i * this.params.limit < len; i++){

            if(this.paginationList[this.paginationList.length - 1].length > 3){
                this.paginationList.push([]);
            }

            this.paginationList[this.paginationList.length - 1].push(i + 1); // i + 1;
        }
        
    });

  },
  methods: {
    getNewsList(params, callback){
        let query = '';

        for(let key in params){
            query += (query === '' ? '?' : '&') + key + '=' + params[key];
        }

        this.http.get("http://web.healthsource.com.cn/api/v1/home/news" + query).then(res => {

            if(res.data && res.data.status === 0){
                this.newsList = res.data.data;
                this.total = res.data.pagination.total;
            }else{
                this.newsList = [];
            }
            callback();
        });
    },
    changePage(page){
        this.params.page = page;

        this.getNewsList(this.params);
    },
    addPage(){
        let arr = this.paginationList[this.paginationIndex];
        if(!this.paginationList[this.paginationIndex + 1] && this.params.page === arr[arr.length - 1]){
            return alert('end');
        }

        this.params.page < arr[arr.length - 1] ? this.params.page++ : this.params.page = this.paginationList[++this.paginationIndex][0];
        // this.params.page < this.paginationList.length ? this.params.page++ : void(0);
        this.getNewsList(this.params);
    },
    minusPage(){
        if(this.params.page === 1){
            return alert('first');
        }

        this.params.page > this.paginationList[this.paginationIndex][0] ? this.params.page-- : this.params.page = this.paginationList[--this.paginationIndex][0];
        // this.params.page > 1 ? this.params.page-- : void(0);
        this.getNewsList(this.params);
    },
    switchPage(operate){
        operate === '-' ? this.paginationIndex-- : this.paginationIndex++;
        this.params.page = this.paginationList[this.paginationIndex][0];
        this.getNewsList(this.params);
    }
  }
}
</script>
<style lang="stylus">
.pagination{
    margin-bottom: 35px;
    .top, .item, .end, .total{
        display: inline-block;
        width: 40px;
        height: 30px;
        line-height: 30px;
        margin: 0 10px;
        border: 1px solid #ddd;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
    }
    .item{
        color: #666;
        background: #fff;
    }
    .checked{
        border: none;
        color: #fff;
        background: #1291ea;
    }
    .total{
        width: 70px;
    }
}
</style>
