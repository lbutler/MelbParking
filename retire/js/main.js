// Adapted from https://gist.github.com/paulirish/1579671 which derived from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());


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

    window.DATA = data;

}());

(function() {


    var currentDate = new Date(2014, 5, 12, 0, 0, 0);
    var currentTime = document.getElementById('time');

    var refreshTime = function(){
        var newDateObj = new Date(currentDate.getTime() + $( "#slider" ).slider( "value" )*60000);
        currentTime.innerHTML = newDateObj.toTimeString();
    };


    $( "#slider" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 1440,
      value: 0,
      slide: refreshTime,
      change: refreshTime
    });

    var cvs = document.getElementById('cvs'),
        ctx = cvs.getContext('2d'),
        frameHeight = 576,
        frameWidth = 576,
        fps = 0,
        fps_now, fps_last = (new Date),
        fps_el = document.getElementById('fps'),
        x = 0;
    
    cvs.setAttribute('height', frameHeight);
    cvs.setAttribute('width', frameWidth);

    var render = function() {
        /* FPS setup */
        fps_now=new Date;
        fps = 1000/(fps_now - fps_last);
        fps_last = fps_now;
        /* /FPS setup */
        
        /* Frame Animation */
        
        ctx.save();
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, frameWidth, frameHeight);


        ctx.fillStyle = "rgb(0,0,255)";

        var i =0;
        var j = 0;
        var minute = $( "#slider" ).slider( "value" );
        for(var key in DATA){
            // The key is key
            // The value is obj[key]
            if (typeof  DATA[key][minute] != 'undefined') {
                
                DATA[key][minute] === "0" ?  ctx.fillStyle = "rgb(0,0,255)" : ctx.fillStyle = "rgb(255,0,0)";

                ctx.fillRect(j*8, i*8, 8, 8);
            }

            j++;
            if (j > 72) {
                j = 0;
                i++;
            }
        }

        //for (var i = 0; i < 72; i++) {
        //    for (var j = 0; j < 72; j++) {
                
                //ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
                //ctx.fillRect(i*8, j*8, 8, 8);

        //    }
        //}

        ctx.restore();
        
        /* /Frame Animation */
        
        /* FPS printout */
        fps_el.innerHTML = Math.round(fps) + " fps";
        /* /FPS printout */
        requestAnimationFrame(function(){render();});
    };
    render.call();
}());