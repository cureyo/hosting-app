import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { CheckUpFormComponent } from "../check-up-form/check-up-form.component";
@Component({
  selector: 'app-fblogin',
  templateUrl: './fblogin.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class FbloginComponent implements OnInit {
  private userBday: any;
  private userEducation: any;
  private userHomeTown: any;
  private userLocation: any;
  private clinicId: any;
  private pageId: any;
  private renderPlugin: boolean = false;
  private userWorkHistory: any;
  private userFBId: any = "FBID_";
  private appId: any = "1133564906671009";
  private pageURL: any= "http://login.localhost:4200/";

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
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.clinicId = params['clinicId'];
        this._authService._getDoctorPage(this.clinicId).subscribe(
        pageData => {
          console.log(pageData)
          console.log(pageData.fbPageId);
          this.pageId = pageData.fbPageId;
          this.userFBId = Math.floor((Math.random() * 10000000000000) + 1);
          this.renderPlugin = true;
        });

      }
      
    )
    // var str = window.location.hostname;
    // console.log(str);
    // var n = str.indexOf(".");
    // if (n == -1) {
    //   n = str.length;
    // }
    // console.log(n);
    // var res = str.substring(0, n);
    // console.log("location", res);
    // this.clinicId = res;
    
  }
  clinicFbLogin() {
    this._authService.clinicFblogin()
      .then(data => {
        console.log(data);
        this._fs.getLoginStatus().then((response: FacebookLoginResponse) => {
          console.log(response);
          this._fs.api('/' + data.auth.providerData[0].uid + '?fields=first_name,last_name,email,education,birthday,work,location,hometown').then(
            userData => {
              //service to save the data into the firebase
              console.log(userData);

              var date = new Date();
              var dd = date.getDate();
              var mm = date.getMonth();
              var yyyy = date.getFullYear();
              var date2 = dd + '-' + mm + '-' + yyyy;

              this._authService._getNoOfCheckIns(this.clinicId, date2)
                .subscribe(
                data => {

                  let len = 0;

                  if ((data.$value && data.$value == null) || data['undefined']) {
                    console.log("no item", data);
                    len = 0;
                  }
                  else if (data.length) {
                    console.log("item", data);
                    len = data.length;
                  }

                  console.log("length is ", len);
                  console.log("facebook data:", userData);

                  console.log(this.clinicId)
                  this._authService._getDoctorPage(this.clinicId).subscribe(
                    pageData => {
                      console.log(pageData.content.doctorId);

                      console.log(userData)
                      console.log(pageData.content.doctorId);
                      this._authService._saveCheckInData(pageData.content.doctorId, userData.id, userData)
                        .then(
                        data => {
                          console.log("_saveCheckInData", data)

                          var str = window.location.hostname;
                          var n = str.indexOf(".");
                          var m = str.length;
                          var clinicId = str.substring(0, n);
                          var host = str.substring(n, m);
                          console.log(host);
                          this._authService._saveCheckIn(this.clinicId, date2, userData.id, len);
                          if (host == '.localhost') {

                            window.location.href = 'http://' + this.clinicId + host + ':4200' + '/checkupForm/' + len + '?userId=' + userData.id;
                          } else {
                            window.location.href = 'http://' + this.clinicId + host + '/checkupForm/' + len + '?userId=' + userData.id;
                          }
                        });

                      //
                      //this.router.navigate(['checkupForm/' + len]);


                      // )

                    });
                  //end of save data part
                  //from here control goes to checkup form

                }
                );

            });
        })


      }

      );
  }

}
