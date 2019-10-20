import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  lat = 42.651718;
  lng = -73.755089;
  constructor() { }

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
      console.log('Your form data : ', form.value);
  }
}
