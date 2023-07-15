import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UserLoggedModel} from "./models/userLogged.model";
import {LoggingService} from "./services/logging.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ManageMe';
  projectId!: string;
  epicId!: string;
  words: string[] = ["projects", "epics", "tasks", "details", "create", "edit"];
  isUserLogged!: boolean;
  userLogged!: UserLoggedModel;
  constructor(private router: Router, private route: ActivatedRoute, private logginService: LoggingService) {

}
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const segments = event.url.split('/').filter(segment => segment !== '');
        if (segments.length > 0 && this.words.includes(segments[0])) {
          this.projectId = '';
        } else {
          this.projectId = segments[0];
        }

        if (segments.length > 1 && this.words.includes(segments[1])) {
          this.epicId = '';
        } else {
          this.epicId = segments[1];
        }
      }
    });

    this.logginService.isUserLogged$.subscribe((isLogged) => {
      this.isUserLogged = isLogged;
    });

    const storageData = localStorage.getItem('userLogged');
    if (storageData) {
      this.userLogged = JSON.parse(storageData);
      this.logginService.setUserLogged(true);
    }
}

logout() {
    if(this.userLogged){
      this.logginService.setUserLogged(false);
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    }
}



}
