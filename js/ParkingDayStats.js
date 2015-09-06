L.Control.ParkingDayStats = L.Control.extend({
    options: {position: 'topleft'},
    onAdd: function (map) {

      var div = L.DomUtil.create('div', 'info-dark timestats info-stats');

      div.innerHTML = '<div class="stats-grid">' +
      '  <div class="col-1-2"><h4>Parking Events<h1><span id="stats-total-events">??</span></h1></h4></div>' +
      '  <div class="col-1-2"><h4>Parking Violations<h1><span id="stats-total-violations">??</span></h1></h4></div>' +
      '  <div class="col-1-2"><h4>Free<h1><span id="stats-parking-empty">??</span></h1><h4></div>' +
      '  <div class="col-1-2"><h4>Taken<h1><span id="stats-parking-total-taken">??</span></h1><h4></div>' +
      ''+
      '  <div class=""><h4>Car Parks:<h4></div>' +
      '  <div class="legend-item"><span><svg><circle cx="6" cy="4" r="3" fill="#00ff00"></rect></svg> Free</span> <span class="stats" id="stats-parking-empty-2">??</span></h1><h4></div>' +
      '  <div class="legend-item"><span><svg><circle cx="6" cy="4" r="3" fill="#0000ff"></rect></svg> Taken (Punctual)</span> <span class="stats" id="stats-parking-will-leave">??</span></h1><h4></div>' +
      '  <div class="legend-item"><span><svg><circle cx="6" cy="4" r="3" fill="#ffff00"></rect></svg> Taken (Will Overstay)</span> <span class="stats" id="stats-parking-will-violation">??</span></h1><h4></div>' +
      '  <div class="legend-item"><span><svg><circle cx="6" cy="4" r="3" fill="#ff0000"></rect></svg> Over Limit</span> <span class="stats" id="stats-parking-in-violation">??</span></h1><h4></div>' +
      '  <div class="legend-item"><span><svg><circle cx="6" cy="4" r="3" fill="#FFF"></rect></svg> Unmonitored</span> <span class="stats" id="stats-no-monitoring">??</span></h1><h4></div>' +
      '</div>';

      

      return div;
    },
    updateStats: function(stats) {

      //var monitoringCount = stats.parkingEmpty + stats.parkingTaken + stats.parkingWillViolate + stats.parkingInViolation;

      //document.getElementById('stats-total').innerHTML = monitoringCount + stats.parkingNoMonitoring;

      //document.getElementById('stats-monitoring').innerHTML = monitoringCount;
      document.getElementById('stats-no-monitoring').innerHTML = stats.parkingNoMonitoring;

      document.getElementById('stats-parking-empty').innerHTML = stats.parkingEmpty;
      document.getElementById('stats-parking-empty-2').innerHTML = stats.parkingEmpty;
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