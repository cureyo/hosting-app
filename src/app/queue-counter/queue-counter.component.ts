import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
declare var $: any;
@Component({
    selector: 'app-queue-counter',
    templateUrl: './queue-counter.component.html',
    //styleUrls: ['./fblogin.component.css']
})
export class QueueCounterComponent implements OnInit {
    private userBday: any;
    private userEducation: any;
    private userHomeTown: any;
    private userLocation: any;
    private clinicId: any;
    private userWorkHistory: any;
    private currentToken: any;
    private userToken: any;
    private number: any;
    private online: boolean = false;
    private userId: any;
    private showDiscuss: boolean = false;

    constructor(
        private _authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _fs: FacebookService
    ) { }

    ngOnInit() {

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
        this.activatedRoute.params.subscribe(
            params => {
                let param = params['count'];
                this.userId = params['id'];
                this.userToken = param;
                var date = new Date();
                var ddS = date.getDate();
                var mmS = date.getMonth() + 1;
                var yyyy = date.getFullYear();
                var dd, mm;
                if (ddS < 10)
                    dd = "0" + ddS;
                else
                    dd = ddS;
                if (mmS < 10)
                    mm = "0" + mmS;
                else
                    mm = mmS;
                var date2 = mm + '-' + dd + '-' + yyyy;
                this.activatedRoute.queryParams.subscribe(
                    queryParam => {
                        console.log(queryParam['triaged']);
                        console.log(queryParam)
                        if (queryParam['number']) {
                            this.online = true;
                            this.number = queryParam['number']
                        }
                        if (queryParam['triaged'] == "true") {
                            this.showDiscuss = false;
                        } else {
                            this.showDiscuss = true;
                        }
                    }
                )

                this._authService._getCheckIn(this.clinicId, date2)
                    .subscribe(
                    data => {
                        console.log(this.clinicId);
                        console.log(data);
                        console.log(data['q'])

                        if (data['q']) {
                            this.currentToken = data['q'];

                        } else {
                            this.currentToken = 0;
                        }
                        if (data['q'] == this.userToken) {
                            $.notify({
                                icon: "notifications",
                                message: "Your consultation will begin now. Please proceed to the Doctor's chambers"

                            }, {
                                    type: 'cureyo',
                                    timer: 4000,
                                    delay: 4000,
                                    placement: {
                                        from: 'top',
                                        align: 'right'
                                    }
                                });
                            let self = this;


                            setTimeout(
                                function () {
                                    if (self.online) {
                                        let param = self.number;
                                        self.router.navigate(['consultation/' + param], { queryParams: { number: self.number, token: self.userToken, userId: self.userId } });
                                    } else
                                        self.router.navigate(['feedback/' + self.userToken + '/' + self.userId])
                                }, 2000
                            )
                        }
                    }
                    );
            }
        )
    }

}
