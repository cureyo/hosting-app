import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-triage',
  templateUrl: './triage.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class TriageComponent implements OnInit {
  private userBday: any;
  private userEducation: any;
  private userHomeTown: any;
  private userLocation: any;
  private clinicId: any;
  private userWorkHistory: any;
  private currentToken: any;
  private userToken: any;
  private symptomForm: FormGroup;
  private symptoms: any;
  private formReady: boolean = false;
  private diagnosisStarted: boolean = false;
  private questionText: any;
  private questionArray: any = [];
  private buttonHidden:boolean=false;
  private doctorID:any;
  private caredOnesID:any;
  private sex:any;
  public symptomPacket: any;
  public sympArray: any = [];
  public tempSymptomArray:any = [];
  public resultData:any;
  

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fs: FacebookService,
    private http: Http,
    
  ) { }

  ngOnInit() {
     
    this._authService._getSymptoms()
      .subscribe(
      data => {
        this.symptoms = data;
        this.symptomForm = this._fb.group({
          symptomName: ['', Validators.required]
        });
        this.formReady = true;
      }
      );
      //get the doctor id
      this._authService._getDoctorId()
                   .subscribe( Id=>{
                      console.log("ID response is:",Id);
                     this.doctorID=Id.$value;
                         console.log("doctor id is ",this.doctorID);
                   });
        //get the  user id by param
         this.activatedRoute.params.subscribe(
                          params => {
                          let param = params['id'];
                          this.caredOnesID = param;
                          console.log("caredones id here is :",this.caredOnesID);
                         //now code for get the user gender details from firebase
                          this._authService._getcaredOnesDetails(this.doctorID,this.caredOnesID)
                          .subscribe( user=>{

                                    this.sex=user.sex;
                              console.log("user data from caredone-->doc-->user",user);
                          })
                  });           


  }
  saveSymptom(model) {
    console.log("whole model",model);
    console.log("id in model ",model.symptomName.id);
    console.log("value in model",model.symptomName.value)
    this.sympArray[0] = { id: model.symptomName.id, choice_id: 'present' };
    this.tempSymptomArray[0]= { id: model.symptomName.id, choice_id: 'present',name:  model.symptomName.value};
    this.diagnosisStarted = true;
    this.symptomPacket = {
      "sex": this.sex,
      "age": 0,
      "evidence": this.sympArray
    };
    console.log(this.symptomPacket);
    this.getSymptoms(this.symptomPacket)
      .subscribe(data => {
        console.log(data);
        this.questionText = data.question.text;
        this.questionArray = data.question.items;
      });
  }
   updateQuestion(question: string, questionNames:string){
            
           console.log("the question ask:",question);
           console.log("question names:",questionNames)
           let l=this.sympArray.length;
            if(l<5) { //max -limit of search is 5
                console.log("sysmarray length:",l);
           this.sympArray[l] = { id: question, choice_id: 'present'};
           this.tempSymptomArray[l] =  { id: question, choice_id: 'present', name:questionNames};
           this.symptomPacket = {
              "sex": this.sex,
              "age": 0,
              "evidence": this.sympArray
            };
           
            console.log("get the details of symparray",this.sympArray)
           console.log("get the details of symppocket",this.symptomPacket)
              this.getSymptoms(this.symptomPacket)
              .subscribe(data => {
              console.log(data);
              this.resultData=data;
              this.questionText = data.question.text;
              this.questionArray = data.question.items;
              });

            }
            else{
                  this.buttonHidden=true;
                this.questionText = "Thanks you! The details are being shared with the Doctor"
                  
                   console.log("temp symptom array data :",this.tempSymptomArray);

                       // now save questioned data into careones->doctor-patient-->question
                       this._authService._saveQuestionData(this.tempSymptomArray,this.doctorID,this.caredOnesID);

                        //now save the responsed data into careones->doctor-patient-->result
                        this._authService._saveResultedData(this.resultData,this.doctorID,this.caredOnesID);

            }
           
          
   }
  getSymptoms(data) {


    const domainURL = "https://api.infermedica.com/v2/diagnosis";



    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('App-Id', '21d47bec');
    headers.append('App-Key', 'f769f10aa0520be77e8c779ca552c371');
    headers.append('Dev-Mode', 'true')
    // headers.append('Authorization', `Bearer 88e99143c6783437106e779dc1f7910f0bdf1de018c2f3b809470df8bb1074f9`);

    return this.http.post(domainURL, data, {
      headers: headers
    })
      .map((res: Response) => res.json());


  }

}
