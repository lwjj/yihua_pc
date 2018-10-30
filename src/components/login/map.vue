<template>
  <div class="hangye">
    <div class="my_map" ref="my_map">
      <div class="toolbar">
        <el-button type="" size=""  class="btn" @click="chooseCancel">取消</el-button>
        <div>地址:</div>
        <b>{{address}}</b>
        <el-button type="primary" size=""  class="btn" @click="chooseSuccess()">确定</el-button>
      </div>
      <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :plugin="plugins" :events="events" :center="mapCenter" :zoom="16" class="amap-demo">
          <el-amap-marker v-for="(marker,key) in markers" :key="key" :position="marker"></el-amap-marker>
        </el-amap>
      </div>

    </div>

  </div>
</template>
<script>
import Vue from "vue";
import VueAMap from "vue-amap";

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "8a460d7bfd797e46302bd627782d7f2e",
  plugin: [
    "Autocomplete",
    "PlaceSearch",
    "Scale",
    "Geocoder",
    "OverView",
    "ToolBar",
    "MapType",
    "PolyEditor",
    "Geolocation"
  ]
});

export default {
  name: "",
  props: ["url"],
  data: function() {
    var that = this;
    return {
      loaded: false,
      address: "定位中",
      markers: [
        [121.59996, 31.197646],
        [121.40018, 31.197622],
        [121.69991, 31.207649]
      ],
      plugins: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  that.address = result.formattedAddress;
                  that.location = {
                    lat: result.position.lat,
                    lng: result.position.lng
                  };
                  that.addMarker([that.location.lat, that.location.lng]);
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                }
              });
            }
          }
        }
      ],
      events: {
        click(e) {
          var currentlnglat = [e.lnglat.lng, e.lnglat.lat];
          that.mapCenter = currentlnglat;
          that.addMarker(currentlnglat);

          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress(currentlnglat, function(status, result) {
            console.log("点击的地图信息", result);
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                console.log(result.regeocode.addressComponent);
                var info = result.regeocode.addressComponent;
                //console.log(info)
                console.log(
                  "省：",
                  info.province,
                  "市:",
                  info.city,
                  "区县:",
                  info.district
                );
                that.address = result.regeocode.formattedAddress;
                that.province = info.province;
                that.city = info.city;
                that.district = info.district;
                that.location = {
                  lng: currentlnglat[0],
                  lat: currentlnglat[1]
                };
                console.log(that);
              }
            }
          });
        }
      },
      searchOption: {
        city: "全国",
        citylimit: false
      },
      mapCenter: [113.95128, 22.55565]
    };
  },
  methods: {
    chooseCancel() {
      this.$emit("chooseSuccess");
    },
    chooseSuccess() {
      var obj = {};
      obj.address = this.address;
      obj.location = this.location;
      obj.province = this.province;
      obj.city = this.city;
      obj.district = this.district;
      this.$emit("chooseSuccess", obj);
    },
    cancel() {
      this.$emit("cancel");
      return false;
    },
    addMarker: function(arr) {
      let lng = arr[0];
      let lat = arr[1];
      this.markers = [];
      this.markers.push([lng, lat]);
    },
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.markers.push([poi.lng, poi.lat]);
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.mapCenter = [center.lng, center.lat];
      }
    }
  },
  mounted() {}
};
</script>
<style scoped>
el-header {
  background-color: #0093d2;
  color: #fff;
}
.hangye {
  height: 100%;
}
.my_map {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
}

.amap-demo {
  position: absolute;
  top: 0;
  height: 800px;
  bottom: 0;
  left: 0;
  right: 0;
}

.search-box {
  position: absolute;
  left: 13px;
  right: 13px;
  width: auto;
  top: 12px;
  max-width: 560px;
}

.amap-page-container {
  position: relative;
}

.toolbar {
  width: 100%;
  height: 50px;
  background: #fff;
  /*max-width: 560px;*/
  align-items: center;
  padding: 0 4px;
  display: flex;
  border: 1px solid #ddd;
  margin: -20px 0 0px;
  z-index: 99999;
}

.toolbar > b {
  padding-left: 3px;
}
.toolbar > .btn {
  margin-left: 20px;
}
</style>
