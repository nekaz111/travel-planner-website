//noted issue: agm-circle blocks map markers for reason
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { SharedService } from "../dataService";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  message: string;
  //starting lat/long/zoom levels for map
  lat = 42.651718;

  lng = -73.755089;

  zoom = 15;
  //address of lat/long
  address: string;
  list: string;


  //checking if returned values are correct
  onSubmit(form: NgForm) {
    console.log('Your form data : ', form.value);
  }
  //helps in converting lat/long to address
  private geoCoder;

  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private data: SharedService
  ) { }

  map;
  service;
  infowindow;

  updateService = (text: string = this.message) => {
    //this.data.currentMessage.subscribe(message => this.message = message)
    this.data.changeMessage(text);
  }
  //initialization procedure
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      //this.infowindow = new google.maps.InfoWindow();
      //this.restaurants = ""
      //get user location if tracking is allowed
      this.setCurrentLocation();
      //converts between address and lat/lng
      this.geoCoder = new google.maps.Geocoder;
      //get/let address and restaurant data based on lat/lng
      this.getAddress(this.lat, this.lng)
      this.getRestaurantData(this.lat, this.lng)
      //autocomplete text box
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      //autocomplete behavior
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set lat, lng, zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 15;
          //update address
          this.getAddress(this.lat, this.lng)
          this.getRestaurantData(this.lat, this.lng)
        });
      });

      //var pyrmont = new google.maps.LatLng(42.651718, -73.755089);

      //this.map = new google.maps.Map(document.getElementById('map'), {
      //   center: pyrmont,
      //   zoom: 15
      // });


    });

  }
  //gets restaurant data from google places library
  getRestaurantData = (latitude, longitude) =>{
    var request = {
      location: { lat: latitude, lng: longitude },
      radius: '500',
      type: ['restaurant']
    };
    this.service = new google.maps.places.PlacesService(document.createElement('div'));
    
    this.service.nearbySearch(request, this.callback);
    
  }

  ////get place details from library using placeid
  //getDetails(placeID) {
  //  var request = {
  //    placeId: placeID,
  //    fields: ['name', 'formatted_address', 'place_id', 'geometry']
  //  };
  //  this.service.getDetails(request, function (place, status) {
  //    if (status === google.maps.places.PlacesServiceStatus.OK) {

  //      //var marker = new google.maps.Marker({
  //      //  map: map,
  //      //  position: place.geometry.location
  //      //});
  //      //google.maps.event.addListener(marker, 'click', function () {
  //      //infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
  //      //  'Place ID: ' + place.place_id + '<br>' +
  //      //  place.formatted_address + '</div>');
  //      //infowindow.open(map, this);
  //      //});
  //    }
  //  });
  //}

  //callback = (results, status) => {
  callback = (results, status) => {

    document.getElementById("data").innerHTML = "";
    //let restaurants = "";
    //grab places library values
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      //loop through all values
      for (var i = 0; i < results.length; i++) {
        let restaurants = "";
        //var place = results[i];
        //add results to string to be output
        //use placeid to get specific details
        //restaurants += "Name: " + results[i].name + "\n" + "PlaceID: " + results[i].place_id + "\n" + "Coordinates: " + results[i].geometry.location + "\n\n";
        //link for profile page
        restaurants += "Name: " + results[i].name
        
        //this.service = new google.maps.places.PlacesService(document.createElement('div'));
        //this.service.getDetails(results[i], this.callback2)
        var page = document.createElement("div")
        
        if (restaurants == "") {
          document.getElementById("data").innerHTML = "None found"
        }
        else {
          var info = document.createTextNode(restaurants)
          page.appendChild(info)
          page.appendChild(document.createElement("br"))
          //add restaurant info
          page.appendChild(document.createTextNode("Place ID: " + results[i].place_id))
          page.appendChild(document.createElement("br"))
          page.appendChild(document.createTextNode("Rating: " + results[i].rating))
          page.appendChild(document.createElement("br"))
          //get and place image data
          var image = document.createElement("img")
          image.setAttribute('src', results[i].photos[0].getUrl({ 'maxWidth': 300, 'maxHeight': 300 }))
          page.appendChild(image)

          //page.appendChild(document.createTextNode(photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 })))
      


          //create button 
          var button = document.createElement('BUTTON');
          //button.onclick = this.updateService(results[i].place_id)
          //button.setAttribute("onClick", "updateService(" + results[i].place_id + ")");
          var self = this
          //button.addEventListener('click', this.updateService(results[i].place_id));
          //create button text
          var text = document.createTextNode("Profile");
          //append text to button
          button.appendChild(text);
          //append item to html element
          page.appendChild(button)
          page.appendChild(document.createElement("br"))

          document.getElementById("data").appendChild(page)
          document.getElementById("data").appendChild(document.createElement("br"))
        }
        //this.createMarker(results[i]);
      }
      //this.map.setCenter(results[0].geometry.location);
    }
    //console.log(restaurants);
    //output data to HTML
    //no data found
    //not sure why restaurant data seems to be slightly different from google maps contents
    //if (restaurants == "") {
    //  document.getElementById("data").innerHTML = "None found"
    //}
    //display data
    //else {
     // document.getElementById("data").appendChild(page)
      
    //}
  }

  //get place details
  //callback2 = (place, status) =>{
  //  let restaurants = "";
  //  //grab places library values
  //  if (status == google.maps.places.PlacesServiceStatus.OK) {

  //      //var place = results[i];
  //      //add results to string to be output
  //      //use placeid to get specific details
  //    restaurants += "<strong>Name: </strong>" + place.name + "<br>" + "<strong>PlaceID: </strong>" + place.place_id + "<br>" + "<strong>Coordinates: </strong>" + place.geometry.location + "<br>" + "<strong>Address </strong>" + place.formatted_address + "<br><br>";
  //  }
  //  console.log(restaurants);
  //  //output data to HTML
  //  //no data found
  //  //not sure why restaurant data seems to be slightly different from google maps contents
  //  if (restaurants == "") {
  //    document.getElementById("data").innerHTML = "None found"
  //  }
  //  //display data
  //  else {
  //    document.getElementById("data").innerHTML = restaurants
  //  }
  //}


  //make and place marker on map
  createMarker(place) {
    var marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function () {
      this.infowindow.setContent(place.name);
      this.infowindow.open(this.map, this);
    });
  }

  //get current location coordinate
  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15
        this.getAddress(this.lat, this.lng);
        this.getRestaurantData(this.lat, this.lng);
      });
    }
  }

  //read map drag marker data
  markerDragEnd($event: MouseEvent) {
    //console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
    this.getRestaurantData(this.lat, this.lng);
  }

  //gets/sets address given lat/lng values
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 15;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
}
