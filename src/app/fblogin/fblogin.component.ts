import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { CheckUpFormComponent } from "../check-up-form/check-up-form.component";
@Component({
  selector: 'app-fblogin',
  templateUrl: './fblogin.component.html',
  styleUrls: ['./fblogin.component.css']
})
export class FbloginComponent implements OnInit {
  private userBday: any;
  private userEducation: any;
  private userHomeTown: any;
  private userLocation: any;
  private clinicId: any;
  private userWorkHistory: any;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fs: FacebookService
  ) { }

  ngOnInit() {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.6'
    };
    this._fs.init(fbParams);

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
  }
  clinicFbLogin() {
    this._authService.clinicFblogin()
      .then(data => {
        this._fs.getLoginStatus().then((response: FacebookLoginResponse) => {
          console.log(response);
          this._fs.api('/' + data.auth.providerData[0].uid + '?fields=education,birthday,work,location,hometown').then(
            userData => {
              //service to save the data into the firebase
              
              var date = new Date();
              var dd = date.getDate();
              var mm = date.getMonth();
              var yyyy = date.getFullYear();
              var date2 = dd + '-' + mm + '-' + yyyy;

              this._authService._getNoOfCheckIns(this.clinicId, date2)
                .subscribe(
                data => {

                  let len = 0;
                 
                  if ( data.$value && data.$value == null ) { }
                  else {len = data.length;}
                  
                  console.log("length is ", len);
                   console.log("facebook data:",userData);
                  this._authService._saveCheckIn(this.clinicId, date2, userData.id, len);
                  
                  this._authService._getDoctorPage(this.clinicId).subscribe(
                    pageData => {
                      console.log("just being to call the saveCheckInData");
                     // this._authService. _saveFbDataInsights(userData,userData.id,pageData.doctorId);
                      this._authService._saveCheckInData(pageData.doctorId, userData.id, userData)
                    });
                  //end of save data part
                  //from here control goes to checkup form
                  this.router.navigate(['checkupForm']);
                }
                );

            });
        })


      }

      );
  }

}
