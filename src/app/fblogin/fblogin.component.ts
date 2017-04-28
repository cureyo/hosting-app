import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';

@Component({
  selector: 'app-fblogin',
  templateUrl: './fblogin.component.html',
  styleUrls: ['./fblogin.component.css']
})
export class FbloginComponent implements OnInit {
  private userBday:any;
  private userEducation:any;
    private userHomeTown:any;
      private userLocation:any;
        private userWorkHistory:any;
  
  constructor(
            private _authService: AuthService,
            private router: Router, 
            private activatedRoute: ActivatedRoute,
            private _fs:FacebookService
             ) { }

  ngOnInit() {
      let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.6'
    };
    this._fs.init(fbParams);
  }
  clinicFbLogin(){
    this._authService.clinicFblogin()
    .then( data=>{
      this._fs.getLoginStatus().then((response: FacebookLoginResponse) => {
        console.log(response);
          this._fs.api('/' + data.auth.providerData[0].uid + '?fields=education,birthday,work,location,hometown' ).then(
        userData => {
          console.log("facebook response data",userData);
        });
      })
     
    
    }

    );
  }

}
