import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/firebaseauth.service";
//import {MedReminder} from "../../../models/medReminder.interface";
import {FbService} from "../services/facebook.service";

 declare var jQuery:any; 
@Component({
  selector: 'app-check-up-form',
  templateUrl: './check-up-form.component.html',
  styleUrls: ['./check-up-form.component.css']
})
export class CheckUpFormComponent implements OnInit {
   public checkUpForm: FormGroup;
   private userId:any;
   private DoctorId:any;
   private userData:any
   private birthdate:string;
   private fname:any;
   private lname:any;
   private email:any;
   private phone:any;
   private tempdate:any;
  constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router
  ) { 
        
          
  }

  ngOnInit() { 
     this._authService._getDoctorId()
       .subscribe(data=>{
                   this.DoctorId=data.$value;
                    console.log("the doctor id is ",this.DoctorId);
                    this._authService._getUser()
      .subscribe(data=>{
             console.log("user basic infor is :",data.user)
            this.userId=data.user.uid;
            this.email=data.user.email;
            this.fname=data.user.firstName;
            this.lname=data.user.lastName;

              console.log("userid is :",this.userId);
              this._authService._getUserDataFromCaredOnePatientInsights(this.userId,this.DoctorId)
              .subscribe(res=>{
                      this.birthdate=res.birthday;
  
                   
                      //convert the mm-dd-yyyy to yyyy-mm--dd
                      var nMonth = this.birthdate.indexOf('/');
                      var month = this.birthdate.substring(0, nMonth);
                      var len = this.birthdate.length;
                      var birthday2half = this.birthdate.substring(nMonth + 1, len);
                      var nDate = birthday2half.indexOf('/');
                      var date = birthday2half.substring(0, nDate);
                      var len2 = birthday2half.length;
                      var year = birthday2half.substring(nDate + 1, len2);
                      this.birthdate =year +"-"+ month+"-"+date;
                     
              }) 
           });
            
        });
          
           if ( this.fname &&  this.lname &&  this.email && this.birthdate){
                  this.checkUpForm = this._fb.group({
                        first_Name:[this.fname,Validators.required],
                        last_Name:[this.lname,Validators.required],
                        Email:[this.email,Validators.required],
                        phone:[,Validators.required],
                        DOB:[this.birthdate],
                        visit_Type:[,Validators.required],
                        description:[,Validators.required],
                        conditions: this._fb.array([
                        this.initConditions()
                        ])
                  });
           }
          else{
             
                this.checkUpForm = this._fb.group({
                        first_Name:[,Validators.required],
                        last_Name:[,Validators.required],
                        Email:[,Validators.required],
                        phone:[,Validators.required],
                        DOB:[this.birthdate],
                        visit_Type:[,Validators.required],
                        description:[,Validators.required],
                        conditions: this._fb.array([
                        this.initConditions()
                        ])
                  });

              }

        
      
       

    
  }
  
    initConditions(){
      return this._fb.group({
        conditionsOption:[],
       since:[,Validators.required],
       when:[,Validators.required],
    });
  }//initLabTest's
  AddConditions(){
      console.log("Add conditions called");
    const control = <FormArray>this.checkUpForm.controls['conditions'];
    control.push(this.initConditions());

  }//addLabTest
  

  save_checkUpForm =(model)=>{
         
        let job = model['value'],
        conditions = job['conditions'],
        ctr = 0,
        flag;
        
            let reminders = {
                    "First_Name":job['first_Name'],
                    "Last_Name": job['last_Name'],
                    "Email":job['Email'],
                    "Phone": job['phone'],
                    "DOB":job['DOB'],
                    "Visit_Type":job['visit_Type'],
                    "description":job['description'],

                    "Job_conditions": []
            };
             
              console.log("conditions data test ::",conditions);
              for(let i=0; i < conditions.length; i++) {
                  reminders.Job_conditions.push({
                    " conditions_option" : conditions[i].conditionsOption,
                    "Since" : conditions[i].since,
                    "When" : conditions[i].when,
                    
                  });
         }
              
              console.log("reminder value test ::",reminders);
              this._authService._saveCheckUpFormHosting(reminders,this.userId,this.DoctorId);
  }
   
  
    
          

}
