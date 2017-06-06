import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class FeedbackComponent implements OnInit {
  private userBday: any;
  private userEducation: any;
  private userHomeTown: any;
  private userLocation: any;
  private clinicId: any;
  private userId: any;
  private userWorkHistory: any;
  private currentToken: any;
  private userToken: any;
  private feedbackForm: FormGroup;
  private formQuestions: any = [];
  private formOps: any = [];
  private formDep: any = [];
  private formType: any = [];
  private symptoms: any;
  private formReady: boolean = false;
  private diagnosisStarted: boolean = false;
  private questionText: any;
  private questionArray: any = [];
  private buttonHidden: boolean = false;
  private doctorID: any;
  private caredOnesID: any;
  private sex: any;
  public symptomPacket: any;
  public sympArray: any = [];
  public tempSymptomArray: any = [];
  public resultData: any;
  private formName: any;
  private formQues: any = [];
  private formHxReady: boolean = false;
  private formAnswers: any = [];
  private qCounter: any;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fs: FacebookService,
    private http: Http,

  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(
      params => {
        let form = params['case'];
        this.userId = params['id']
        console.log(this.userId, form)
        this.feedbackForm = this._fb.group({
          rating: ['', Validators.required],
          feedbackDetail: [''],
          //commented temporarily

          prescriptionUpload: ['', Validators.required]
        });
        this.formReady = true;
      }
    )

  }
 fileUploaded() {
   console.log(this.feedbackForm)
   this.feedbackForm.controls['prescriptionUpload'].setValue("true");
   
 }
  saveFeedback(model) {
    console.log(model.value);
    //console.log(model.controls['ques'].value)
    var str = window.location.hostname;
    console.log(str);
    var n = str.indexOf(".");
    if (n == -1) {
      n = str.length;
    }
    console.log(n);
    var res = str.substring(0, n);
    console.log("location", res)
    this._authService._getDoctorId(res)
      .subscribe(data => {
        this.activatedRoute.params.subscribe(
          params => {
            let patientId = params['id'];
            let doctorId = data.$value;
            this._authService._savePatientFeedback(model.value, patientId, doctorId)
              .then(
              data => {
                this.router.navigate(['care-plan/'+ patientId]);
              }
              )

          }
        )
      });
  }
}
