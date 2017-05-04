import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';

@Component({
  selector: 'app-queue-counter',
  templateUrl: './queue-counter.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class QueueCounterComponent implements OnInit {
  private userBday: any;
  private userEducation: any;
  private userHomeTown: any;
  private userLocation: any;
  private clinicId: any;
  private userWorkHistory: any;
  private currentToken: any;
  private userToken: any;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fs: FacebookService
  ) { }

  ngOnInit() {
       var str = window.location.hostname;
    console.log(str);
    var n = str.indexOf(".");
    if (n == -1) {
      n = str.length;
    }
    console.log(n);
    var res = str.substring(0, n);
    console.log("location", res);
    this.clinicId = res;
    this.activatedRoute.params.subscribe(
        params => {
            let param = params['count'];
            this.userToken = param;
            var date = new Date();
              var dd = date.getDate();
              var mm = date.getMonth();
              var yyyy = date.getFullYear();
              var date2 = dd + '-' + mm + '-' + yyyy;
    this._authService._getCheckIn(this.clinicId, date2)
    .subscribe(
        data => {
            console.log(data);
            
            if (data.$value == null) {
                this.currentToken = 0;
            } else {
                this.currentToken = data.$value;
            }
        }
    );
    }
    )
  }

}
