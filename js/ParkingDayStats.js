L.Control.ParkingDayStats = L.Control.extend({
    options: {position: 'topleft'},
    onAdd: function (map) {

      var div = L.DomUtil.create('div', 'info timestats info-stats');

      div.innerHTML = '<div class="stats-grid">' +
      '  <div class="col-1-2"><h4>Parking Events<h1><span id="stats-total-events">??</span></h1></h4></div>' +
      '  <div class="col-1-2"><h4>Parking Violations<h1><span id="stats-total-violations">??</span></h1></h4></div>' +
      '</div>'+
      '<hr>'+
      '<div class="stats-grid">' +
      '  <div class="col-1-3"><h4>Monitoring<h1><span id="stats-monitoring">??</span></h1><h4></div>' +
      '  <div class="col-1-3"><h4>Unmonitored<h1><span id="stats-no-monitoring">??</span></h1><h4></div>' +
      '  <div class="col-1-3"><h4>Spaces<h1><span id="stats-total">??</span></h1><h4></div>' +
      ''+
      '  <div class="col-1-3"><h4>Free<h1><span id="stats-parking-empty">??</span></h1><h4></div>' +
      '  <div class="col-1-3"><h4>Taken<h1><span id="stats-parking-total-taken">??</span></h1><h4></div>' +
      '  <div class="col-1-3"><h4>Over Limt<h1><span id="stats-parking-in-violation">??</span></h1><h4></div>' +
      ''+
      '  <div class="col-1-2"><h4>Taken And Will Leave Ontime<h1><span id="stats-parking-will-leave">??</span></h1><h4></div>' +
      '  <div class="col-1-2"><h4>Taken And Will Overstay<h1><span id="stats-parking-will-violation">??</span></h1><h4></div>' +
      ''+
      '</div>';

      

      return div;
    },
    updateStats: function(stats) {

      var monitoringCount = stats.parkingEmpty + stats.parkingTaken + stats.parkingWillViolate + stats.parkingInViolation;

      document.getElementById('stats-total').innerHTML = monitoringCount + stats.parkingNoMonitoring;

      document.getElementById('stats-monitoring').innerHTML = monitoringCount;
      document.getElementById('stats-no-monitoring').innerHTML = stats.parkingNoMonitoring;

      document.getElementById('stats-parking-empty').innerHTML = stats.parkingEmpty;
      document.getElementById('stats-parking-total-taken').innerHTML = stats.parkingTaken + stats.parkingWillViolate + stats.parkingInViolation;
      document.getElementById('stats-parking-will-leave').innerHTML = stats.parkingTaken;
      document.getElementById('stats-parking-will-violation').innerHTML = stats.parkingWillViolate;
      document.getElementById('stats-parking-in-violation').innerHTML = stats.parkingInViolation;
    },

    updateDayStats: function() {


      var parkingViolations = MELBPARKING.DataProcessor.parkingViolations;
      
      document.getElementById('stats-total-violations').innerHTML = parkingViolations;
      document.getElementById('stats-total-events').innerHTML = MELBPARKING.DataProcessor.parkingEvents;




    }

});

L.control.parkingDayStats = function (options) {
    return new L.Control.ParkingDayStats(options);
};