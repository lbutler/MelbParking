L.Control.ParkingTimeControl = L.Control.extend({
    options: {position: 'topleft'},
    onAdd: function (map) {

    var div = L.DomUtil.create('div', 'info timestats time-control');

    div.innerHTML = '<div class="time-controls-front"><h1>Thursday</h1>' +
    '<h2>12th June 2014</h2>' +
    '<h1><i class="fa fa-clock-o"></i> <span id="time">12:00 am</span></h1>' +
    
    '<hr>'+
    '<div class="menu-grid">' +
    '   <div id="js-open-datepicker" class="col-1-4"><i class="fa fa-calendar-o"></i></div>' +
    '   <div id="js-toogle-24hr-mode" class="col-1-4"><i class="fa fa-clock-o"></i></div>' +
    '   <div class="col-1-4"><a href="https://github.com/lbutler/MelbParking" target="_blank"><i class="fa fa-github"></i></a></div>' +
    '   <div class="col-1-4"><i class="fa fa-question-circle"></i></div>' +
    '</div>'+
    '</div>'+
    '<div class="time-controls-back" id="datepicker"></div>';

    return div;
    },
    init: function() {
        var self = this;
        $('#js-open-datepicker').click( function() {
          self.addDatepicker();
          $('.time-controls-front').hide();

        });
    },
    updateTime: function(newTime) {

      document.getElementById('time').innerHTML = moment(newTime).format('h:mm a');
    },
    addDatepicker: function() {
        $( "#datepicker" ).datepicker({ minDate: new Date(2014, 0, 1), maxDate: new Date(2014, 11, 31) });
    }


});

L.control.parkingTimeControl = function (options) {
    return new L.Control.ParkingTimeControl(options);
};