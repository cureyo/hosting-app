import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from '../config/app.config';
import { FbService } from "../services/facebook.service";
import { MetadataService } from "../services/metadata.service";
import { FacebookService } from "ng2-facebook-sdk/dist/index";
import { environment } from '../environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsComponent } from "./maps/maps.component"
import { CaredoneFormComponent } from "./caredone-form/caredone-form.component"
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

declare var $: any;
@Component({
  templateUrl: 'clinicpage.component.html',
  selector: 'clinicpage-cmp',
  moduleId: module.id

})
export class ClinicPageComponent implements OnInit, AfterViewInit {

  // @Input() pageDetails: any;

  isAuth: boolean;
  buttonClicked: boolean;
  buttonClicked1: boolean;
  private currentUser: any;
  private pageDetailsData: any;
  private heroBGImage: any;
  private fee: string;
  private dataReady: boolean = false;
  private clinicId: any;
  private pageDetails: any;
  private loginRoute: any;



  constructor(

    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private _cacheService: CacheService


  ) {



  }

  ngOnInit() {
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
      this.clinicId = res;
      
    this.pageDetailsData = this._cacheService.get('pageDetailsData')

    console.log(this.pageDetailsData)
    if (this.pageDetailsData) {
      this.pageDetails = this.pageDetailsData.data;
      console.log(this.pageDetails.metaData);
      console.log(this.pageDetails.content);
      this.fee = this.pageDetails.content.bookingTile.fee
      this.heroBGImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.pageDetails.content.heroTile.bgImage + ')');
      //this.setMetadata();
      this.dataReady = false;

    } else {
      
      this._authService._getDoctorPage(res).subscribe(
        pageData => {
          
          console.log(pageData);
          this.pageDetails = pageData;
          this.fee = this.pageDetails.content.bookingTile.fee
          this.heroBGImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.pageDetails.content.heroTile.bgImage + ')');
          //this.setMetadata();
          this.dataReady = false;
          this._cacheService.set('pageDetailsData', { 'data': this.pageDetails }, { expires: Date.now() + 1000 * 60 * 60 });
          this.dataReady = true;
        });
    }
  



  //   }
  // )

  $(window).on('scroll', function() {
    var y = $(this).scrollTop();
    console.log("scrolling");
    if (y > 500) {
      $("nav").removeClass("navbar-transparent");
    }
    else {
      $("nav").addClass("navbar-transparent");
    }

  })
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


patientLogin() {
  var str = window.location.hostname;
  console.log(str);
  
      var n = str.indexOf(".");
      var m = str.length;
      var clinicId = str.substring(0,n);
      var host = str.substring(n,m);
      console.log(host);
      if (host == '.localhost') {
        console.log('http://login'+ host + ':4200' + '/fblogin?clinicId=' + clinicId);
        window.location.href = 'http://login'+ host + ':4200' + '/fblogin?clinicId=' + clinicId;
      } else {
         window.location.href = 'http://login'+ host + '/fblogin?clinicId=' + clinicId;
      }
}
}
