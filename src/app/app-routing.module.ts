import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from "./profile/profile.component";
import { SearchComponent } from "./search/search.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from "@angular/platform-browser";

const routes: Routes = [
    { path: '', redirectTo: '/search', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent },
    { path: 'search', component: SearchComponent }
    
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        NgbModule
    ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

