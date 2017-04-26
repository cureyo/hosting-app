import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
// declare var HumanConnect: any;
@Component({
  templateUrl: 'doctor-login.component.html',
  selector: 'doctor-login-cmp',
  moduleId: module.id
})
export class DoctorLoginComponent implements OnInit {

  private user: {};
  private isAuth: boolean;
  private showVid: boolean = false;
  private otpAsked: boolean = false;
  private OTPMismatch: boolean = false;
  private otp: FormGroup;

  public OTPcode: any = (Math.floor((Math.random() * 10000) + 1)).toString();

  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  $.getScript('https://connect.humanapi.co/connect.js');

    // this._authService.logout();

    // this._authService._getUser()
    //   .subscribe(
    //   data => {
    //     if (!data.isAuth) {
    //       //window.location.href = window.location.origin + '/login?next=' + window.location.pathname;
    //     } else {
    //       this.isAuth = data.isAuth;
    //       this.user = data.user;
    //       this._authService._fetchDocUser(data.user.uid)
    //         .subscribe(res => {
    //           console.log("from login: ");
    //           console.log(res);
    //           if (res.hasOwnProperty('authUID')) {
    //             this.activatedRoute.queryParams
    //               .subscribe(params => {
    //                 console.log("query parameters");
    //                 console.log(params);
    //                 if (params['next']) {
    //                   window.location.href = window.location.origin + params['next'];
    //                 } else {
    //                   window.location.href = window.location.origin + '/dashboard';
    //                 }
    //               });

    //           } else {
    //             this.router.navigate(['doctor-checkup']);

    //           }

    //         })
    //     }
    //   },
    //   error => console.log(error)
    //   );
  }

  // doclogin(provider) {

  //   console.log("Regular browser");
  //   this._authService.doclogin();
  //   console.log("rerouting from login(provider)")

  // }
  // showVideo() {
  //   this.showVid = !this.showVid;
  // }

  sendOTP() {

    console.log(window.location);
    var str = window.location.hostname;
    console.log(str);
    var n = str.indexOf(".");
    if (n == -1) {
      n = str.length;
    }
    console.log(n);
    var res = str.substring(0, n);
    console.log("location", res);
    this._authService._GetDoctorDetails(res)
      .subscribe(
      docData => {
        let docPhone = docData.drPhone;
        let docEmail = docData.drEmail;
        let docPwd = docData.drPwd;
        console.log(docPhone, docPwd, docEmail);
        console.log(docPhone);


        console.log("OTP Sent", this.OTPcode)
        this._authService._RequestOTP(docPhone, this.OTPcode);
        this.otp = this._fb.group({
          otp: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
          phone: docPhone,
          email: docEmail,
          password: docPwd
        });
        this.otpAsked = true;
      }
      )




  }
  onSubmit(model) {
    this._authService._UpdateOTP(model['phone']);
    this._authService.loginMailUser({ email: model['email'], password: model['password'] });
    this.activatedRoute.params.subscribe(
      params => {
        let param = params['id'];
        this.router.navigate(['consultation/' + param]);
      });
  }
  validateOTP(control) {
    console.log(control);
    console.log(this.OTPcode);
    console.log(control.value)
    return false;
    // var validOTP = this.OTPcode;

    // if (control.value == this.OTPcode) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
  otpCheck(model) {
    if (model['otp'] != this.OTPcode) {
      return true;
    } else {
      return false;
    }
  }
//   hAPIConnect() {
//      var options = {
//  clientUserId: encodeURIComponent('UNIQUE_ID_FOR_YOUR_USER'),
//  clientId: 'd2dbdf5f1894105f6ab1857898b50d672649eb36',
//  publicToken: '',
//  finish: function(err, sessionTokenObject) {
//    /* Called after user finishes connecting their health data */
//    //POST sessionTokenObject as-is to your server for step 2.
 
//    // Include code here to refresh the page.
//  },
//  close: function() {
//      /* (optional) Called when a user closes the popup
//         without connecting any data sources */
//  },
//  error: function(err) {
//      /* (optional) Called if an error occurs when loading
//         the popup. */
//  }
// }
// HumanConnect.open(options);
//   }
}