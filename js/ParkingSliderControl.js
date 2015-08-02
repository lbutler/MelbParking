L.Control.ParkingSliderControl = L.Control.extend({
  options: {position: 'bottomleft', peakHoursOnly: true},
    onAdd: function (map) {
      this._div = L.DomUtil.create('div', 'info slider');

          $(this._div).mousedown(function () {
            map.dragging.disable();
          });
          $(document).mouseup(function () {
            map.dragging.enable();
          });

          this._div.innerHTML = '<div id="slider"></div>';

          return this._div;
      },
    init: function (changeCallback) {

      //Got to be a better way
      this._slider = $( "#slider" ).slider({
            orientation: "horizontal",
            range: "min",
            //max: 1440,
            max: this.options.peakHoursOnly ? 1230 : 1440,
            min: this.options.peakHoursOnly ? 450 : 0,
            value: 0,
            slide: changeCallback,
            change: changeCallback
          });

    },

    toogleHoursDisplayed: function() {

      this.options.peakHoursOnly = !this.options.peakHoursOnly;
      this._updateSliderHours();

    },

    _updateSliderHours: function() {

      var min = this.options.peakHoursOnly ? 450 : 0;
      var max = this.options.peakHoursOnly ? 1230 : 1440;
      var currentValue = this._slider.slider("value");

      this._slider.slider("option", "min", min);
      this._slider.slider("option", "max", max);

      if (currentValue < min)
        currentValue = min;

      if (currentValue > max)
        currentValue = max;

      //refresh and move within new bound if need be
      this._slider.slider("value", currentValue);

    }


    });

L.control.parkingSliderControl = function (options) {
    return new L.Control.ParkingSliderControl(options);
};