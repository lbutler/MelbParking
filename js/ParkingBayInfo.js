L.Control.ParkingBayInfo = L.Control.extend({
  options: {position: 'topright'},

  onAdd: function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.clearInfo();
    return this._div;
  },

  update: function (props) {

      clearTimeout(this._timeout);

      this._div.innerHTML = '<h4>Parking Information</h4>' +
          '<h3>'+ props.properties.streetName + ' - ' + props.properties.streetMarker+'</h3>' +
          '<h4>Restrictions</h4>' +
          this._getSignPlates(props.properties.signPlates) +
          '<h4>Parking Events</h4>' +
          this._getParkingEvents(props.properties.sensor);
  },

  clearInfo: function () {
    var self = this;

    clearTimeout(this._timeout);

    this._timeout = setTimeout(function() {
      console.log('clearInfo Called');
       self._div.innerHTML = '<h4>Parking Information</h4>' +
      '<b>Hover over a parking space</b>';

    }, 400);

  },

  _getSignPlates: function(signPlates) {

    var domString = '<ul>';

    for (var i = 0; i < signPlates.length; i++) {
      domString += '<li>'+signPlates[i].Sign + '</li>';
    }

    domString += '</ul>';

    return domString;

  },

  _getParkingEvents: function(parkingEvents) {

    var domString = '<ul>';

    for (var i = 0; i < parkingEvents.length; i++) {
      domString += '<li>'+parkingEvents[i].arrivalDateTime.substr(11) + ' - ' + parkingEvents[i].depart.substr(11) + '</li>';
    }

    domString += '</ul>';

    return domString;

  }

});

L.control.parkingBayInfo = function (options) {
    return new L.Control.ParkingBayInfo(options);
};