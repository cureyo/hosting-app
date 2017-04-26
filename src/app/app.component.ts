import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/firebaseauth.service';
import { MetadataService } from "./services/metadata.service";
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
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

  constructor(private _authService: AuthService, private metadataService: MetadataService, private _cacheService: CacheService) { }
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
    console.log("location", res)
    this._authService._getDoctorPage(res).subscribe(
      pageData => {
        this.clinicId = res;
        console.log(pageData);
        this.pageDetails = pageData;
        this._cacheService.set('pageDetailsData', { 'data': this.pageDetails }, { expires: Date.now() + 1000 * 60 * 60 });
        this.dataReady = true;
        this.setMetadata();
    });
  }
  setMetadata() {
    let title = this.pageDetails.metaData.title;
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
