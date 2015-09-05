L.Control.ParkingTimeControl = L.Control.extend({
    options: {position: 'topleft'},
    onAdd: function (map) {

    this._div = L.DomUtil.create('div', 'info timestats time-control');
    this.changeDate(this.options.day);

    return this._div;
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
        $( "#datepicker" ).datepicker(
            { minDate: new Date(2014, 0, 1),
             maxDate: new Date(2014, 11, 31),
             defaultDate: this.dayMoment.toDate(),
             dateFormat: "dd/mm/yy",
             onSelect: function(date) {

                $('.loading').show();

                //TODO:
                //Clean this up
                var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method

                MELBPARKING.Map.changeDate(dateAsObject);
                MELBPARKING.D3LeafletLayer.init(dateAsObject);
             } });
    },
    changeDate: function(date) {

        this.dayMoment = moment(date);

        this._div.innerHTML = '<div class="time-controls-front"><h1>'+this.dayMoment.format('dddd')+'</h1>' +
        '<h2>'+this.dayMoment.format('Do MMMM YYYY')+'</h2>' +
        '<h1><i class="fa fa-clock-o"></i> <span id="time">7:30 am</span></h1>' +
        
        '<hr>'+
        '<div class="menu-grid grid-pad">' +
        '   <div id="js-open-datepicker" class="col-1-4"><i class="fa fa-calendar-o clickable"></i></div>' +
        '   <div id="js-toogle-24hr-mode" class="col-1-4"><i class="fa fa-clock-o clickable"></i></div>' +
        '   <div class="col-1-4"><a href="https://github.com/lbutler/MelbParking" target="_blank"><i class="fa fa-github clickable"></i></a></div>' +
        '   <div class="col-1-4"><a href="https://lbutler.github.io/" target="_blank"><i class="fa fa-question-circle clickable"></i></a></div>' +
        '</div>'+
        '</div>'+
        '<div class="time-controls-back" id="datepicker"></div>';

        this.init();

    }


});

L.control.parkingTimeControl = function (options) {
    return new L.Control.ParkingTimeControl(options);
};