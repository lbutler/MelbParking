var MELBPARKING = MELBPARKING || {};

(function() {

  MELBPARKING.Map = {

    init: function() {
      this.map = new L.Map("map", {center: [-37.8177175, 144.959922], zoom: 15,  zoomControl:false })
            .addLayer(new L.TileLayer("http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",{
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }));

      this.info = L.control.parkingBayInfo();
      this.map.addControl(this.info);

      this.parkingTimeControl = L.control.parkingTimeControl();
      this.map.addControl(this.parkingTimeControl);
      this.parkingTimeControl.init();

      this.parkingDayStats = L.control.parkingDayStats();
      this.map.addControl(this.parkingDayStats);

      this.parkingSliderControl = L.control.parkingSliderControl();
      this.map.addControl(this.parkingSliderControl);

      this.parkingTimeGraph = L.control.parkingTimeGraph();
      this.map.addControl(this.parkingTimeGraph);

      var self = this;

      $('#js-toogle-24hr-mode').click( function() {
          self.parkingSliderControl.toogleHoursDisplayed();
          self.parkingTimeGraph.toogleHoursDisplayed();
      });
    }

  };

}());