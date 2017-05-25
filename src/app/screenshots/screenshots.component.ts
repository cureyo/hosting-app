import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from '../config/app.config';
import { FbService } from "../services/facebook.service";
import { MetadataService } from 'ng2-metadata';
import { FacebookService } from "ng2-facebook-sdk/dist/index";
import { environment } from '../environment';
import { DomSanitizer } from '@angular/platform-browser';

import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

declare var $: any;
@Component({
  templateUrl: 'screenshots.component.html',
  selector: 'screenshot-cmp',
  moduleId: module.id

})
export class ScreenShotComponent implements OnInit, AfterViewInit {

  // @Input() pageDetails: any;

  isAuth: boolean;
  buttonClicked: boolean;
  buttonClicked1: boolean;
  private currentUser: any;
  private resourcePage: boolean = false;
  private resourceDetails: any;
  private partnerDetailsReady: boolean = false;
  private partnerDetails: any = [];
  private partnerLink: any = [];
  private pageDetailsData: any;
  private resourceDetailsReady: boolean = false;
  private heroBGImage: any;
  private fee: string;
  private dataReady: boolean = false;
  private clinicId: any;
  private pageDetails: any;
  private loginRoute: any;
  private content: any;
  private imageURL: any;
  private title: any;
  private clinicName: any;


  constructor(

    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private _cacheService: CacheService


  ) {



  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        console.log(params);
        this.content = params['content'];
        this.title = params['title'];
        this.imageURL = params['imageURL'];
        this.clinicName = params['clinicName']
      }
    )
  }

  ngAfterViewInit() {
   
  }//ngAfterViewInit

  getSafeURL(cleanURL) {
    //console.log(cleanURL);
    return this.sanitizer.bypassSecurityTrustStyle('url(' + cleanURL + ')');
  }

  scroll2Appt(content) {
    // console.log(content);
    var elmnt = document.getElementById("BookAppointment");
    // console.log(elmnt);
    elmnt.scrollIntoView();


  }



}
