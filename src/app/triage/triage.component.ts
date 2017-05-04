import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";

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

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fs: FacebookService
  ) { }

  ngOnInit() {
    this._authService._getSymptoms()
    .subscribe( 
      data => {
        this.symptoms = data;
        this.symptomForm = this._fb.group({
      symptomName:['', Validators.required]
    });
    this.formReady = true;
      }
    )
    
  }

}
