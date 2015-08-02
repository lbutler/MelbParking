L.Control.ParkingTimeControl = L.Control.extend({
    options: {position: 'topleft'},
    onAdd: function (map) {

    var div = L.DomUtil.create('div', 'info timestats');

    div.innerHTML = '<h1>Thursday</h1>' +
    '<h2>12th June 2014</h2>' +
    '<h1><i class="fa fa-clock-o"></i> <span id="time">12:00 am</span><h1>' +
    '<hr>'+
    '<i class="fa fa-calendar-o"></i><i class="fa fa-clock-o"></i><i class="fa fa-area-chart"></i><i class="fa fa-info-circle"></i>';

    return div;
    },
    updateTime: function(newTime) {

      document.getElementById('time').innerHTML = moment(newTime).format('h:mm a');
    }

});

L.control.parkingTimeControl = function (options) {
    return new L.Control.ParkingTimeControl(options);
};