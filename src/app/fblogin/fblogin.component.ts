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
  private content: any;
  private hosted: boolean = false;
  private displayResponse: any = "omg-happy-fucked-funny-cunny-sunny-munny-tunny-bunny-any";
  private clinicWebsite: any;
  private connectedID: any;
  private connectEd: boolean = false;
  // private renderPlugin: boolean = false;
  private userWorkHistory: any;
  private doctorId: any;
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
        if (params['clinicWebsite']) {
          this.clinicWebsite = params['clinicWebsite'];
          this.hosted = true;
        }
        this._authService._getDoctorPage(this.clinicId).subscribe(
          pageData => {
            console.log(pageData)
            console.log(pageData.fbPageId);
            this.doctorId = pageData.doctorId;

            this.content = pageData.content;
            this.pageId = pageData.fbPageId;
            if (params['number']) {
              this.online = true;
              this.phNumber = params['number'];
            }
            if (params['connectUID']) {
              this.connectedID = params['connectUID'];
              this.connectEd = true;
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
      alert("Facebook browser detected");
      this._authService.fbApplogin()
      // .then((success) => {
      let path = window.location.origin;
      this.activatedRoute.queryParams
        .subscribe(
        params => {
          let path = window.location.origin;
          let parameters = '?clinicId=' + this.clinicId;

          if (params['pathwayId'])
            parameters = parameters + '&pathwayId=' + params['pathwayId'];
          if (params['itemId'])
            parameters = parameters + '&itemId=' + params['itemId'];


          let parametersJSON = { clinicId: this.clinicId, pathwayId: params['pathwayId'], itemId: params['itemId'], connectUID: params['connectUID'] }
          if (params['next']) {

            this.router.navigate([params['next']], { queryParams: params });

          } else {
            this.router.navigate(['checkupForm/x'], { queryParams: params });

          }
        }
        )
      // })
      // .catch(err => alert(err));
      // // var self = this;
      // //   setTimeout(
      // //     function() {

      // //     let path = window.location.origin;
      // //     self.activatedRoute.queryParams
      // //       .subscribe(
      // //       params => {
      // //          let path = window.location.origin;
      // //           let parameters = '?clinicId=' + self.clinicId;

      // //           if (params['pathwayId'])
      // //             parameters = parameters + '&pathwayId=' + params['pathwayId'];
      // //           if (params['itemId'])
      // //             parameters = parameters + '&itemId=' + params['itemId'];

      // //           // if (params['connectUID']) {
      // //           //   parameters = parameters + '&connectUID=' + params['connectUID'];
      // //           //   this._authService._findCaredOne(this.doctorId, params['connectUID'])
      // //           //     .subscribe(usrData => {
      // //           //       usrData['uid'] = data.uid;
      // //           //       this._authService._saveCaredOne(usrData, this.doctorId)
      // //           //         .then(
      // //           //         tdata => {
      // //           //           this._authService._deleteCaredOne(this.doctorId, params['connectUID']);
      // //           //         });
      // //           //     })
      // //           // }
      // //           let parametersJSON = {clinicId:self.clinicId,  pathwayId: params['pathwayId'], itemId: params['itemId'],connectUID: params['connectUID'] }
      // //         if (params['next']) {


      // //           self.router.navigate([params['next'], { queryParams: parameters}]);

      // //         } else {
      // //           self.router.navigate(['checkupForm/x', { queryParams: parameters}]);

      // //         }
      // //       }
      // //       )
      // //     }, 2000
      //   )



    } else {
      console.log("Regular browser");

      this._authService.clinicFblogin()
        .then(loginData => {
          console.log(loginData);

          this._fs.getLoginStatus().then((response: FacebookLoginResponse) => {
            console.log(response);
            this._fs.api('/' + loginData.uid + '?fields=first_name,last_name,email,education,birthday,work,location,hometown').then(
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


                            if (this.connectEd) {
                              console.log("Connected Id");
                              parameters = parameters + '&connectUID=' + this.connectedID;

                              // parameters = parameters + '&connectUID=' + params['connectUID'];
                              this._authService._findCaredOne(this.doctorId, this.connectedID)
                                .subscribe(usrData => {
                                  console.log(usrData);
                                  if (usrData.firstName) {

                                    usrData['uid'] = loginData.uid;
                                    console.log(usrData);
                                    this._authService._saveCaredOne(usrData, this.doctorId)
                                      .then(
                                      tdata => {
                                        console.log(tdata);

                                        this._authService._getCareSchedule(this.pageId, this.connectedID)
                                          .subscribe(
                                          cs3Data => {
                                            cs3Data['email'] = { status: "sent" };

                                            this._authService._saveCareSchedule(this.pageId, loginData.uid, cs3Data)
                                              .then(
                                              csData => {
                                                this._authService._deleteCareSchedule(this.doctorId, this.connectedID)
                                                  .then(
                                                  cs2Data => {
                                                    this._authService._deleteCaredOne(this.doctorId, this.connectedID)
                                                      .then(
                                                      dumDat => {
                                                        console.log(csData)
                                                        window.location.href = path + '/checkupForm/' + len + parameters;
                                                      })
                                                  }
                                                  )
                                              }
                                              );

                                          }
                                          );
                                      });
                                  } else {
                                    console.log("else cs2Data")
                                    window.location.href = path + '/checkupForm/' + len + parameters;
                                  }

                                })
                            } else {
                              console.log("else else cs2Data")
                              window.location.href = path + '/checkupForm/' + len + parameters;
                            }



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
          this._authService.loginMailUser({ email: "testuser@cureyo.com", password: "password" })
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

                      if (this.connectEd) {
                        console.log("Connected Id");
                        parameters = parameters + '&connectUID=' + this.connectedID;

                        // parameters = parameters + '&connectUID=' + params['connectUID'];
                        this._authService._findCaredOne(this.doctorId, this.connectedID)
                          .subscribe(usrData => {
                            usrData['uid'] = data.uid;
                            this._authService._saveCaredOne(usrData, this.doctorId)
                              .then(
                              tdata => {
                                this._authService._deleteCaredOne(this.doctorId, this.connectedID);
                              });
                          })
                      }


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
