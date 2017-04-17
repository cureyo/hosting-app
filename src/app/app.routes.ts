import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import {ClinicPageComponent} from "./clinicpage/clinicpage.component";
import {MapsComponent} from "./clinicpage/maps/maps.component";
import {CaredoneFormComponent} from "./clinicpage/caredone-form/caredone-form.component";

export const MODULE_ROUTES: Route[] =[
    { path: '', component: ClinicPageComponent }
]

export const MODULE_COMPONENTS = [
    AppComponent,
    ClinicPageComponent,
    MapsComponent,
    CaredoneFormComponent

]