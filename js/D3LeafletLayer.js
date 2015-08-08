var MELBPARKING = MELBPARKING || {};

(function() {

  MELBPARKING.D3LeafletLayer = {

    init: function(currentDate) {

        var self = this;

        this._currentDate = currentDate;

        //SVG Display
        this._svg = d3.select(MELBPARKING.Map.map.getPanes().overlayPane).append("svg");
        this._g = this._svg.append("g").attr("class", "leaflet-zoom-hide");

        d3.json("data/ParkingLocations.json", function(collection) {

          self._collection = collection;

          MELBPARKING.Map.parkingSliderControl.init(self.refreshTime);

          MELBPARKING.DataProcessor.initStats();

          for (var i = 0; i < collection.features.length; i++) {

            var parkingTimeArray = MELBPARKING.DataProcessor.parkingSpotTimeArray(collection.features[i]);
            collection.features[i].properties.parkingData = parkingTimeArray;

          }


          var transform = d3.geo.transform({point: self.projectPoint});
          self._path = d3.geo.path().projection(transform);

          self._feature = self._g.selectAll("path")
              .data(collection.features)
            .enter().append("path")
            .on({
              "mouseover": function(d) { MELBPARKING.Map.info.update(d); },
              "mouseout":  function(d) { MELBPARKING.Map.info.clearInfo(); },
              "click":  function(d) { console.log(d); },
            });

          MELBPARKING.Map.map.on("viewreset", self.reset);
          self.reset();
          self.refreshTime();
          MELBPARKING.Map.parkingDayStats.updateDayStats();

          MELBPARKING.Map.parkingTimeGraph.update(JSON.parse(JSON.stringify(MELBPARKING.DataProcessor.dayStats)));

        });

    },

    reset: function() {

      var bounds = this._path.bounds(this._collection),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            this._svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            this._g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            this._feature.attr("d", this._path);

    },

    refreshTime: function() {

      //TODO:
      //Dont do this
      var currentDate = MELBPARKING.D3LeafletLayer._currentDate;

      var newDateObj = new Date(currentDate.getTime() + $( "#slider" ).slider( "value" )*60000);
          MELBPARKING.Map.parkingTimeControl.updateTime(newDateObj);

          var minute = $( "#slider" ).slider( "value" );

          //Updating Parking Stats Control
          MELBPARKING.Map.parkingDayStats.updateStats(MELBPARKING.DataProcessor.dayStats[minute]);

          d3.select(".leaflet-overlay-pane svg").selectAll("path").attr("class", function (d) {

                  var key = d.properties.bayId;
                  var bayStatus;

                  switch (d.properties.parkingData[minute]) {
                    case 0:
                      bayStatus = 'parking-no-monitoring';
                      break;
                    case 1:
                      bayStatus = 'parking-empty';
                      break;
                    case 2:
                      bayStatus = 'parking-taken';
                      break;
                    case 3:
                      bayStatus = 'parking-will-violate';
                      break;
                    case 4:
                      bayStatus = 'parking-in-violation';
                      break;
                  }

                  return bayStatus;

                });
      
    },
    projectPoint: function(x, y) {
      var point = MELBPARKING.Map.map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

  };

}());