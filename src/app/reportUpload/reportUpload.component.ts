import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-reportUpload',
  templateUrl: './reportUpload.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class ReportUploadComponent implements OnInit {
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


    //let form = params['case'];

    this._authService._getUser()
      .subscribe(userData => {
        this.userId = userData.user.uid;
        console.log(this.userId)
        this.feedbackForm = this._fb.group({


          prescriptionUpload: ['', Validators.required]
        });
        this.formReady = true;
      },
      error => {
        this.activatedRoute.queryParams.subscribe(
          qParams => {
            this.userId = qParams['userId'];
            console.log(this.userId)
            this.feedbackForm = this._fb.group({


              prescriptionUpload: ['', Validators.required]
            });
            this.formReady = true;
          })

      })


  }
  fileUploaded() {
    console.log(this.feedbackForm)
    this.feedbackForm.controls['prescriptionUpload'].setValue("true");

  }
  saveFeedback(model) {
    alert('Thanks! These reports have been saved. You can now close this window.')
  }
}
