<template>
  <div class="">

    <div id="a-map-container" class=""></div>

  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object, 
      default(){
        return {};
      },
    },
  },

  data() {
    return {
      map: null,

      mapConfig: {
        center: [103.383, 35.55],  
        zoom: 4,
      },
    };
  },

  methods: {
    setCenter(position, zoom) {
      let marker = new window.AMap.Marker({
        position,
      });

      if(!this.map) this.init();

      this.map.setZoomAndCenter(zoom || this.mapConfig.zoom, position);
      this.map.add(marker);
    },

    init() {
      this.map = new window.AMap.Map('a-map-container', this.mapConfig);
      // this.map.on('click', this.handleClick);

      // window.AMap.plugin('AMap.Geolocation', () => {
      //   var geolocation = new window.AMap.Geolocation({
      //     // enableHighAccuracy: true,
      //     timeout: 10000,
      //     //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      //     zoomToAccuracy: true,     
      //     buttonPosition: 'RB', //  定位按钮的排放位置,  RB表示右下
      //     buttonOffset: new window.AMap.Pixel(10, 20), // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
      //   });

      //   geolocation.getCurrentPosition()
      //   window.AMap.event.addListener(geolocation, 'complete', onComplete)
      //   window.AMap.event.addListener(geolocation, 'error', onError)

      //   function onComplete (data) {
      //     console.log('data', data);
      //   }

      //   function onError (data) {
      //     console.log('err', data);
      //     // this.$message.error(data);
      //   }
      // });
    },
  },

  mounted() {
    this.init();
  },
}
</script>

<style scoped>
#a-map-container{
  width: 100%;
  height: 100%;
}

.s_fc_10{ color: #505050; }
</style>