import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";

@Component({
  templateUrl: 'login.component.html',
  selector: 'login-cmp',
  moduleId: module.id
})
export class LoginComponent implements OnInit {

  private user: {};
  private isAuth: boolean;
  private showVid: boolean = false;
  private otpAsked: boolean = false;
  private OTPMismatch: boolean = false;
  private otp: FormGroup;

  public OTPcode: any = (Math.floor((Math.random() * 10000) + 1)).toString();

  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {


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
    
    this.activatedRoute.params.subscribe(
      params => {
        let param = params['id'];
        this._authService._GetConsultIds(param)
          .subscribe(
          data => {
            
            
            console.log("OTP Sent", this.OTPcode)
            this._authService._RequestOTP(data.phone, this.OTPcode);
            this.otp = this._fb.group({
              otp: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4) ]],
              phone: data.phone,
              email: data.email,
              password: data.setupPassword
            });
            this.otpAsked = true;
          });
      });


  }
  onSubmit(model) {
    this._authService._UpdateOTP(model['phone']);
    this._authService.loginMailUser({email: model['email'], password: model['password']});
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
}