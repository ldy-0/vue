<template>
    <div class="c_map_wrap">

      <div id="a-map-container" class=""></div>

    </div>
</template>

<script>
export default {
  // Version 1.0.0

  name: 'customMap',
  
  props: {

    config: {
      type: Object,
      default: function() {
        return {};
      }
    },

  },

  data() {
    return {
      id: 1,
      map: null,

      mapConfig: {
        center: [103.383, 35.55],  
        zoom: 4,
      },

      param: {},
    }
  },

  computed: {
  },

  watch: {
  },
  
  methods: {
    handleClick(e){
      let position = e.lnglat;

      let marker = new AMap.Marker({
            position: [position.lng, position.lat],
          });

      marker.on('click', e => {
        let target = e.target;

        target.setMap(null);
        this.$emit('updateMarker', null);
      });

      this.map.clearMap();
      this.map.add(marker);
      this.$emit('updateMarker', position);
    },

    setCenter() {
      let position = this.config.center;

      if(!this.map) this.init();
      
      this.map.setCenter(position);
      this.handleClick({ lnglat: { lng: position[0], lat: position[1], }, });
    },
    
    init() {
      this.map = new AMap.Map('a-map-container', this.mapConfig);
      this.map.on('click', this.handleClick);
    },
  },

  mounted() {
    this.init();
  },

  destroyed() {
    this.map.destroy();
  },

}
</script>

<style scoped>
#a-map-container{
  width: 100%;
  height: 100%;
}
</style>
<style>

</style>