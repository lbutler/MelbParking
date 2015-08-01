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

        var parkingDayStats = L.control.parkingDayStats();
        map.addControl(parkingDayStats);




        var slider = L.control({position: 'bottomleft'});
        slider.onAdd = function (map) {

          var div = L.DomUtil.create('div', 'info slider');

          $(div).mousedown(function () {
            map.dragging.disable();
          });
          $(document).mouseup(function () {
            map.dragging.enable();
          });

          div.innerHTML = '<div id="slider"></div>';

          return div;
        };

        slider.addTo(map);




        var dayGraph = L.control({position: 'bottomleft'});
        dayGraph.onAdd = function (map) {

          var div = L.DomUtil.create('div', 'info graph');

          div.innerHTML = '<div id="day-graph"></div>';

          return div;
        };

        dayGraph.addTo(map);



        //Slider
        var currentDate = new Date(2014, 5, 12, 0, 0, 0);
        var currentTime = document.getElementById('time');


        //SVG Display
        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

        d3.json("data/ParkingLocations.json", function(collection) {

          $( "#slider" ).slider({
            orientation: "horizontal",
            range: "min",
            max: 1440,
            value: 0,
            slide: refreshTime,
            change: refreshTime
          });

          MELBPARKING.DataProcessor.initStats();

          for (var i = 0; i < collection.features.length; i++) {

            var parkingTimeArray = MELBPARKING.DataProcessor.parkingSpotTimeArray(collection.features[i]);
            collection.features[i].properties.parkingData = parkingTimeArray;

          }

          console.log(collection);

          var transform = d3.geo.transform({point: projectPoint}),
              path = d3.geo.path().projection(transform);

          var feature = g.selectAll("path")
              .data(collection.features)
            .enter().append("path")
            .on({
              "mouseover": function(d) { info.update(d); },
              "mouseout":  function(d) { info.update(); },
              "click":  function(d) { console.log(d); },
            });

          map.on("viewreset", reset);
          reset();
          refreshTime();
          parkingDayStats.updateDayStats();

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
          currentTime.innerHTML = moment(newDateObj).format('h:mm a');

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




//D3 TEST START


(function() {
  var margin = {top: 20, right: 0, bottom: 30, left: 0},
      width = 1728 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%y-%b-%d").parse,
      formatPercent = d3.format(".0%");

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);

  var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

  var svg = d3.select("#day-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //d3.tsv("data/data.tsv", function(error, data) {
  //  if (error) throw error;

    var data = JSON.parse(JSON.stringify(MELBPARKING.DataProcessor.dayStats));

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));


    data.forEach(function(d, index) {
      //d.date = parseDate(d.date);
      d.date = index;

      d.parkingEmpty = d.parkingEmpty / 3159  *100;
      d.parkingInViolation = d.parkingInViolation / 3159*100;
      d.parkingNoMonitoring = d.parkingNoMonitoring / 3159*100;
      d.parkingTaken = d.parkingTaken / 3159*100;
      d.parkingWillViolate = d.parkingWillViolate / 3159*100;

      console.log(d);
    });

    var browsers = stack(color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, y: d[name] / 100};
        })
      };
    }));

    x.domain(d3.extent(data, function(d) { return d.date; }));

    var browser = svg.selectAll(".browser")
        .data(browsers)
      .enter().append("g")
        .attr("class", "browser");

    browser.append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.name); });

//    browser.append("text")
//        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
//        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
//        .attr("x", -6)
//        .attr("dy", ".35em")
//        .text(function(d) { return d.name; });
//
//    svg.append("g")
//        .attr("class", "x axis")
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis);
//
//    svg.append("g")
//        .attr("class", "y axis")
//        .call(yAxis);
  //});

}());

//D3 TEST END




        });


