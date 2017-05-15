import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/firebaseauth.service";
//import {MedReminder} from "../../../models/medReminder.interface";
import { Http, Response, Headers } from '@angular/http';
import { FbService } from "../services/facebook.service";
import { AppConfig } from '../config/app.config';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { DomSanitizer } from '@angular/platform-browser';

declare var jQuery: any;
declare var $: any;
declare var HumanConnect: any;
@Component({
  selector: 'app-check-up-form',
  templateUrl: './check-up-form.component.html',
  //styleUrls: ['./check-up-form.component.css']
})
export class CheckUpFormComponent implements OnInit {
  public checkUpForm: FormGroup;
  private userId: any;
  private DoctorId: any;
  private userData: any
  private birthdate: string;
  private fname: any;
  private uid: any;
  private lname: any;
  private email: any;
  private phone: any;
  private formSaved: boolean = false;
  private formReady: boolean = false;
  private hasSym: boolean = false;
  private symptoms: any = [];
  private clinicId: any;
  private userFBId: any = "FBID_";
  private appId: any = "1133564906671009";
  private pageURL: any = "http://login.localhost:4200/";
  private pageId: any;
  private fbReady: boolean = false;
  private fbURL: any;
  private publicToken: any;

  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private fs: FacebookService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: Http
  ) {


  }

  ngOnInit() {



    $.getScript('https://connect.humanapi.co/connect.js');
    this.pageURL = window.location.origin;
    this._authService._getHxFormNames()
      .subscribe(data => {
        console.log(data)
        let ctr = 1;
        this.symptoms[0] = { id: "NA", name: "None of these" };
        for (let sym in data) {
          console.log(sym)
          if (sym != '$key' && sym != '$exists') {
            this.symptoms[ctr] = { id: sym, name: data[sym].path };
            ctr++;
          }
        }
        console.log(this.symptoms)
        this.hasSym = true;
      })

    this.route.queryParams.subscribe(
      param => {
        console.log(param);
        this.userId = param['userId']
        console.log("userid is :", this.userId);
        var res = this.clinicId = param['clinicId']
        console.log("for clinicId: ", res)
        this._authService._getDoctorId(res)
          .subscribe(data => {
            this.DoctorId = data.$value;
            console.log("the doctor id is ", this.DoctorId);

            this._authService._getcaredOnesDetails(this.DoctorId, this.userId)
              .subscribe(user => {

                if (user.firstName) {

                  this.userId = user.uid;
                  this.uid = user.uid;
                  if (user.Job_conditions) {
                    this.checkUpForm = this._fb.group({
                      first_Name: [user.firstName, Validators.required],
                      last_Name: [user.lastName, Validators.required],
                      Email: [user.email, Validators.required],
                      phone: [user.phone, Validators.required],
                      DOB: [user.dateOfBirth],
                      visit_Type: ['followupconsultation', Validators.required],
                      description: [, Validators.required],
                      insurance: [user.insurance, Validators.required],
                      primeSymptom: [],
                      sex: [user.gender, Validators.required],
                      conditions: this._fb.array([
                        this.initExistingConditions(user.Job_conditions[0])
                      ])
                    });
                    let control = <FormArray>this.checkUpForm.controls['conditions'];
                    console.log(user.Job_conditions);
                    for (let item in user.Job_conditions) {

                      if (item != '0' && item != '$exists' && item != '$key') {
                        console.log(item);
                        control.push(this.initExistingConditions(user.Job_conditions[item]))
                      }
                    }
                    this.birthdate = user.dateOfBirth.replace('/', '-');
                    this.publicToken = user.humanApiPT
                    console.log("this.birthdate", this.birthdate);
                    this._authService._getfbPageId(res)
                      .subscribe(
                      data => {
                        this.pageId = data.$value;
                        //this.pageId = "164483500652387";
                        this.userFBId = "FacbkId_" + this.userId;
                        let fburl = "https://www.facebook.com/v2.3/plugins/send_to_messenger.php?messenger_app_id=" + this.appId + "&page_id=" + this.pageId + "&ref=" + this.userFBId;
                        console.log(this.pageId);
                        this.fbReady = true;
                        this.fbURL = this.sanitizer.bypassSecurityTrustResourceUrl(fburl)
                        console.log(this.fbURL);
                        this.formReady = true;
                      }
                      )

                  }
                  else {
                    this.checkUpForm = this._fb.group({
                      first_Name: [user.firstName, Validators.required],
                      last_Name: [user.lastName, Validators.required],
                      Email: [user.email, Validators.required],
                      phone: [user.phone, Validators.required],
                      DOB: [user.dateOfBirth],
                      visit_Type: ['followupconsultation', Validators.required],
                      description: [, Validators.required],
                      insurance: [user.insurance, Validators.required],
                      primeSymptom: [],
                      sex: [user.gender, Validators.required],
                      conditions: this._fb.array([
                        this.initConditions()
                      ])
                    });
                    this.birthdate = user.dateOfBirth.replace('/', '-');
                    this.publicToken = user.humanApiPT
                    console.log("this.birthdate", this.birthdate);
                    this._authService._getfbPageId(res)
                      .subscribe(
                      data => {
                        this.pageId = data.$value;
                        //this.pageId = "164483500652387";
                        this.userFBId = "FacbkId_" + this.userId;
                        let fburl = "https://www.facebook.com/v2.3/plugins/send_to_messenger.php?messenger_app_id=" + this.appId + "&page_id=" + this.pageId + "&ref=" + this.userFBId;
                        console.log(this.pageId);
                        this.fbReady = true;
                        this.fbURL = this.sanitizer.bypassSecurityTrustResourceUrl(fburl)
                        console.log(this.fbURL);
                        this.formReady = true;
                      }
                      )
                  }
                } else {
                  this._authService._getUserDataFromCaredOnePatientInsights(this.userId, this.DoctorId)
                    .subscribe(res => {
                      console.log(res);
                      if (res.birthday) {
                            this.birthdate = res.birthday;
                      this.userId = res.id;
                      this.email = res.email;
                      this.fname = res.first_name;
                      this.lname = res.last_name;
                      this.uid = res.id;

                      //convert the mm-dd-yyyy to yyyy-mm--dd
                      var nMonth = this.birthdate.indexOf('/');
                      var month = this.birthdate.substring(0, nMonth);
                      var len = this.birthdate.length;
                      var birthday2half = this.birthdate.substring(nMonth + 1, len);
                      var nDate = birthday2half.indexOf('/');
                      var date = birthday2half.substring(0, nDate);
                      var len2 = birthday2half.length;
                      var year = birthday2half.substring(nDate + 1, len2);
                      this.birthdate = year + "-" + month + "-" + date;
                      console.log(this.birthdate)
                      this.publicToken = '';
                      this.checkUpForm = this._fb.group({
                        first_Name: [this.fname, Validators.required],
                        last_Name: [this.lname, Validators.required],
                        Email: [this.email, Validators.required],
                        phone: [, Validators.required],
                        DOB: [this.birthdate],
                        visit_Type: [, Validators.required],
                        description: [, Validators.required],
                        insurance: [, Validators.required],
                        primeSymptom: [, Validators.required],
                        sex: [, Validators.required],
                        conditions: this._fb.array([
                          this.initConditions()
                        ])
                      });
                      this._authService._getfbPageId(res)
                        .subscribe(
                        data => {
                          this.pageId = data.$value;
                          //this.pageId = "164483500652387";
                          this.userFBId = "FacbkId_" + this.userId;
                          let fburl = "https://www.facebook.com/v2.3/plugins/send_to_messenger.php?messenger_app_id=" + this.appId + "&page_id=" + this.pageId + "&ref=" + this.userFBId;
                          console.log(this.pageId);
                          this.fbURL = this.sanitizer.bypassSecurityTrustResourceUrl(fburl)
                          console.log(this.fbURL);
                          this.formReady = true;
                        }
                        )

                    
                      } else {
                   
                      this.publicToken = '';
                      this.checkUpForm = this._fb.group({
                        first_Name: ['', Validators.required],
                        last_Name: ['', Validators.required],
                        Email: ['', Validators.required],
                        phone: [, Validators.required],
                        DOB: [''],
                        visit_Type: [, Validators.required],
                        description: [, Validators.required],
                        insurance: [, Validators.required],
                        primeSymptom: [, Validators.required],
                        sex: [, Validators.required],
                        conditions: this._fb.array([
                          this.initConditions()
                        ])
                      });
                      this._authService._getfbPageId(res)
                        .subscribe(
                        data => {
                          this.pageId = data.$value;
                          //this.pageId = "164483500652387";
                          this.userFBId = "FacbkId_" + this.userId;
                          let fburl = "https://www.facebook.com/v2.3/plugins/send_to_messenger.php?messenger_app_id=" + this.appId + "&page_id=" + this.pageId + "&ref=" + this.userFBId;
                          console.log(this.pageId);
                          this.fbURL = this.sanitizer.bypassSecurityTrustResourceUrl(fburl)
                          console.log(this.fbURL);
                          this.formReady = true;
                        }
                        )

                    
                      }
                  })
                }
              });

          }
          )



      });
  }
  initExistingConditions(data) {
    console.log(data);
    return this._fb.group({
      conditionsOption: data.conditions_option,
      since: data.Since
    })

  }
  initConditions() {

    return this._fb.group({
      conditionsOption: [],
      since: [],
      //  when:[,Validators.required],
    });
  }//initLabTest's
  AddConditions() {

    console.log("Add conditions called");
    const control = <FormArray>this.checkUpForm.controls['conditions'];
    control.push(this.initConditions());

  }//addLabTest

  getSrcURL() {
    let fburl = "https://www.facebook.com/v2.3/plugins/send_to_messenger.php?messenger_app_id=" + this.appId + "&page_id=" + this.pageId + "&ref=" + this.userFBId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fburl)

  }
  save_checkUpForm = (model) => {
    console.log("save_checkUpForm called");

    let job = model['value'],
      conditions = job['conditions'],
      ctr = 0,
      flag;
    console.log(job);
    let reminders = {
      "firstName": job['first_Name'],
      "lastName": job['last_Name'],
      "gender": job['sex'],
      "email": job['Email'],
      "phone": job['phone'],
      "dateOfBirth": job['DOB'],
      "visitType": job['visit_Type'],
      "description": job['description'],
      "avatar": "https://graph.facebook.com/" + this.uid + "/picture?type=large",
      "uid": this.uid,
      "primeSymptom": job['primeSymptom'],
      "Job_conditions": [],
      "insurance": job['insurance'],
      "humanApiPT": this.publicToken
    };

    console.log("conditions data test ::", conditions);
    for (let i = 0; i < conditions.length; i++) {
      reminders.Job_conditions.push({
        "conditions_option": conditions[i].conditionsOption,
        "Since": conditions[i].since,
        // "When" : conditions[i].when,

      });
    }

    console.log("reminder value test ::", reminders);
    this.formSaved = true;
    this.route.params.subscribe(
      params => {
        let param = params['count']
        this._authService._saveCheckUpFormHosting(reminders, this.userId, this.DoctorId).then(
          data => {
            this._authService._saveCaredOne(reminders, this.DoctorId)
              .then(
              data2 => {
                console.log(data)
                if (reminders['primeSymptom'] == "NA" || !reminders['primeSymptom']) {
                  //this.router.navigate(['queue/' + param + '/' + this.userId], { queryParams: { triaged: false } });
                  var str = window.location.hostname;
                  var n = str.indexOf(".");
                  var m = str.length;
                  var clinicId = str.substring(0, n);
                  var host = str.substring(n, m);
                  console.log(host);
                  if (host == '.localhost') {

                    window.location.href = 'http://' + this.clinicId + host + ':4200' + '/queue/' + param + '/' + this.userId + '?triaged=false';
                  } else {
                    window.location.href = 'http://' + this.clinicId + host + '/queue/' + param + '/' + this.userId + '?triaged=false';
                  }
                }

                else {
                  //this.router.navigate(['medical-history/' + param + '/' + reminders['primeSymptom'] + '/' + this.userId]) 
                  var str = window.location.hostname;
                  var n = str.indexOf(".");
                  var m = str.length;
                  var clinicId = str.substring(0, n);
                  var host = str.substring(n, m);
                  console.log(host);
                  if (host == '.localhost') {

                    window.location.href = 'http://' + this.clinicId + host + ':4200' + '/medical-history/' + param + '/' + reminders['primeSymptom'] + '/' + this.userId;
                  } else {
                    window.location.href = 'http://' + this.clinicId + host + '/medical-history/' + param + '/' + reminders['primeSymptom'] + '/' + this.userId;
                  }
                }

              }
              )
          }
        )
      });
  }



  initFB() {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9'
    };
    this.fs.init(fbParams);
    this.fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        //console.log(response.status);
      },
      (error: any) => console.error(error)
    );
  }// initFB()

  hAPIConnect() {
    //var request = require('request');
    
    let self = this;
    console.log(encodeURIComponent(self.userId));
    var options = {
      clientUserId: encodeURIComponent(self.userId),
      clientId: 'd2dbdf5f1894105f6ab1857898b50d672649eb36',
      publicToken: this.publicToken,
      finish: function (err, sessionTokenObject) {
        /* Called after user finishes connecting their health data */
        console.log(sessionTokenObject)
        sessionTokenObject['clientSecret'] = "21ee8e8ce1410c3f6ff6ea6171aa4f88b1fca3fe";
        self._authService._saveHumanAPIData(sessionTokenObject, self.userId)
          .then(
          res => {
            console.log(res);
          //   let headers = new Headers();
          //   headers.append('Content-Type','application/json')
          // //headers.append('clientSecret', '21ee8e8ce1410c3f6ff6ea6171aa4f88b1fca3fe');
          // console.log(sessionTokenObject, headers);
          //   self.http.post('https://user.humanapi.co/v1/connect/tokens', sessionTokenObject, {
          //     headers: headers
          //   })
          //     .subscribe(
          //     humanToken => {
          //       console.log(humanToken)
          //     }
          //     );
          }
          )
      },
      close: function () {
        /* (optional) Called when a user closes the popup
           without connecting any data sources */
      },
      error: function (err) {
        /* (optional) Called if an error occurs when loading
           the popup. */
      }
    }
    console.log(options);
    HumanConnect.open(options);
  }
}
