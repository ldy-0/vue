export default {

  data(){
    return {
      logisticList: [ 
        { id: 'SF', name: '顺丰速运' },
        { id: 'HTKY', name: '百世快递' },
        { id: 'ZTO', name: '中通快递' },
        { id: 'STO', name: '申通快递' },
        { id: 'YTO', name: '圆通快递' },
        { id: 'YD', name: '韵达速递' },
        { id: 'YZPY', name: '邮政快递包裹' },
        { id: 'EMS', name: 'EMS' },
        { id: 'HHTT', name: '天天快递' },
        { id: 'UC', name: '优速快递' },
        { id: 'DBL', name: '德邦快递' },
        { id: 'ZJS', name: '宅急送' },
      ],
    };
  },

  created(){
    this.postName.categories = this.logisticList;
  }

}