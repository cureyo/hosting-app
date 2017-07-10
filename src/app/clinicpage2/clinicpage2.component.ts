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
import { MapsComponent } from "./maps/maps.component"
import { CaredoneFormComponent } from "./caredone-form/caredone-form.component"
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

declare var $: any;
@Component({
  templateUrl: 'clinicpage2.component.html',
  selector: 'clinicpage2-cmp',
  moduleId: module.id

})
export class ClinicPageComponent2 implements OnInit, AfterViewInit {

  // @Input() pageDetails: any;

  isAuth: boolean;
  buttonClicked: boolean;
  buttonClicked1: boolean;
  private currentUser: any;
  private showCheckin: boolean = false;
  private resourcePage: boolean = false;
  private resourceDetails: any;
  private partnerDetailsReady: boolean = false;
  private partnerDetails: any = [];
  private blogBox: any = [];
  private blogPage: boolean = false;
  private blogData: any;
  private partnerLink: any = [];
  private pageDetailsData: any;
  private resourceDetailsReady: boolean = false;
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
    private _cacheService: CacheService,
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
    console.log("location", res);
    this.clinicId = res;

    this.pageDetailsData = this._cacheService.get('pageDetailsData')


    if (this.pageDetailsData) {
      this.pageDetails = this.pageDetailsData.data;
      //this.partnerDetails = this.pageDetailsData.partnerDetails
      console.log(this.pageDetails.metaData);
      this.setMetadata();
      console.log(this.pageDetails.content);
      this.fee = this.pageDetails.content.bookingTile.fee
      this.heroBGImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.pageDetails.content.heroTile.bgImage + ')');
      //this.setMetadata();

      this.dataReady = false;
      this._authService._getPartner(this.pageDetails.doctorId)
        .subscribe(
        partnerList => {

          console.log(partnerList);
          let ctr = 0;
          console.log(partnerList.consult);
          if (partnerList.consult) {
            for (let item in partnerList.consult) {
              console.log(item);
              if (partnerList.consult[item].name != 'self') {
                this.partnerDetails[ctr] = partnerList.consult[item];

                if (partnerList.consult[item].uid) {
                  this._authService._fetchUser(partnerList.consult[item].uid)
                    .subscribe(
                    partnerUserData => {
                      let clinicIdPartner;
                      if (partnerUserData.clinicWebsite) {
                        var n = partnerUserData.clinicWebsite.indexOf('.');
                        clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                      }
                      this.partnerLink[ctr] = 'https://' + clinicIdPartner + '.cureyo.com';
                    }
                    )
                }
                ctr++;
              }

            }
          }

          console.log(this.partnerDetails);
          if (partnerList.vendors) {

            for (let item of partnerList.vendors) {
              console.log(item);
              this.partnerDetails[ctr] = item;
              if (partnerList.vendors[item].uid) {
                this._authService._fetchUser(partnerList.vendors[item].uid)
                  .subscribe(
                  partnerUserData => {
                    let clinicIdPartner;
                    if (partnerUserData.clinicWebsite) {
                      var n = partnerUserData.clinicWebsite.indexOf('.');
                      clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                    }
                    this.partnerLink[ctr] = 'https://' + clinicIdPartner + '.cureyo.com';
                  }
                  )
              }
              ctr++;
            }
          }
          if (this.partnerDetails[0]) {
            this.partnerDetailsReady = true;
          }
          if (this.pageDetails.content.Blogs) {
            console.log(this.pageDetails.content.Blogs);
            var ctr3 = 0;
            for (let item in this.pageDetails.content.Blogs) {

              this.blogBox[ctr3] = this.pageDetails.content.Blogs[item];
              this.blogBox[ctr3].link = item;
              ctr3++;
              console.log(this.blogBox)
            }
          }

        }
        )
      console.log(this.pageDetails)
      this.route.params.subscribe(
        params => {
          console.log(params)
          if (params['item']) {
            console.log("params2")
            if (this.pageDetails.content.specializations) {
              console.log("params3")
              for (let each in this.pageDetails.content.specializations) {

                if (params['item'] == this.pageDetails.content.specializations[each]['webTitle']) {
                  console.log("params4")
                  this.resourceDetails = this.pageDetails.content.specializations[each];
                  this.resourcePage = true;
                  this.resourceDetailsReady = true;
                  var self = this;
                  setTimeout(
                    function () {
                      var d = document.getElementById("resourcePreview");
                      console.log(d);
                      d.innerHTML = self.pageDetails.content.specializations[each].description;
                    }, 1000
                  )

                }
              }
            }
          }  else if (params['blog']) { 
            this.resourcePage = false;
            this.blogData = this.pageDetails.content.Blogs[params['blog']];
            this.blogPage = true;
          }
          else {
            this.resourcePage = false;
          }
        }
      )

    } else {

      this._authService._getDoctorPage(res).subscribe(
        pageData => {

          console.log(pageData);
          this.pageDetails = pageData;
          this.setMetadata();
          this.fee = this.pageDetails.content.bookingTile.fee
          this.heroBGImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.pageDetails.content.heroTile.bgImage + ')');
          //this.setMetadata();
          this.dataReady = false;
          this._authService._getPartner(this.pageDetails.doctorId)
            .subscribe(
            partnerList => {
              console.log(partnerList);
              let ctr = 0;
              console.log(partnerList.consult);
              if (partnerList.consult) {
                for (let item in partnerList.consult) {
                  console.log(item);
                  if (partnerList.consult[item].name != 'self') {
                    this.partnerDetails[ctr] = partnerList.consult[item];

                    if (partnerList.consult[item].uid) {
                      this._authService._fetchUser(partnerList.consult[item].uid)
                        .subscribe(
                        partnerUserData => {
                          let clinicIdPartner;
                          if (partnerUserData.clinicWebsite) {
                            var n = partnerUserData.clinicWebsite.indexOf('.');
                            clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                          }
                          this.partnerLink[ctr] = 'https://' + clinicIdPartner + '.cureyo.com';
                        }
                        )
                    }
                    ctr++;
                  }
                }
              }

              console.log(this.partnerDetails);
              if (partnerList.vendors) {

                for (let item of partnerList.vendors) {
                  console.log(item);
                  this.partnerDetails[ctr] = item;
                  if (partnerList.vendors[item].uid) {
                    this._authService._fetchUser(partnerList.vendors[item].uid)
                      .subscribe(
                      partnerUserData => {
                        let clinicIdPartner;
                        if (partnerUserData.clinicWebsite) {
                          var n = partnerUserData.clinicWebsite.indexOf('.');
                          clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                        }
                        this.partnerDetails[ctr]['websiteLink'] = 'https://' + clinicIdPartner + '.cureyo.com';
                      }
                      )
                  }
                  ctr++;
                }
              }
              if (this.partnerDetails[0]) {
                this.partnerDetailsReady = true;
              }


            }
            )

          this._cacheService.set('pageDetailsData', { 'data': this.pageDetails, 'partnerDetails': this.partnerDetails }, { expires: Date.now() + 1000 * 60 * 60 });
          this.dataReady = true;
          console.log(this.pageDetailsData)

        });
    }




    //   }
    // )

    $(window).on('scroll', function () {
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
    var dInit = document.getElementById("heroSection");
    if (dInit)
      dInit.scrollIntoView();
    else {
      dInit = document.getElementById("resourceSection");
      dInit.scrollIntoView();
    }

    this.route.queryParams.subscribe(params => {
      if (params['scrollToSec']) {
        console.log(this.clinicId);
        this._authService._getScrollToSection(this.clinicId)
          .subscribe(
          scrollData => {
            console.log(scrollData);
            var d = document.getElementById(scrollData.scrollTo);
            d.scrollIntoView();
          }
          )
      }
    })
    //document.domain = "cureyo.com";
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
    var clinicId = str.substring(0, n);
    var host = str.substring(n, m);
    console.log(host);
    if (host == '.localhost') {
      console.log('https://login' + host + ':4200' + '/fblogin?clinicId=' + clinicId);
      window.location.href = 'https://login' + host + ':4200' + '/fblogin?clinicId=' + clinicId;
    } else if (host == '.cureyo.com') {
      window.location.href = 'https://login' + host + '/fblogin?clinicId=' + clinicId;
    } else {
      window.location.href = 'https://login.cureyo.com/fblogin?clinicId=' + clinicId + '&clinicWebsite=' + window.location.hostname;
    }
  }
    setMetadata() {
    let title = this.pageDetails.metaData.title;
    let description = this.pageDetails.metaData.description;
    let urlImage = this.pageDetails.metaData.image;
    let urlPage = this.pageDetails.metaData.url;
    let siteName = this.pageDetails.metaData.siteName;
    // let twitterSiteName = this.pageDetails.metaData.twitter.site;
    // let twitterCardImage = this.pageDetails.metaData.twitter.cardImage;
    // let twitterImage = this.pageDetails.metaData.twitter.image;

    console.log("setting medata");

    console.log(this.router.url)

    this.route.params.subscribe(
    params => {
      console.log(params);
      if (params['blog']) {
        //basic metadata
    this.metadataService.setTitle(this.pageDetails.content.Blogs[params['blog']].Title);
    this.metadataService.setTag('description','Blog discussion by '+ this.pageDetails.content.profileTile.doctor.name);
    //google metadata
    this.metadataService.setTag('name', this.pageDetails.content.Blogs[params['blog']].Title);
    this.metadataService.setTag('description', 'Blog discussion by '+ this.pageDetails.content.profileTile.doctor.name);
    this.metadataService.setTag('image', this.pageDetails.content.Blogs[params['blog']].Image);
    this.metadataService.setTag('og:url', window.location.pathname);
    this.metadataService.setTag('og:image', this.pageDetails.content.Blogs[params['blog']].Image);
    this.metadataService.setTag('og:description', description);
    this.metadataService.setTag('og:site_name', siteName);
      }
    //   } else if (params['item']) {

    //     //basic metadata
    // this.metadataService.setTitle(this.pageDetails.content.Blogs[params['blog']].Title);
    // this.metadataService.setTag('description','Blog discussion by '+ this.pageDetails.content.doctor.name);
    // //google metadata
    // this.metadataService.setTag('name', this.pageDetails.content.Blogs[params['blog']].Title);
    // this.metadataService.setTag('description', 'Blog discussion by '+ this.pageDetails.content.doctor.name);
    // this.metadataService.setTag('image', this.pageDetails.content.Blogs[params['blog']].Image);
    // this.metadataService.setTag('og:url', window.location.pathname);
    // this.metadataService.setTag('og:image', this.pageDetails.content.Blogs[params['blog']].Image);
    // this.metadataService.setTag('og:description', description);
    // this.metadataService.setTag('og:site_name', siteName);

    //   } 
      else {
          //basic metadata
    this.metadataService.setTitle(title);
    this.metadataService.setTag('description',description);
    //google metadata
    this.metadataService.setTag('name', title);
    this.metadataService.setTag('description', description);
    this.metadataService.setTag('image', urlImage);
        this.metadataService.setTag('og:url', urlPage);
    this.metadataService.setTag('og:image', urlImage);
    this.metadataService.setTag('og:description', description);
    this.metadataService.setTag('og:site_name', siteName);
      }
    })
    //twitter metadata
    // this.metadataService.setTag('twitter:card', twitterCardImage);
    // this.metadataService.setTag('twitter:site', twitterSiteName);
    // this.metadataService.setTag('twitter:title', title);
    // this.metadataService.setTag('twitter:description', description);
    // this.metadataService.setTag('twitter:creator', twitterSiteName);
    // this.metadataService.setTag('twitter:image', twitterImage);


    //facebook metadata
    this.metadataService.setTag('fb:app_id', '1133564906671009');
    this.metadataService.setTag('og:title', title);
    this.metadataService.setTag('og:type', 'books.quotes');
    
    // //google metadata
    // this.metadataService.setMetadata('itemprop', 'name', title);
    // this.metadataService.setMetadata('itemprop', 'description', description);
    // this.metadataService.setMetadata('itemprop', 'image', urlImage);


    // //twitter metadata
    // this.metadataService.setMetadata('name', 'twitter:card', twitterCardImage);
    // this.metadataService.setMetadata('name', 'twitter:site', twitterSiteName);
    // this.metadataService.setMetadata('name', 'twitter:title', title);
    // this.metadataService.setMetadata('name', 'twitter:description', description);
    // this.metadataService.setMetadata('name', 'twitter:creator', twitterSiteName);
    // this.metadataService.setMetadata('name', 'twitter:image', twitterImage);


    // //facebook metadata
    // this.metadataService.setMetadata('property', 'fb:app_id', '1133564906671009');
    // this.metadataService.setMetadata('property', 'og:title', title);
    // this.metadataService.setMetadata('property', 'og:type', 'books.quotes');
    // this.metadataService.setMetadata('property', 'og:url', urlPage);
    // this.metadataService.setMetadata('property', 'og:image', urlImage);
    // this.metadataService.setMetadata('property', 'og:description', description);
    // this.metadataService.setMetadata('property', 'og:site_name', siteName);

  }
  showCheckInButton() {
    this.showCheckin = !this.showCheckin;
  }
}
