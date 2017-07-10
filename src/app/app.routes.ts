import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import {ClinicPageComponent} from "./clinicpage/clinicpage.component";
import {ClinicPageComponent2} from "./clinicpage2/clinicpage2.component";
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
import {RegistrationFormComponent} from "./registrationForm/registrationForm.component";
import {QueueCounterComponent} from "./queue-counter/queue-counter.component";
import {TriageComponent} from "./triage/triage.component";
import {HxFormComponent} from "./HxForm/HxForm.component";
import {FeedbackComponent} from "./feedback/feedback.component";
import {ScreenShotComponent} from "./screenshots/screenshots.component";
import {NoPlansComponent} from "./no-plans/no-plans.component";
import {HorizontalTimelineComponent} from "./horizontal-timeline/horizontal-timeline.component";
import {ReportUploadComponent} from "./reportUpload/reportUpload.component";
import {PlaceOrderComponent} from "./placeOrder/placeOrder.component";
export const MODULE_ROUTES: Route[] =[
    { path: '', component: ClinicPageComponent },
    { path: 'home', component: ClinicPageComponent2 },
    { path: 'resource/:item', component: ClinicPageComponent },
    { path: 'blog/:blog', component: ClinicPageComponent },
    { path: 'consultation/:id', component: VideoCallComponent},
    { path: 'login/:id', component: LoginComponent},
    { path: 'doctor-login/:id', component: DoctorLoginComponent},
    { path: 'fblogin', component: FbloginComponent},
    { path: 'checkupForm/:count',component:CheckUpFormComponent},
    { path: 'registrationForm',component:RegistrationFormComponent},
    { path: 'queue/:count/:id',component:QueueCounterComponent},
    { path: 'triage/:id',component:TriageComponent},
    { path: 'medical-history/:count/:case/:id',component:HxFormComponent},
    { path: 'feedback/:count/:id',component: FeedbackComponent},
    { path: 'reportUpload',component: ReportUploadComponent},
    { path: 'screenshot',component: ScreenShotComponent},
    { path :'care-plan/:id/:pathway', component: NoPlansComponent},
    { path :'place-order/:orderType/:partnerId/:userId', component: PlaceOrderComponent},
]

export const MODULE_COMPONENTS = [
    AppComponent,
    ClinicPageComponent,
    ClinicPageComponent2,
    HorizontalTimelineComponent,
    MapsComponent,
    CaredoneFormComponent,
    FileUploadComponent,
    RegistrationFormComponent,
    VideoCallComponent,
    LoginComponent,
    DoctorLoginComponent,
    ReportUploadComponent,
    FbloginComponent,
    CheckUpFormComponent,
    QueueCounterComponent,
    TriageComponent,
    HxFormComponent,
    FeedbackComponent,
    FeedbackFileUploadComponent,
    CheckUpFileUploadComponent,
    ScreenShotComponent,
    PlaceOrderComponent,
    NoPlansComponent
]