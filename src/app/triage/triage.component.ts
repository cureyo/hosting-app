import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-triage',
  templateUrl: './triage.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class TriageComponent implements OnInit {
  private userBday: any;
  private userEducation: any;
  private userHomeTown: any;
  private userLocation: any;
  private clinicId: any;
  private userWorkHistory: any;
  private currentToken: any;
  private userToken: any;
  private symptomForm: FormGroup;
  private symptoms: any;
  private formReady: boolean = false;
  private diagnosisStarted: boolean = false;
  private symptomPacket: any;
  private sympArray: any = [];
  private questionText: any;
  private questionArray: any = [];

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fs: FacebookService,
    private http: Http
  ) { }

  ngOnInit() {
    this._authService._getSymptoms()
      .subscribe(
      data => {
        this.symptoms = data;
        this.symptomForm = this._fb.group({
          symptomName: ['', Validators.required]
        });
        this.formReady = true;
      }
      )

  }
  saveSymptom(model) {
    console.log(model.symptomName.id);
    this.sympArray[0] = { id: model.symptomName.id, choice_id: 'present' };
    this.diagnosisStarted = true;
    this.symptomPacket = {
      "sex": "male",
      "age": 0,
      "evidence": this.sympArray
    };
    console.log(this.symptomPacket);
    this.getSymptoms(this.symptomPacket)
      .subscribe(data => {
        console.log(data);
        this.questionText = data.question.text;
        this.questionArray = data.question.items;
      });
  }
  getSymptoms(data) {


    const domainURL = "https://api.infermedica.com/v2/diagnosis";



    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('App-Id', '21d47bec');
    headers.append('App-Key', 'f769f10aa0520be77e8c779ca552c371');
    headers.append('Dev-Mode', 'true')
    // headers.append('Authorization', `Bearer 88e99143c6783437106e779dc1f7910f0bdf1de018c2f3b809470df8bb1074f9`);

    return this.http.post(domainURL, data, {
      headers: headers
    })
      .map((res: Response) => res.json());


  }

}
