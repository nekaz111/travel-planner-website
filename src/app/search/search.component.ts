import { Component, OnInit, ViewChild, ElementRef, NgZone  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  //starting lat/long/zoom levels for map
  lat = 42.651718;
  lng = -73.755089;
  zoom = 15;
  //address of lat/long
  address: string;
  lis: string;


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
    private ngZone: NgZone
  ) { }

  map;
  service;
  infowindow;


  //initialization procedure
  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      //this.restaurants = ""
      //get user location if tracking is allowed
      this.setCurrentLocation();
      //converts between address and lat/lng
      this.geoCoder = new google.maps.Geocoder;
      //get/let address based on lat/lng
      this.getAddress(this.lat, this.lng)
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
        });
      });

      //var pyrmont = new google.maps.LatLng(42.651718, -73.755089);
      this.infowindow = new google.maps.InfoWindow();
      //this.map = new google.maps.Map(document.getElementById('map'), {
     //   center: pyrmont,
     //   zoom: 15
     // });

      var request = {
        location: {lat: this.lat, lng: this.lng},
        radius: '1000',
        type: ['restaurant']
      };

      this.service = new google.maps.places.PlacesService(document.createElement('div'));
      this.service.nearbySearch(request, this.callback);

    });

  }

  getRestaurantData(latitude, longitude) {


  }


  callback(results, status) {
    let restaurants = "";
    //grab places library values
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      //loop through all values
      for (var i = 0; i < results.length; i++) {
        //var place = results[i];
        //add results to string to be output
        restaurants += "Name: " + results[i].name + "<br>";
        //this.createMarker(results[i]);
      }
      //this.map.setCenter(results[0].geometry.location);
    }
    console.log(restaurants);
    this.list = restaurants;
  }

  //make and place marker on map
  createMarker(place) {
    var marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function () {
      this.infowindow.setContent(place.name);
      this.nfowindow.open(this.map, this);
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
      });
    }
  }

  //read map drag marker data
  markerDragEnd($event: MouseEvent) {
    //console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
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
