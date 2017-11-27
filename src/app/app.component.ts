import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/firebaseauth.service';
import { MetadataService } from 'ng2-metadata';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'my-app',

  moduleId: module.id,
  templateUrl: 'app.component.html',
  providers: [CacheService]

})

export class AppComponent implements OnInit {
  private pageDetails: any;
  private clinicId: any;
  private dataReady: boolean = false;

  constructor(private _authService: AuthService, private metadataService: MetadataService, private router: ActivatedRoute, private _cacheService: CacheService) { }
  title = 'app works!';
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
    res = "drakashmalik";
    console.log("location", res)
    this._authService._getDoctorPage(res).subscribe(
      pageData => {
        this.clinicId = res;
       // console.log(pageData);
        this.pageDetails = pageData;
        this._cacheService.set('pageDetailsData', { 'data': this.pageDetails }, { expires: Date.now() + 1000 * 60 * 60 });
        this.dataReady = true;
        //this.setMetadata();
    });
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

    this.router.params.subscribe(
    params => {
      console.log(params);
      if (params['blog']) {
        //basic metadata
    this.metadataService.setTitle(this.pageDetails.content.Blogs[params['blog']].Title);
    this.metadataService.setTag('description','Blog discussion by '+ this.pageDetails.content.doctor.name);
    //google metadata
    this.metadataService.setTag('name', this.pageDetails.content.Blogs[params['blog']].Title);
    this.metadataService.setTag('description', 'Blog discussion by '+ this.pageDetails.content.doctor.name);
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
}