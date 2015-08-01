L.Control.ParkingDayStats = L.Control.extend({
    options: {position: 'topleft'},
    onAdd: function (map) {

      var div = L.DomUtil.create('div', 'info timestats');

      div.innerHTML = '<h1>Thursday</h1>' +
      '<h2>12th June 2014</h2>' +
      '<h1><i class="fa fa-clock-o"></i> <span id="time">12:00 am</span><h1>' +
      '<hr />' +
      '<h4>Total Parking Violations: <h1><span id="stats-total-violations">??</span></h1><h4>' +
      '<h4>Potential Fines: <h1><span id="stats-potential-fines">??</span></h1><h4>' +
      '<h4>Total Spaces: <h1><span id="stats-total">??</span></h1><h4>' +
      '<h4>Monitoring: <h1><span id="stats-monitoring">??</span></h1><h4>' +
      '<h4>No Monitoring: <h1><span id="stats-no-monitoring">??</span></h1><h4>' +
      '<h4>Free: <h1><span id="stats-parking-empty">??</span></h1><h4>' +
      '<h4>Taken: <h1><span id="stats-parking-taken">??</span></h1><h4>' +
      '<h4>Taken will Violate: <h1><span id="stats-parking-will-violation">??</span></h1><h4>' +
      '<h4>Over limt: <h1><span id="stats-parking-in-violation">??</span></h1><h4>';

      return div;
    },
    updateStats: function(stats) {

      var monitoringCount = stats.parkingEmpty + stats.parkingTaken + stats.parkingWillViolate + stats.parkingInViolation;

      document.getElementById('stats-total').innerHTML = monitoringCount + stats.parkingNoMonitoring;

      document.getElementById('stats-monitoring').innerHTML = monitoringCount;
      document.getElementById('stats-no-monitoring').innerHTML = stats.parkingNoMonitoring;

      document.getElementById('stats-parking-empty').innerHTML = stats.parkingEmpty;
      document.getElementById('stats-parking-taken').innerHTML = stats.parkingTaken;
      document.getElementById('stats-parking-will-violation').innerHTML = stats.parkingWillViolate;
      document.getElementById('stats-parking-in-violation').innerHTML = stats.parkingInViolation;
    },

    updateDayStats: function() {


      var parkingViolations = MELBPARKING.DataProcessor.parkingViolations;
      var potentialFines = parkingViolations * 30;
      
      document.getElementById('stats-total-violations').innerHTML = parkingViolations;
      document.getElementById('stats-potential-fines').innerHTML = '$' + potentialFines.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');




    }

});

L.control.parkingDayStats = function (options) {
    return new L.Control.ParkingDayStats(options);
};