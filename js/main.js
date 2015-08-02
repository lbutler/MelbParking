//Wheres the IFFY!
//        (function() {
//
//        }());

        var map = new L.Map("map", {center: [-37.8177175, 144.959922], zoom: 15,  zoomControl:false })
            .addLayer(new L.TileLayer("http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}));

        var info = L.control.parkingBayInfo();
        map.addControl(info);

        var parkingTimeControl = L.control.parkingTimeControl();
        map.addControl(parkingTimeControl);
        parkingTimeControl.init();

        var parkingDayStats = L.control.parkingDayStats();
        map.addControl(parkingDayStats);

        var parkingSliderControl = L.control.parkingSliderControl();
        map.addControl(parkingSliderControl);

        var parkingTimeGraph = L.control.parkingTimeGraph();
        map.addControl(parkingTimeGraph);

        $('#js-toogle-24hr-mode').click( function() {
          parkingSliderControl.toogleHoursDisplayed();
          parkingTimeGraph.toogleHoursDisplayed();
        });


        //Slider
        var currentDate = new Date(2014, 5, 12, 0, 0, 0);
        var currentTime = document.getElementById('time');


        //SVG Display
        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

        d3.json("data/ParkingLocations.json", function(collection) {

          parkingSliderControl.init(refreshTime);

          MELBPARKING.DataProcessor.initStats();

          for (var i = 0; i < collection.features.length; i++) {

            var parkingTimeArray = MELBPARKING.DataProcessor.parkingSpotTimeArray(collection.features[i]);
            collection.features[i].properties.parkingData = parkingTimeArray;

          }


          var transform = d3.geo.transform({point: projectPoint}),
              path = d3.geo.path().projection(transform);

          var feature = g.selectAll("path")
              .data(collection.features)
            .enter().append("path")
            .on({
              "mouseover": function(d) { info.update(d); },
              "mouseout":  function(d) {info.clearInfo(); },
              "click":  function(d) { console.log(d); },
            });

          map.on("viewreset", reset);
          reset();
          refreshTime();
          parkingDayStats.updateDayStats();

          parkingTimeGraph.update(JSON.parse(JSON.stringify(MELBPARKING.DataProcessor.dayStats)));

          // Reposition the SVG to cover the features.
          function reset() {
            var bounds = path.bounds(collection),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
          }

          

          // Use Leaflet to implement a D3 geometric transformation.
          function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          }


        function refreshTime() {


          var newDateObj = new Date(currentDate.getTime() + $( "#slider" ).slider( "value" )*60000);
          parkingTimeControl.updateTime(newDateObj);

          var minute = $( "#slider" ).slider( "value" );


          //Updating Parking Stats Control
          parkingDayStats.updateStats(MELBPARKING.DataProcessor.dayStats[minute]);

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

        }


        });


