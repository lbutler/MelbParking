(function() {

	var currentDate = new Date(2014, 0, 1, 0, 0, 0);

  MELBPARKING.Map.init();
  MELBPARKING.D3LeafletLayer.init(currentDate);

}());