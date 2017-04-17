import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Caredone } from "../../models/caredone.interface";
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicPageComponent } from "../clinicpage.component";

declare var $: any

@Component({
  selector: 'app-caredone-form',
  templateUrl: 'caredone-form.component.html',
  moduleId: module.id
})

export class CaredoneFormComponent implements OnInit {

  @Input() clinicId: string;
  @Input() availableSlots: any;
  @Input() fee: string;

  private caredone: FormGroup;
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

  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router) {}

  ngOnInit() {
    //console.log("Cared one form called");
    //$('#myModal').hide();
    this.temp = Math.floor((Math.random() * 1000000000) + 1);
    let i = 0;
    var today = new Date();
    var day1 = new Date(today.getTime() + (1000 * 60 * 60 * 24));
    for (i=0; i < 10; i++) {
      var day2 = new Date(day1.getTime() + (1000 * 60 * 60 * 24));
      this.cbDay[i] = day2;
      day1 = day2;

    }
        this._authService._getUser()
      .subscribe(
      data => {
        console.log(data);
        if (!data.isAuth) {
       
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
        file:''
      });
        }
        else {
        this.caredone = this._fb.group({
        name: [data.user.firstName + ' ' + data.user.lastName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        email: [data.user.email, Validators.required],
        avatar: [data.user.avatar],
        phone: ['', Validators.required],
        uid: [data.user.uid, Validators.required],
        consultMode: ['video', Validators.required],
        consultType: ['follow-up', Validators.required],
        payment: '',
        consultDate: ['', Validators.required],
        consultTime: ['', Validators.required],
        file:''
      });
        }
      });
   




  }
  updateDate(date) {
    console.log("seleced date is", date);
    this.cbTime = [];
    this._authService._getAvailableSlots(this.clinicId, date).subscribe(
            availability => {
              console.log(availability);
              let len = this.availableSlots.length, ctr = 0;
              for (ctr = 0; ctr< len; ctr++) {
                if (!availability[this.availableSlots[ctr]]) {
                  this.cbTime[ctr] = this.availableSlots[ctr]
                }
                
              }
    });
    

  }
  cancelACO(event) {
    let target = event.target || event.srcElement || event.currentTarget,
      parent = $(target).closest('.card-stats'),
      details = parent.find('.card-content2');

    event.preventDefault();
    details.addClass('hide').find('.fields').empty();
    parent.removeClass('active');
    parent.find('.card-footer').removeClass('hide');
    $('html,body').animate({ scrollTop: $("#AddSection").offset().top - 200 }, 500);

    // $('#findandadd').scrollTop();
  }// cancelACO

  completeACO(event) {
    let target = event.target || event.srcElement || event.currentTarget,
      parent = $(target).closest('.card-stats'),
      details = parent.find('.card-content2');

    event.preventDefault();
    details.addClass('hide').find('.fields').empty();
    parent.removeClass('active');
    parent.find('.card-footer').removeClass('hide');
    $('html,body').animate({ scrollTop: $("#coSection").offset().top - 200 }, 500);
    //this.cancelACO(event);
    // $('#findandadd').scrollTop();
  }// cancelACO

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
    this._authService._DoctorConsultation(this.clinicId, model['consultDate'], model['consultTime'], model);
    var fee2Pay
    if (model['consultMode'] == 'videl')
    fee2Pay = this.fee;
    else 
    fee2Pay = parseInt(this.fee) + 30;
    window.location.href = "https://www.instamojo.com/Cureyo/cureyo-care-on-boarding-tests/?embed=form&data_name=" + model['name'] + "&data_email=" +  model['email']  + "&data_phone=" +  model['phone']  + "&data_amount=" + fee2Pay + "&data_Field_70402=" + this.clinicId + "&data_hidden=data_Field_70402";
     
  }
  login() {
    this._authService.login('facebook');
  }


}
