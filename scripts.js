// arry of locations 
var initialLocs = [
{
	name : 'Fit Forever Fitness',
	lat: 24.816868,
	lng :46.645455,
	marker:null
},
{
	name : 'Coffee Day',
	lat: 24.717861,
	lng :46.674474,
	marker:null
},
{
	name : 'Elixir Bunn Coffee Roasters',
	lat: 24.734442,
	lng : 46.611251,
	marker:null
},
{
	name : 'Danube Hittin',
	lat: 24.754334, 
	lng : 46.609930,
	marker:null
},
{
	name : 'Tamkeen Technologies',
	lat: 24.708316,
	lng : 46.678583,
	marker:null
},

];
var CLIENT_ID = "";

var CLIENT_SECRET ="";

//---this function get category of a location from fourSqure api ---
function getmoredata(location, marker, infowindow){
      // Ajax to load data from FourSqure Api - get the category of location
      var infoContent ="";

      var lat = location.lat;
      var lng = location.lng;
    $.ajax({
      method: "GET",
      dataType:"json",
      url: "https://api.foursquare.com/v2/venues/search",
      data: 'limit=1' +
      '&ll='+ lat +','+ lng +
      '&client_id='+ CLIENT_ID +
      '&client_secret='+ CLIENT_SECRET+
      '&v=20161016',
      success: function (data) {
        var result = data.response.venues[0];
       // check the categories Array's length before accessing the first item at index 0
        if(result.categories.length > 0){
         infoContent = result.categories[0].name;
       }
       else {
        infoContent = "unable to get data";
      }


       infowindow.setContent(location.name + "\n Category : "+ infoContent);
       infowindow.open(map, marker);
  },
  //---Error Handling---
  error: function (e) {
  document.getElementById("message").innerHTML = "<h5>Loading seems to be taking a while.Try again</h5>";

  }
  });
 
}
// Create a map variable
var map;
//---Google Maps API---
// Function to initialize the map within the map div
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 24.713705, lng: 46.676992},
  zoom: 12
  });
  var infowindow = new google.maps.InfoWindow();
  var marker, i;
  function markerClickHandler(marker,i){
     return function() {
      //Markers animate and window open when clicked
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 750);
      //---Additional Location Data---
       getmoredata(initialLocs[i], this, infowindow);
     };
  }
  for (i = 0; i < initialLocs.length; i++) {  
  //---Map and Markers---
  marker = new google.maps.Marker({
  position: new google.maps.LatLng(initialLocs[i].lat, initialLocs[i].lng),
  map: map
  });
  initialLocs[i].marker = marker;

    //console.log(marker);

    //  an EVENT LISTENER so that the infowindow opens when
    // the marker is clicked!
    google.maps.event.addListener(marker, 'click', markerClickHandler(marker, i));
  }
  ko.applyBindings(new ViewModel());

}
//

mapError = () => {
  // Error handling for map
  console.log('gggg');
    document.getElementById("message").innerHTML = "<h5>Error connecting to google map</h5>";

};
//---Use of Knockout---
// location object 
var Location = function(data){
this.name = ko.observable(data.name);
this.lat= ko.observable(data.lat);
this.lng= ko.observable(data.lng);
this.marker = data.marker;

};


// viewModel
var ViewModel = function() {
	var self = this;
	//set search textInput as observable
	this.search = ko.observable('');
	//current location 

	
	// creating observableArray of locationList from an exixsting location Array
	this.locationList = ko.observableArray([]);
	initialLocs.forEach(function(locationItem){
		self.locationList.push(new Location(locationItem));
	});
	//Clicking a location on the list displays windoinfo about the location, and animates its associated in map 
	this.setLoc =function(clickedLoc){
		
		google.maps.event.trigger(clickedLoc.marker, 'click');
	};
	//---Filter Locations---
	//using computed  observables that ependent on var filter which is observables
  	this.filteredLocationList = ko.computed(function() {
  		var filter = self.search().toLowerCase();
        //console.log(filter);
   
        
        	return ko.utils.arrayFilter(this.locationList(), function(item) {
             var result =(item.name().toLowerCase().indexOf(filter) !== -1) ;
             console.log(item);
              item.marker.setVisible(result);
              return result;
        });
 
    }, this);
};




