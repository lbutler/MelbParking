var MELBPARKING = MELBPARKING || {};

(function() {

  MELBPARKING.DataProcessor = {

    dayStats:  new Array(1441),
    parkingViolations: 0,
    parkingEvents: 0,

    initStats: function() {
      //Reset
      this.dayStats = new Array(1441);

      var currentDate = new Date(2014, 5, 12, 0, 0, 0);

      for (var i = 0; i < this.dayStats.length; i++) {
        this.dayStats[i] = {  parkingEmpty:0, parkingTaken:0, parkingWillViolate:0, parkingInViolation:0, parkingNoMonitoring:0 };
        
        this.dayStats[i].date = moment(currentDate).add(i, 'minutes').toDate();
      }

    },

    addParkingSpotToStats: function(parkingTimeArray) {

      for (var i = 0; i < parkingTimeArray.length; i++) {
        
        switch (parkingTimeArray[i]) {
          case 0:
            bayStatus = 'parkingNoMonitoring';
            break;
          case 1:
            bayStatus = 'parkingEmpty';
            break;
          case 2:
            bayStatus = 'parkingTaken';
            break;
          case 3:
            bayStatus = 'parkingWillViolate';
            break;
          case 4:
            bayStatus = 'parkingInViolation';
            break;
        }

        this.dayStats[i][bayStatus] += 1;

      }


    },

    parkingSpotTimeArray: function(feature) {

      var date = '2014-01-01';
      var dataDate = moment('2014-01-01T00:00:00');

      var processedData = new Array(1440);

      var i,j;
      var start,end;
      var signLookup = {};



      //Loop through add signPlate times, this is when monitoring is happening
      for (i = 0; i < feature.properties.signPlates.length; i++) {

      start = moment(date + 'T' + feature.properties.signPlates[i].StartTime).diff(dataDate, 'minutes');
      end =  moment(date + 'T' + feature.properties.signPlates[i].EndTime).diff(dataDate, 'minutes');

      signLookup['S'+feature.properties.signPlates[i].SignPlateId] = feature.properties.signPlates[i].MinutesAllowed;

      for (j = start; j <= end; j++) {
        processedData[j] = 1;
      }

      }


      //Loop through find each park add data
      for (i = 0; i < feature.properties.sensor.length; i++) {

      //Add to total park events this day
      this.parkingEvents += 1;

      start = moment(feature.properties.sensor[i].arrivalDateTime).diff(dataDate, 'minutes');
      end =  moment(feature.properties.sensor[i].depart).diff(dataDate, 'minutes');


      var status;
      if (feature.properties.sensor[i].inViolation) {
        for ( j = start; j <= end; j++) {
        processedData[j] = 4;
        }

        var timeAllowed = signLookup['S'+feature.properties.sensor[i].signPlateId];

        if (end-start > timeAllowed) {
        for ( j = start; j <= start+ timeAllowed; j++) {
          processedData[j] = 3;
        }
        }

        //Add to total violations this day
        this.parkingViolations += 1;


      } else {
        for ( j = start; j <= end; j++) {
        processedData[j] = 2;
        }
      }

      

      }

      //Loop through and find gaps fill in with unmonitored/free times
      for (j = 0; j <= 1440; j++) {
        if(typeof processedData[j] === 'undefined'){
        processedData[j] = 0;
        }
      }


      this.addParkingSpotToStats(processedData);

      return processedData;
    }


  };

}());