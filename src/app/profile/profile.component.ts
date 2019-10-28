import { Component, OnInit } from '@angular/core';
import { SharedService } from "../dataService";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
  
})
export class ProfileComponent implements OnInit {
  message: string;
  constructor(private data: SharedService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }
  updateService() {
    this.data.changeMessage(this.message);
    //this.data.currentMessage.subscribe(message => this.message = message)
  }
}
