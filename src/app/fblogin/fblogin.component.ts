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
  private online: boolean = false;
  private phNumber: any;
  private hosted: boolean = false;
  private clinicWebsite: any;
  // private renderPlugin: boolean = false;
  private userWorkHistory: any;
  // private userFBId: any = "FBID_";
  // private appId: any = "1133564906671009";
  // private pageURL: any= "http://login.localhost:4200/";

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
        if (params['clinicWebsite'])
        {this.clinicWebsite = params['clinicWebsite'];
      this.hosted = true;}
        this._authService._getDoctorPage(this.clinicId).subscribe(
        pageData => {
          console.log(pageData)
          console.log(pageData.fbPageId);
          this.pageId = pageData.fbPageId;
          if(params['number']) {
            this.online = true;
            this.phNumber = params['number'];
          }
          // this.userFBId = Math.floor((Math.random() * 10000000000000) + 1);
          // this.renderPlugin = true;
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
    if (window.navigator.userAgent.indexOf("FBAN") > -1 || window.navigator.userAgent.indexOf("FBAV") > -1) {
      console.log("Facebook browser detected");
      this._authService.fbApplogin()
      .then(data => alert(data))
      .catch(err => alert(err));
      let path = window.location.origin;
      this.activatedRoute.queryParams
      .subscribe(
        params => {
          if (params['next']) {
            let path = window.location.origin;
            let parameters = '?clinicId=' + this.clinicId;

            if ( params['pathwayId'])
            parameters = parameters + '&pathwayId='+ params['pathwayId'];
            if ( params['itemId'])
            parameters = parameters + '&itemId='+ params['itemId'];

            window.location.href = path + params['next'] + parameters;
          }
        }
      )
                          

    } else {
      console.log("Regular browser");
      
    this._authService.clinicFblogin()
      .then(data => {
        console.log(data);
        
        this._fs.getLoginStatus().then((response: FacebookLoginResponse) => {
          console.log(response);
          this._fs.api('/' + data.user.providerData[0].uid + '?fields=first_name,last_name,email,education,birthday,work,location,hometown').then(
            userData => {
              //service to save the data into the firebase
              console.log(userData);

              var date = new Date();
              var dd = date.getDate();
              var mm = date.getMonth() + 1;
              var yyyy = date.getFullYear();
              let ddStr, mmStr;
              if (dd < 10) 
              ddStr = "0" + dd;
              else
              ddStr = dd;

              if (mm < 10)
              mmStr = "0" + mm;
              else 
              mmStr = mm;

              var date2 = mmStr + '-' + ddStr + '-' + yyyy;

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
                          this._authService._saveCheckIn(this.clinicId, date2, userData.id, len);
                          let path = window.location.origin;
                          let parameters = '?userId=' + userData.id + '&clinicId=' + this.clinicId;

                          if (this.online == true)
                          parameters = parameters + '&number=' + this.phNumber;

                          if (this.hosted == true)
                          parameters = parameters + '&clinicWebsite=' + this.clinicWebsite;
                          console.log(path);
                         
                          window.location.href = path + '/checkupForm/' + len + parameters;
                         
                          //this.router.navigate(['checkupForm/' + len], { queryParams: { userId: userData.id, clinicId: this.clinicId } } )
                         
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


      },
      error => {
                console.log(error);
      this._authService.loginMailUser({email: "testuser@cureyo.com", password: "password"})
      .catch(
      error => {
         var date = new Date();
              var dd = date.getDate();
              var mm = date.getMonth();
              var yyyy = date.getFullYear();
               let ddStr, mmStr;
              if (dd < 10) 
              ddStr = "0" + dd;
              else
              ddStr = dd;

              if (mm < 10)
              mmStr = "0" + mm;
              else 
              mmStr = mm;

              var date2 = mmStr + '-' + ddStr + '-' + yyyy;

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
                  //console.log("facebook data:", userData);
                  var tempUserId = Math.floor((Math.random() * 1000000000) + 1);
                  console.log(this.clinicId)
                  this._authService._getDoctorPage(this.clinicId).subscribe(
                    pageData => {
                      console.log(pageData.content.doctorId);

                     
                          console.log("_saveCheckInData", data)
                          this._authService._saveCheckIn(this.clinicId, date2, tempUserId, len);
                          let path = window.location.origin;

                          console.log(path);
                             let parameters = '?userId=' + tempUserId + '&clinicId=' + this.clinicId;
                          
                          if (this.online == true)
                          parameters = parameters + '&number=' + this.phNumber;

                          if (this.hosted == true)
                          parameters = parameters + '&clinicWebsite=' + this.clinicWebsite;
                          console.log(path);
                         
                          window.location.href = path + '/checkupForm/' + len + parameters;
                         
                          //this.router.navigate(['checkupForm/' + len], { queryParams: { userId: userData.id, clinicId: this.clinicId } } )
                         
                       

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
      //   this._authService.login(provider);
      // console.log("rerouting from login(provider)")
    }
      }

      
 

}
