import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/firebaseauth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-no-plans',
  templateUrl: './no-plans.component.html',
  styleUrls: ['./no-plans.component.css']
})
export class NoPlansComponent implements OnInit {
 private NoPlansForm:FormGroup;
 private pageName:string;
 private PageId:any;
 private DoctorId:any;
 private userId:any;
 private pathWaysId:any;
 private partnerData:any;
 private checkPointsCounts:any;
 private doctorName:any;
 private doctorIcon:any;
 private checktypes:any[];
 private testReminder:any;
 private medReminder:any;
 private consultReminder:any;
 private consultantID:any;
 private doctorNameFeeDetails:any;
 private objTransactionTableId:any;
 private objTransactionTableObj:any;
 private objTransactionTableObjID:any;
 private LabTest:any;
 private MedTest:any;
 private LabTestArr:any[];
 private MedTestArr:any[];
 private totalTestCost=0;
 private months:any;
 constructor(private _fb: FormBuilder, 
              private _authService: AuthService,  
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

          var self=this;
         (function (){
            var str=window.location.hostname;
            var n=str.indexOf(".");
            self.pageName=str.substring(0, n);
            self.route.params.subscribe(
            params => {
            let param = params['id'];
             self.userId=param;
             })
          })();

         try{ 
           //console.log("userId test:",this.userId);
              if(this.pageName){
                  this._authService._getPageId(this.pageName) //get the pageID
                  .subscribe(Id=>{
                      this.DoctorId=Id.doctorId;
                      this.PageId=Id.fbPageId; 

                      if(this.PageId && this.userId){
                          //service to get the pathwaysId using page Id
                         this._authService._getPathWayId(this.PageId,this.userId)
                          .subscribe(pathWaysID=>{



                            var t=Object.keys(pathWaysID.Paths);                  
                                 this.pathWaysId=t[0];                   
                                // console.log("pathways Id:",this.pathWaysId);
                                  if(this.pathWaysId){
                                       
                                       this._authService._getcarePathWays(this.pathWaysId)
                                        .subscribe(carepathWaysObj=>{


                                          this.objTransactionTableId=carepathWaysObj.objectId;

                                            this._authService._getTransactionTable(this.objTransactionTableId)
                                            .subscribe(obj=>{
                                              this.objTransactionTableObj=obj;
                                               // console.log("object fron transaction table:",this.objTransactionTableObj);


                                                for(var temp in this.objTransactionTableObj ){
                                                         console.log("temp check",temp, typeof temp);
                                                        if (temp==="9809809807"){
                                                            this.objTransactionTableObjID=temp;
                                                         // console.log("data",this.objTransactionTableObj[temp],this.objTransactionTableObjID)
                                                        }
                                                        else if (temp=="LabTest"){
                                                          this.LabTest=this.objTransactionTableObj[temp];
                                                            this.LabTestArr= Object.values(this.LabTest);
                                                              //get the lab test price from firebase:
                                                              console.log("labtest array data:",this.LabTestArr);
                                                              for(var i=0;i<this.LabTestArr.length;i++){
                                                                    
                                                                     this.months=this.LabTestArr[i].TestFreq;
                                                                      this.months =this.months.slice(0,-6);
                                                                     

                                                                      this._authService._getLabTestDataForSearch(this.LabTestArr[i].TestName)
                                                                      .subscribe(testPricing=>{
                                                                        var index=testPricing.length-1;
                                                                         this.totalTestCost=0;
                                                                        console.log("test pricing value from the firebase :",testPricing,index);
                                                                            this.totalTestCost+=testPricing[index].price;
                                                                            this.totalTestCost=this.totalTestCost * this.months;
                                                                      
                                                                      })
                                                         
                                                              }
                                                                
        
                                                            //console.log("lab test value ;",this.LabTestArr, typeof this.LabTestArr);
                                                        }
                                                        else if(temp=="MedicationReminder"){
                                                           this.MedTest=this.objTransactionTableObj[temp];
                                                           this.MedTestArr= Object.values(this.MedTest);
                                                           //console.log("med test value ;",this.MedTest);
                                                        }
                                                }

                                            })


                                          console.log("care path ways Object:",carepathWaysObj);
                                          this.checkPointsCounts=carepathWaysObj.checkPoints.length;
                                          console.log("checkpoints count:", this.checkPointsCounts);

                                         for (var i=0;i< carepathWaysObj.checkPoints.length;i++){
                                               // console.log("called",carepathWaysObj.checkPoints[i].checkType);
                                               if(carepathWaysObj.checkPoints[i].checkType=="test-reminder"){
                                                      this.testReminder=carepathWaysObj.checkPoints[i].checkType;
                                               }
                                               else if(carepathWaysObj.checkPoints[i].checkType=="med-reminder"){
                                                      this.medReminder=carepathWaysObj.checkPoints[i]
                                               }
                                               else if(carepathWaysObj.checkPoints[i].checkType=="consult-reminder"){
                                                      this.consultReminder=carepathWaysObj.checkPoints[i];
                                                      this.consultantID=carepathWaysObj.checkPoints[i].consultant;
                                                         //console.log("IDS",this.DoctorId,this.consultantID)

                                                       if(this.DoctorId  && this.consultantID){
                                                            this._authService._getPartner(this.DoctorId)
                                                            .subscribe(partner=>{
                                                                this.partnerData=partner;
                                                               // console.log("partners Data",this.partnerData,this.partnerData.consultant);
                                                                 for (var j in this.partnerData.consultant)
                                                                  {     
                                                                        if (j==this.consultantID){
                                                                         this.doctorNameFeeDetails= this.partnerData.consultant[j]
                                                                        }
                                                                      
                                                                  }
                                                            })
   
                                                          }
                                                          else{
                                                                alert("doctor name is not found:");
                                                          }






                                               }
                                               
                                         }
                                          
                                              

                                        
                                        })
                                  } 
                                  else{
                                    alert("PathwaysId is not found:")
                                  }
                          })
                      }
                      else{
                        alert("pageId Or UserID not found:");
                      }

                     
                  })


              }
               else{
                   alert("else page name not found:");
               }
         } 
         catch(exp){
            alert("pageName Not found"+exp);

          }
       
      
     
      
  }

        

}
