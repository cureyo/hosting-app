import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-HxForm',
  templateUrl: './HxForm.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class HxFormComponent implements OnInit {
  private userBday: any;
  private userEducation: any;
  private userHomeTown: any;
  private userLocation: any;
  private clinicId: any;
  private userWorkHistory: any;
  private currentToken: any;
  private userToken: any;
  private formHx: FormArray;
  private formGp: FormGroup;
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
        this.qCounter = params['count'];
        this._authService._getHxForm(form)
          .subscribe(
          data => {
            console.log(data);
            this.formName = data.name;
            this.formQues = data.checkPoints;
            console.log(this.formQues)

            this.formHx = this._fb.array([this.pushQuestion(this.formQues[0], 0)]);
            //let control = tempForm.controls;
            console.log(this.formHx)
            for (let item in this.formQues) {
              if (item != '$key' && item != 'exists' && item != '0') {
                console.log(this.formQues[item]);
                this.formHx.push(this.pushQuestion(this.formQues[item], item))
              }
            }
            console.log(this.formHx)
            this.formAnswers['Always'] = true;
            this.formGp = this._fb.group({
              ques: this.formHx
            });
            this.formHxReady = true;
            console.log(this.formGp.controls['ques']);
            console.log(this.formOps);
            console.log(this.formQues);
            console.log(this.formDep);
            console.log(this.formType);
            console.log(this.formAnswers)

          }
          )
      }
    )

  }
  pushQuestion(data, item) {
    console.log(item);
    this.formQues[item] = data.messageText;
    this.formOps[item] = data.options;
    this.formAnswers[item] = false;
    console.log(data.askIf)

    this.formType[item] = data.checkType;
    console.log(data);
    let standard;
    if (data.checkType == "yes-no") {
      if (data.standard == "Yes") {
        standard = true;
      } else {
        standard = false;
      }
    } else {
      standard = data.standard;
    }
    if (data.askIf == "Always") {

      //this.formAnswers[item] = true;
      this.formDep[item] = data.askIf;
      console.log("this.formAnswers[this.formDep[item]]", this.formAnswers[item]);
          return this._fb.group({
      question: [data.messageText, Validators.required],
      response: ['', Validators.required],
      standard: [standard, Validators.required],
    });
    } else {

      this.formDep[item] = parseInt(data.askIf) - 1;
      console.log("this.formAnswers[this.formDep[item]]", this.formAnswers[item]);
          return this._fb.group({
      question: [data.messageText, Validators.required],
      response: [''],
      standard: [standard, Validators.required],
    });

    }


  }
  saveHistory(model) {
    console.log(model.value);
    console.log(model.controls['ques'].value)
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
            this._authService._savePatientHx(model.controls['ques'].value, patientId, doctorId)
              .then(
              data => {
                this.router.navigate(['queue/' + this.qCounter + '/' + patientId], { queryParams: { triaged: true } });
              }
              )

          }
        )
      });
  }
  yesNoToggled(response, i) {
    console.log(response);
    console.log(i);
    this.formAnswers[i] = response.response.value;
    console.log(this.formAnswers);

  }
}
