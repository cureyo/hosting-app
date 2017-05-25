import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import {ClinicPageComponent} from "./clinicpage/clinicpage.component";
import {MapsComponent} from "./clinicpage/maps/maps.component";
import {CaredoneFormComponent} from "./clinicpage/caredone-form/caredone-form.component";
import {FileUploadComponent} from "./clinicpage/file-upload/file-upload.component";
import {FeedbackFileUploadComponent} from "./feedback/file-upload/file-upload.component";
import {CheckUpFileUploadComponent} from "./check-up-form/file-upload/file-upload.component";
import {VideoCallComponent} from "./video-call/video-call.component";
import {LoginComponent} from "./login/login.component"
import {DoctorLoginComponent} from "./doctor-login/doctor-login.component"
import {FbloginComponent} from "./fblogin/fblogin.component";
import {CheckUpFormComponent} from "./check-up-form/check-up-form.component";
import {QueueCounterComponent} from "./queue-counter/queue-counter.component";
import {TriageComponent} from "./triage/triage.component";
import {HxFormComponent} from "./HxForm/HxForm.component";
import {FeedbackComponent} from "./feedback/feedback.component";
import {ScreenShotComponent} from "./screenshots/screenshots.component";

export const MODULE_ROUTES: Route[] =[
    { path: '', component: ClinicPageComponent },
    { path: 'resource/:item', component: ClinicPageComponent },
    { path: 'consultation/:id', component: VideoCallComponent},
    { path: 'login/:id', component: LoginComponent},
    { path: 'doctor-login/:id', component: DoctorLoginComponent},
    { path: 'fblogin', component: FbloginComponent},
    { path: 'checkupForm/:count',component:CheckUpFormComponent},
    { path: 'queue/:count/:id',component:QueueCounterComponent},
    { path: 'triage/:id',component:TriageComponent},
    { path: 'medical-history/:count/:case/:id',component:HxFormComponent},
    { path: 'feedback/:count/:id',component: FeedbackComponent},
     { path: 'screenshot',component: ScreenShotComponent}
]

export const MODULE_COMPONENTS = [
    AppComponent,
    ClinicPageComponent,
    MapsComponent,
    CaredoneFormComponent,
    FileUploadComponent,
    VideoCallComponent,
    LoginComponent,
    DoctorLoginComponent,
    FbloginComponent,
    CheckUpFormComponent,
    QueueCounterComponent,
    TriageComponent,
    HxFormComponent,
    FeedbackComponent,
    FeedbackFileUploadComponent,
    CheckUpFileUploadComponent,
    ScreenShotComponent
]