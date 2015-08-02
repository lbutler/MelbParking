L.Control.ParkingTimeGraph = L.Control.extend({
  options: {position: 'bottomleft'},
  onAdd: function (map) {
    
    this._div = L.DomUtil.create('div', 'info graph');

    this._div.innerHTML = '<div id="day-graph" class="day-graph-container"></div>';

    return this._div;
  },
  update: function(data) {
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 1728 - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom;

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

    d3.select('#day-graph').selectAll('*').remove();
    var svg = d3.select("#day-graph").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox","0 0 1728 150")
        .attr("preserveAspectRatio","none")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Only use peak time
      data = data.splice(450,780);
      console.log(data);

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));


      data.forEach(function(d, index) {
        //d.date = parseDate(d.date);
        d.date = index;

        d.parkingEmpty = d.parkingEmpty / 3159  *100;
        d.parkingInViolation = d.parkingInViolation / 3159*100;
        d.parkingNoMonitoring = d.parkingNoMonitoring / 3159*100;
        d.parkingTaken = d.parkingTaken / 3159*100;
        d.parkingWillViolate = d.parkingWillViolate / 3159*100;

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
          .attr("class", function(d) { return d.name; })
          .attr("d", function(d) { return area(d.values); });
          //.style("fill", function(d) { return color(d.name); });


  }

});

L.control.parkingTimeGraph = function (options) {
  return new L.Control.ParkingTimeGraph(options);
};