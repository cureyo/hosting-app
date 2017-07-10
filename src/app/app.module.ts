import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from "./services/firebaseauth.service";
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { FacebookInitParams, FacebookLoginResponse, FacebookService } from "ng2-facebook-sdk";
import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './app.routes';
import { HttpModule, Jsonp, ConnectionBackend } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CONFIG } from '../app/config/firebase.config';
import { AngularFireModule,} from 'angularfire2';
import { AppComponent } from './app.component';
import {MetadataService, MetadataLoader, MetadataModule} from "ng2-metadata";
import { FbService } from "./services/facebook.service";
import { CommonModule } from '@angular/common';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { PathLocationStrategy, LocationStrategy, APP_BASE_HREF } from '@angular/common';
import {Ng2AutoCompleteModule} from "ng2-auto-complete/dist/index";
import {GooglePlaceModule} from 'ng2-google-place-autocomplete';
import {VideoCallComponent} from "./video-call/video-call.component";
import { FbloginComponent } from './fblogin/fblogin.component';
import { CheckUpFormComponent } from './check-up-form/check-up-form.component';
import { NoPlansComponent } from './no-plans/no-plans.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FeedbackFileUploadComponent} from './feedback/file-upload/file-upload.component';
import {FeedbackComponent} from './feedback/feedback.component';
import {ReportUploadComponent} from './reportUpload/reportUpload.component';

// Must export the config
export const firebaseConfig = {
  apiKey: CONFIG.apiKey,
  authDomain: CONFIG.authDomain,
  databaseURL: CONFIG.databaseURL,
  storageBucket: CONFIG.storageBucket,
};

export const firebaseAuthConfig = {
  provider: 'facebook',
  method: 'popup',
  scope: ["user_friends", "user_birthday", "user_work_history", 
            "user_hometown",
            "user_education_history",
            "user_location",
  "user_relationships", "user_relationship_details"]
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    RouterModule.forChild(MODULE_ROUTES),
    BrowserModule,
     BrowserAnimationsModule,
    RouterModule.forRoot([]),
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    Ng2AutoCompleteModule,
    GooglePlaceModule,
    MetadataModule.forRoot(),
    
    
  ],


  declarations: [ MODULE_COMPONENTS, FbloginComponent, CheckUpFormComponent, NoPlansComponent],

  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }, AuthService, AngularFireAuth, AngularFireAuthModule, AngularFireDatabase, AngularFireDatabaseModule, FbService, Jsonp, FacebookService, FeedbackComponent, ReportUploadComponent, FeedbackFileUploadComponent, MetadataService],

  bootstrap: [AppComponent]
})
export class AppModule { }