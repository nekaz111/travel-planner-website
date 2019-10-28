import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SharedService } from "../dataService";
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
  
})
export class ProfileComponent implements OnInit {
  message: string;

  service;

  constructor(private data: SharedService,
    private mapsAPILoader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      //this.getRestaurantData();


    });
  }
  updateService = (text: string = this.message) => {
    //this.data.currentMessage.subscribe(message => this.message = message)
    this.data.changeMessage(text);
  }
  //gets restaurant data from google places library
  getRestaurantData() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.866, lng: 151.196 },
      zoom: 15
    });
    var request = {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      fields: ['name', 'formatted_address', 'place_id', 'geometry']
    };
    this.service = new google.maps.places.PlacesService(map);

    this.service.getDetails(request, this.callback);

  }



  callback = (results, status) => {
    //let restaurants = "";
    //grab places library values
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    //loop through all values
      let restaurants = "";
      //var place = results[i];
      //add results to string to be output
      //use placeid to get specific details
      //restaurants += "Name: " + results[i].name + "\n" + "PlaceID: " + results[i].place_id + "\n" + "Coordinates: " + results[i].geometry.location + "\n\n";
      //link for profile page
      document.getElementById("name").innerHTML = "Name: " + results.name
      document.getElementById("rating").innerHTML = "Rating: " + results.rating
      //results[i].photos[]
      //this.service = new google.maps.places.PlacesService(document.createElement('div'));
      //this.service.getDetails(results[i], this.callback2)
    }
  }
}
