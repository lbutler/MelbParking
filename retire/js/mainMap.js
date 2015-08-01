//Parse Data
(function() {

    var data = {};

    var dataDate = new Date(2014, 5, 12, 0, 0, 0);

    for (var i = 0; i < TESTDATA.length; i++) {
        if (!(TESTDATA[i][0] in data)) {
            data[TESTDATA[i][0]] = new Array(1440);
        }

        var parkingStartTime = new Date(TESTDATA[i][2]);
        var parkingEndTime = new Date(TESTDATA[i][3]);
        //if (i===0) {

            //console.log(parkingStartTime );
            //console.log(parkingEndTime );
            //console.log(dataDate );
            var start = Math.floor((parkingStartTime -dataDate) / 1000 / 60);
            //console.log( start );
            var end =  Math.floor((parkingEndTime - dataDate) / 1000 / 60);
            //console.log ( end );



            for (var j = start; j <= end; j++) {
                data[TESTDATA[i][0]][j] = TESTDATA[i][1];
            }
        //}
        

    }

    window.PARKINGDATA = data;

}());



//Load Map
(function() {



    var currentDate = new Date(2014, 5, 12, 0, 0, 0);
    var currentTime = document.getElementById('time');



    $( "#slider" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 1440,
      value: 0,
      slide: refreshTime,
      change: refreshTime
    });


    var points = PARKNGBAYS; // data loaded from dataLatLng.js
    var leafletMap = L.map('map').setView([-37.8177175, 144.959922], 16);
    L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png")
        .addTo(leafletMap);

    var canvasLayer = L.canvasOverlay()
        .drawing(drawingOnCanvas)
        .addTo(leafletMap);


    function refreshTime() {
        var newDateObj = new Date(currentDate.getTime() + $( "#slider" ).slider( "value" )*60000);
        currentTime.innerHTML = newDateObj.toTimeString();
        canvasLayer.redraw();
    };

    function drawingOnCanvas(canvasOverlay, params) {
        var ctx = params.canvas.getContext('2d');
        ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
        

        var minute = $( "#slider" ).slider( "value" );

        PARKNGBAYS.map(function (d, i) {
            if (params.bounds.contains([d[0], d[1]])) {

                var key = d[2];
                if (typeof PARKINGDATA[key] != 'undefined' && typeof  PARKINGDATA[key][minute] != 'undefined' ) {
                    ctx.fillStyle = (PARKINGDATA[key][minute] === "0") ? "rgba(0,0,255,0.4)" :  "rgba(255,0,0,0.4)";
                } else {
                    ctx.fillStyle = "rgba(255,116,0, 0.4)";
                }

                dot = canvasOverlay._map.latLngToContainerPoint([d[0], d[1]]);
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        });
    }

        
}());