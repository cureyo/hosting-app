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


    if (this.pageDetailsData) {
      this.pageDetails = this.pageDetailsData.data;
      //this.partnerDetails = this.pageDetailsData.partnerDetails
      console.log(this.pageDetails.metaData);
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
          console.log(partnerList.consultant);
          if (partnerList.consultant) {
            for (let item in partnerList.consultant) {
              console.log(item);
              if (partnerList.consultant[item].name != 'self') {
                this.partnerDetails[ctr] = partnerList.consultant[item];

                if (partnerList.consultant[item].uid) {
                  this._authService._fetchUser(partnerList.consultant[item].uid)
                    .subscribe(
                    partnerUserData => {
                      let clinicIdPartner;
                      if (partnerUserData.clinicWebsite) {
                        var n = partnerUserData.clinicWebsite.indexOf('.');
                        clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                      }
                      this.partnerLink[ctr] = 'http://' + clinicIdPartner + '.cureyo.com';
                    }
                    )
                }
                ctr++;
              }

            }
          }

          console.log(this.partnerDetails);
          if (partnerList.vendor) {

            for (let item of partnerList.vendor) {
              console.log(item);
              this.partnerDetails[ctr] = item;
              if (partnerList.vendor[item].uid) {
                this._authService._fetchUser(partnerList.vendor[item].uid)
                  .subscribe(
                  partnerUserData => {
                    let clinicIdPartner;
                    if (partnerUserData.clinicWebsite) {
                      var n = partnerUserData.clinicWebsite.indexOf('.');
                      clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                    }
                    this.partnerLink[ctr] = 'http://' + clinicIdPartner + '.cureyo.com';
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
      console.log(this.pageDetails)
      this.route.params.subscribe(
        params => {
          console.log(params)
          if (params['item']) {
            console.log("params2")
            if (this.pageDetails.content.specializations) {
              console.log("params3")
              for (let each in this.pageDetails.content.specializations) {

                if (params['item'] == this.pageDetails.content.specializations[each]['title']) {
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
          } else {
            this.resourcePage = false;
          }
        }
      )

    } else {

      this._authService._getDoctorPage(res).subscribe(
        pageData => {

          console.log(pageData);
          this.pageDetails = pageData;
          this.fee = this.pageDetails.content.bookingTile.fee
          this.heroBGImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.pageDetails.content.heroTile.bgImage + ')');
          //this.setMetadata();
          this.dataReady = false;
          this._authService._getPartner(this.pageDetails.doctorId)
            .subscribe(
            partnerList => {
              console.log(partnerList);
              let ctr = 0;
              console.log(partnerList.consultant);
              if (partnerList.consultant) {
                for (let item in partnerList.consultant) {
                  console.log(item);
                  if (partnerList.consultant[item].name != 'self') {
                    this.partnerDetails[ctr] = partnerList.consultant[item];

                    if (partnerList.consultant[item].uid) {
                      this._authService._fetchUser(partnerList.consultant[item].uid)
                        .subscribe(
                        partnerUserData => {
                          let clinicIdPartner;
                          if (partnerUserData.clinicWebsite) {
                            var n = partnerUserData.clinicWebsite.indexOf('.');
                            clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                          }
                          this.partnerLink[ctr] = 'http://' + clinicIdPartner + '.cureyo.com';
                        }
                        )
                    }
                    ctr++;
                  }
                }
              }

              console.log(this.partnerDetails);
              if (partnerList.vendor) {

                for (let item of partnerList.vendor) {
                  console.log(item);
                  this.partnerDetails[ctr] = item;
                  if (partnerList.vendor[item].uid) {
                    this._authService._fetchUser(partnerList.vendor[item].uid)
                      .subscribe(
                      partnerUserData => {
                        let clinicIdPartner;
                        if (partnerUserData.clinicWebsite) {
                          var n = partnerUserData.clinicWebsite.indexOf('.');
                          clinicIdPartner = partnerUserData.clinicWebsite.substring(0, n)
                        }
                        this.partnerDetails[ctr]['websiteLink'] = 'http://' + clinicIdPartner + '.cureyo.com';
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
      console.log('http://login' + host + ':4200' + '/fblogin?clinicId=' + clinicId);
      window.location.href = 'http://login' + host + ':4200' + '/fblogin?clinicId=' + clinicId;
    } else {
      window.location.href = 'http://login' + host + '/fblogin?clinicId=' + clinicId;
    }
  }
}
