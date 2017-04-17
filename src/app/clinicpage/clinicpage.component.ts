import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from '../config/app.config';
import { FbService } from "../services/facebook.service";
import { MetadataService } from "../services/metadata.service";
import { FacebookService } from "ng2-facebook-sdk/dist/index";
import { environment } from '../environment';
import {DomSanitizer} from '@angular/platform-browser';
import {MapsComponent} from "./maps/maps.component"
import {CaredoneFormComponent} from "./caredone-form/caredone-form.component"


declare var $: any;
@Component({
  templateUrl: 'clinicpage.component.html',
  selector: 'clinicpage-cmp',
  moduleId: module.id

})
export class ClinicPageComponent implements OnInit, AfterViewInit {
  

  
  isAuth: boolean;
  buttonClicked: boolean;
  buttonClicked1: boolean;
  private currentUser: any;
  private pageDetails: any;
  private heroBGImage: any;
  private fee: string;
  private dataReady: boolean = false;
  private clinicId: any;

 

  constructor(
    
    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private metadataService: MetadataService
    
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
   console.log("location", res)
        this._authService._getDoctorPage(res).subscribe(
            pageData => {
              this.clinicId = res;
              console.log(pageData);
              this.pageDetails = pageData;
              console.log(this.pageDetails.metaData);
              console.log(this.pageDetails.content);
              this.fee = this.pageDetails.content.bookingTile.fee
             this.heroBGImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.pageDetails.content.heroTile.bgImage + ')');
              this.setMetadata();
              this.dataReady = false;

            }
          )
 
    $(window).on('scroll',function(){
      var y = $(this).scrollTop();
      console.log("scrolling");
      if(y > 500) {
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
 
  setMetadata() {
		let title =this.pageDetails.metaData.title;
		let description = this.pageDetails.metaData.description;
		let urlImage = this.pageDetails.metaData.image;
		let urlPage = this.pageDetails.metaData.url;
    let siteName = this.pageDetails.metaData.siteName;
    let twitterSiteName = this.pageDetails.metaData.twitter.site;
    let twitterCardImage = this.pageDetails.metaData.twitter.cardImage;
		let twitterImage = this.pageDetails.metaData.twitter.image;

		console.log("setting medata");
    //basic metadata
		this.metadataService.setTitle(title);
		this.metadataService.setMetaDescription(description);

		//google metadata
		this.metadataService.setMetadata('itemprop', 'name', title);
		this.metadataService.setMetadata('itemprop', 'description', description);
		this.metadataService.setMetadata('itemprop', 'image', urlImage);


		//twitter metadata
		this.metadataService.setMetadata('name', 'twitter:card', twitterCardImage);
		this.metadataService.setMetadata('name', 'twitter:site', twitterSiteName);
		this.metadataService.setMetadata('name', 'twitter:title', title);
		this.metadataService.setMetadata('name', 'twitter:description', description);
		this.metadataService.setMetadata('name', 'twitter:creator', twitterSiteName);
		this.metadataService.setMetadata('name', 'twitter:image', twitterImage);


		//facebook metadata
		this.metadataService.setMetadata('property', 'og:title', title);
		this.metadataService.setMetadata('property', 'og:type', 'books.quotes');
		this.metadataService.setMetadata('property', 'og:url', urlPage);
		this.metadataService.setMetadata('property', 'og:image', urlImage);
		this.metadataService.setMetadata('property', 'og:description', description);
		this.metadataService.setMetadata('property', 'og:site_name', siteName); 
		
	}

}
