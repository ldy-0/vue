export default {

  data(){
    return {
      logisticList: [ 
        { id: 'SF',   name: '顺丰速运',     value: 0, },
        { id: 'HTKY', name: '百世快递',     value: 1, },
        { id: 'ZTO',  name: '中通快递',     value: 2, },
        { id: 'STO',  name: '申通快递',     value: 3, },
        { id: 'YTO',  name: '圆通快递',     value: 4, },
        { id: 'YD',   name: '韵达速递',     value: 5, },
        { id: 'YZPY', name: '邮政快递包裹', value: 6, },
        { id: 'EMS',  name: 'EMS',         value: 7, },
        { id: 'HHTT', name: '天天快递',     value: 8, },
        { id: 'UC',   name: '优速快递',     value: 9, },
        { id: 'DBL',  name: '德邦快递',     value: 10, },
        { id: 'ZJS',  name: '宅急送',       value: 11, },
      ],
    };
  },

  created(){
    this.company.list = this.logisticList;
  }

}