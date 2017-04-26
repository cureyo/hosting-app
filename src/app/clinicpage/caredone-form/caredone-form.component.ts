import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Caredone } from "../../models/caredone.interface";
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicPageComponent } from "../clinicpage.component";
import {FileUploadComponent} from "../file-upload/file-upload.component"

declare var $: any;
declare var Razorpay: any;

@Component({
  selector: 'app-caredone-form',
  templateUrl: 'caredone-form.component.html',
  moduleId: module.id
})

export class CaredoneFormComponent implements OnInit{

  @Input() clinicId: string;
  @Input() availableSlots: any;
  @Input() fee: string;
  @Input() drName: string;
  @Input() drImage: string;

  private caredone: FormGroup;
  private payOptions: any;
  private coMsgForm: FormGroup;
  private relationships: any = [];
  private temp: any;
  private vData: any;
  private showErrorFlag: boolean = false;
  private showErrorFlag2: boolean = false;
  private currentUser: any;
  private caredOneAdded: boolean = false;
  private coMessage: any;
  private caredOneId: any;
  private nickName: any;
  private phoneNumber: any;
  private cbTime: any = [];
  private cbDay: any = [];
  private caredOneModel: any;
  private checkBox: boolean = false;
  private consultDate: any;
  private consultTime: any;
  private reportsRequired: boolean = false;

  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router) { }

  ngOnInit() {
    //console.log("Cared one form called");
    //$('#myModal').hide();
    $.getScript('https://checkout.razorpay.com/v1/checkout.js');
    var tempTransNo = Math.floor((Math.random() * 100000) + 1);
    this.temp = tempTransNo;
    let i = 0, ctr = 2;
    var today = new Date();
    this.cbDay[0] = today.getTime();
    var day1 = new Date(today.getTime() + (1000 * 60 * 60 * 24));
    this.cbDay[1] = day1.getTime();
    for (i = 0; i < 10; i++) {
      var day2 = new Date(day1.getTime() + (1000 * 60 * 60 * 24));
      this.cbDay[ctr] = day2;
      day1 = day2;
      ctr++;

    }
    this.caredone = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
            email: ['', Validators.required],
            avatar: [''],
            phone: ['', Validators.required],
            uid: [this.temp, Validators.required],
            consultMode: ['video', Validators.required],
            consultType: ['follow-up', Validators.required],
            payment: '',
            consultDate: ['', Validators.required],
            consultTime: ['', Validators.required],
            file: '',
            clinicId: this.clinicId,
            clinicURL: window.location.hostname,
            description: ''
          });


  }
 
reportsReqd() {
  this.reportsRequired = !this.reportsRequired;
  console.log(this.reportsRequired);
}
  updateDate(date) {
    console.log("seleced date is", date);
    this.cbTime = [];
    this._authService._getAvailableSlots(this.clinicId, date).subscribe(
      availability => {
        console.log(availability);
        let len = this.availableSlots.length, ctr = 0;
        for (ctr = 0; ctr < len; ctr++) {
          if (!availability[this.availableSlots[ctr]]) {
            this.cbTime[ctr] = this.availableSlots[ctr]
          }

        }
      });


  }



  showError() {
    console.log("clicked");
    this.showErrorFlag = true;
  }
  showError2() {
    console.log("clicked");
    this.showErrorFlag2 = true;
  }
  onSubmit(model, event) {
    console.log(model);
    console.log("model");
    model['setupPassword'] = "pass" + model['phone'];
    model['transId'] = this.temp;
    this.consultDate = model['consultDate'];
    this.consultTime = model['consultTime'];
    this._authService._DoctorConsultationSlot(this.clinicId, model['consultDate'], model['consultTime'], model);
    this._authService._DoctorConsultationDetails(this.temp, model)
     
    $.notify({
        	icon: "notifications",
        	message: "Details saved. Please complete the payment to confirm the appointment."

        },{
            type: 'cureyo',
            timer: 4000,
            delay: 4000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    var fee2Pay
    if (model['consultMode'] == 'video')
    fee2Pay = this.fee;
    else 
    fee2Pay = parseInt(this.fee) + 30;

    var fee2Pay2 = fee2Pay * 100;
    let key = "rzp_test_L4gurxBCJRcc7c", name = this.drName, description = "Consultation with " + this.drName, image = this.drImage, preName = model['name'], preEmail = model['email'], prePhone = model['phone'];
    this.rzrPay(key, fee2Pay2, name, description, image, preName, preEmail, prePhone);
    this._authService.createMailUser({email: preEmail, password: "pass" + prePhone});
  }
  
  correctIM() {
    console.log("executed");
    setTimeout(function () {
      //var x = document.getElementsByClassName("immoral-modal-container");
      console.log($('#imojo-rc-iframe'));
      setTimeout(function () {
        $('#imojo-rc-iframe').css('z-index', '1001');
      }, 2000)



    }, 3000)

  }
  rzrPay(key, amount, name, description, image, preName, preEmail, prePhone) {
    console.log("executed");
     var self = this;
    this.payOptions = {
      "key": key,
      "amount": amount, // 2000 paise = INR 20
      "name": name,
      "description": description,
      "image": image,
      "handler": function (response) {
        console.log(response);
       
        self.paymentDone(response, preEmail, prePhone);
      },
      "prefill": {
        "name": preName,
        "email": preEmail,
        "contact": prePhone
      },
      "notes": {
        "address": "Hello World"
      },
      "theme": {
        "color": "#137a9c"
      }
    };
    //var rzp1 = new Razorpay(options);
    this.payRzr();
  }

  payRzr() {
    console.log(this.payOptions);
    var options = this.payOptions;
    console.log(options);
    $.getScript('https://checkout.razorpay.com/v1/checkout.js', function (e) {
      var rzp1 = new Razorpay(options);
      rzp1.open();
     
    });
    }

    paymentDone(response, preEmail, prePhone) {
      console.log(response);
      if(response.razorpay_payment_id) {
        this._authService._ConsultationPayment(this.temp, 'completed', response.razorpay_payment_id);
          $.notify({
        	icon: "notifications",
        	message: "Your consultation is confirmed. Please check your SMS/ Email. Payment id is " + response.razorpay_payment_id

        },{
            type: 'cureyo',
            timer: 4000,
            delay: 4000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });

        this.caredone.reset();
       
      }
      else {
        $.notify({
        	icon: "notifications",
        	message: "Seems payment has not been completed"

        },{
            type: 'cureyo',
            timer: 4000,
            delay: 4000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
      }
      
    }

}
