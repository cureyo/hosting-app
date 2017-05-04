import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import {ClinicPageComponent} from "./clinicpage/clinicpage.component";
import {MapsComponent} from "./clinicpage/maps/maps.component";
import {CaredoneFormComponent} from "./clinicpage/caredone-form/caredone-form.component";
import {FileUploadComponent} from "./clinicpage/file-upload/file-upload.component";
import {VideoCallComponent} from "./video-call/video-call.component";
import {LoginComponent} from "./login/login.component"
import {DoctorLoginComponent} from "./doctor-login/doctor-login.component"
import {FbloginComponent} from "./fblogin/fblogin.component";
import {CheckUpFormComponent} from "./check-up-form/check-up-form.component";
import {QueueCounterComponent} from "./queue-counter/queue-counter.component";
import {TriageComponent} from "./triage/triage.component";
export const MODULE_ROUTES: Route[] =[
    { path: '', component: ClinicPageComponent },
    { path: 'consultation/:id', component: VideoCallComponent},
    { path: 'login/:id', component: LoginComponent},
    { path: 'doctor-login/:id', component: DoctorLoginComponent},
    { path : 'fblogin', component: FbloginComponent},
    { path: 'checkupForm/:count',component:CheckUpFormComponent},
    { path: 'queue/:count',component:QueueCounterComponent},
    { path: 'triage/:id',component:TriageComponent}
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
    TriageComponent

]