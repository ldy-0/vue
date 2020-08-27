export default {
  
  methods: {
    deleteArea(index, item){
      let area = this.area[index],
          provinceArr = this.provinceArr,
          selfProvinceIdArr = area.province.value,
          selfProvinceArr = selfProvinceIdArr.map(id => provinceArr.find(v => v.id == id));

      selfProvinceArr.forEach(v => this.freeCity(index, v, area.city.value));

      this.area.splice(index, 1);
    },

    initProvinceList(index){
      let area = this.area,
          provinceArr = this.provinceArr,
          selfProvinceIdArr = area.province.value,
          selfProvinceArr = selfProvinceIdArr.map(id => provinceArr.find(v => v.id == id)),
          unCheckProvinceArr = this.unCheckProvinceArr.filter(v => selfProvinceIdArr.indexOf(v.id) == -1);

      area.province.list = selfProvinceArr.concat(unCheckProvinceArr);
    },

    updateProvince(selfProvinceIdArr){
      let area = this.area,
          selfCityIdArr = area.city.value,
          provinceArr = this.provinceArr;

      // last modifiy province / 最后修改省份
      let province = provinceArr.find(v => v.id == this.filter(area.provinceCache, selfProvinceIdArr)[0]);

      area.provinceCache = selfProvinceIdArr;

      // resume province city
      if(selfProvinceIdArr.indexOf(province.id) == -1){
        this.freeCity(province, selfCityIdArr); 
      }

      this.initCityList(area);
    },

    freeCity(province, selfCityIdArr){
      province.list.forEach(v => {
        let index = selfCityIdArr.indexOf(v.id);

        if(index != -1){
          selfCityIdArr.splice(index, 1);

          v.checked = false;

          // this.updateArea(areaIndex, v.parent);
        }

      });
    },

    initCityList(area){
      let selfProvinceArr = area.province.value,
          selfCityArr = area.city.value,
          provinceArr = this.provinceArr;

      area.city.list = selfProvinceArr.reduce((list, id) => list.concat(provinceArr.find(v => v.id == id).list.filter(v => selfCityArr.indexOf(v.id) !== -1 || !v.checked)), []);
    },

    updateCity(selfCity){
      let area = this.area,
          cityArr = area.city.list;

      // lastet modify city / 最后修改的城市
      let city = cityArr.find(v => v.id == this.filter(area.cityCache, selfCity)[0]);

      area.cityCache = selfCity;

      cityArr.forEach(v => v.checked = selfCity.indexOf(v.id) != -1);

      // this.updateArea(index, city.parent);
    },

    // update other area / 更新其他区域
    updateArea(areaIndex, provinceId){
      let updateAreaArr = this.area.filter((area, i) => areaIndex != i && area.province.value.filter(v => v == provinceId).length),
          cityList = this.provinceArr.find(v => v.id == provinceId).list;

      updateAreaArr.forEach(v => { 
        this.initCityList(v);

        // clear invalid province / 删除冗余省份
        if(cityList.every(v1 => v1.checked) && v.city.value.every(id => !cityList.some(v1 => v1.id == id))){
          v.province.value.splice(v.province.value.indexOf(provinceId), 1); 
        }
      });
    },

    // baseArr + optArr
    merge(baseArr, optArr){
      if(typeof baseArr != 'object' || !baseArr.push) return console.error('baseArr must be an Array.');
      
      for(let i = optArr.length - 1; i >= 0; i--){
        let v = optArr[i];

        if(baseArr.indexOf(v) == -1) baseArr.push(v);
      }

    },

    // baseArr - optArr
    filter(baseArr, optArr){
      let arr = [];

      if(baseArr.length < optArr.length) [baseArr, optArr] = [optArr, baseArr];

      baseArr.forEach(v => { 
        if(optArr.indexOf(v) == -1) arr.push(v); 
      });

      return arr;
    }
  },

  created(){
  }
  
}