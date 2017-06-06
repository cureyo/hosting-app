import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Http, Response, Headers, Jsonp } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any
@Component({
  selector: 'app-no-plans',
  templateUrl: './no-plans.component.html',
  styleUrls: ['./no-plans.component.css']
})
export class NoPlansComponent implements OnInit {
  private NoPlansForm: FormGroup;
  private pageName: string;
  private PageId: any;
  private DoctorId: any;
  private userId: any;
  private reminderFee: any;
  private payReady: boolean = false;
  private pathWaysId: any;
  private partnerData: any;
  private checkPointsCounts: any;
  private plansReady: boolean = false;
  private doctorName: any;
  private doctorIcon: any;
  private payURL:any;
  private checktypes: any[];
  private feeTable: any = [];
  private testReminder: any;
  private medReminder: any;

  private consultReminder: any;
  private consultantID: any;
  private carePathWayDetails: any;
  private doctorNameFeeDetails: any;
  private objTransactionTableId: any;
  private transactionTable: any;
  private objTransactionTableObj: any;
  private objTransactionTableObjID: any;
  private LabTest: any;
  private paymentPlans: any;
  private MedTest: any;
  private LabTestArr: any[];
  private MedTestArr: any[];
  private existingPlans: any[];
  private mulTable: any = [];
  private totalTestCost = 0;
  private months: any;
  constructor(private _fb: FormBuilder,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: Http, 
    private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.mulTable = {
      "2months": 2, "weekly": 0.25, "monthly": 1, "2weeks": 0.5, "3months": 3
    }
    
    var self = this;
    (function () {
      var str = window.location.hostname;
      var n = str.indexOf(".");
      self.pageName = str.substring(0, n);
      self.route.params.subscribe(
        params => {
          let param = params['id'];
          self.userId = param;
        })
    })();

    try {
      //console.log("userId test:",this.userId);
      if (this.pageName) {
        this._authService._getPageId(this.pageName) //get the pageID
          .subscribe(Id => {
            this.DoctorId = Id.doctorId;
            this.PageId = Id.fbPageId;
            console.log("user Id: ", this.userId, "page ID: ", this.PageId)
            if (this.PageId && this.userId) {
              //service to get the pathwaysId using page Id
              this._authService._getPathWayId(this.PageId, this.userId)
                .subscribe(pathWaysID => {


                  console.log(pathWaysID);
                  var t = Object.keys(pathWaysID.Paths);
                  this.pathWaysId = t[0];
                  console.log("pathways Id:", this.pathWaysId);
                  if (this.pathWaysId) {

                    this._authService._getcarePathWays(this.pathWaysId)
                      .subscribe(carepathWaysObj => {

                        console.log(carepathWaysObj);
                        this.objTransactionTableId = carepathWaysObj.objectId;
                        this.carePathWayDetails = carepathWaysObj;
                        this.reminderFee = parseInt(this.carePathWayDetails.duration) * 75;
                        console.log(this.carePathWayDetails);
                        this._authService._getPartner(this.DoctorId)
                          .subscribe(
                          partners => {
                            this.partnerData = partners;
                            console.log(this.partnerData)
                            this._authService._getTransactionTable(this.objTransactionTableId)
                              .subscribe(obj => {
                                this.transactionTable = obj;
                                console.log(this.transactionTable)
                                this._authService._getPaymentPlans(this.DoctorId)
                                  .subscribe(
                                  paymentPlanData => {

                                    this.paymentPlans = paymentPlanData.plans;
                                    console.log(this.paymentPlans);
                                    let ctr = 0;
                                    for (let plans of this.paymentPlans) {
                                     
                                      console.log(plans);
                                      let fees = [], dFees = [], onlineFee = 0, phyFee = 0;
                                      dFees['consultation'] = [];
                                      dFees['services'] = [];
                                      dFees['grand'] =[];
                                      dFees['grand']['total']=75 *this.carePathWayDetails.duration;
                                      // dFees['Radiological'] =[];
                                      dFees['consultation']['total'] = 0;
                                      dFees['services']['total'] = 0;
                                      // dFees['Radiological']['Total']  =0;
                                      for (let doctor of plans.consultations) {
                                        dFees[doctor.id] = [];
                                        if (this.transactionTable[doctor.id]) {
                                          console.log(doctor);
                                          if (doctor.online == 'payment') {
                                            dFees[doctor.id]['online'] = this.partnerData.consultant[doctor.id].fee * (parseInt(this.carePathWayDetails.duration) / this.mulTable[this.transactionTable[doctor.id].Online['Job_Frequency']])
                                            onlineFee = dFees[doctor.id]['online'];
                                          }
                                          if (doctor.physical == 'payment') {
                                            dFees[doctor.id]['physical'] = this.partnerData.consultant[doctor.id].fee * (parseInt(this.carePathWayDetails.duration) / this.mulTable[this.transactionTable[doctor.id].Online['Job_Frequency']])
                                            phyFee = dFees[doctor.id]['physical'];
                                          } else if (doctor.physical == 'reminder') {
                                            dFees[doctor.id]['physical'] = 0;
                                            phyFee = 0;
                                          }
                                          dFees[doctor.id]['consultTotal'] = onlineFee + phyFee;
                                          console.log(dFees[doctor.id]);
                                          dFees['consultation']['total'] = dFees['consultation']['total'] + dFees[doctor.id]['consultTotal'];
                                         
                                          console.log(dFees['consultation']['total'])
                                          console.log(dFees['grand']['total'])
                                          //console.log(fees);
                                          //dFees[doctor.id] = fees;
                                          console.log(dFees);
                                        }

                                      }
                                       dFees['grand']['total'] = dFees['grand']['total'] + dFees['consultation']['total'];
                                      console.log(plans.services);
                                      for (let item in plans.services) {
                                        console.log(item);
                                        dFees[item] = [];
                                        dFees[item]['total'] = 0;
                                        if (this.transactionTable[item + 'LabTest']) {
                                          console.log(plans.services[item]);
                                          if (plans.services[item].transaction == 'payment') {
                                            for (let item2 in this.transactionTable[item + 'LabTest']) {
                                              this._authService._getTestPrice(item, "LalPathLabs", this.transactionTable[item + 'LabTest'][item2].TestName)
                                                .subscribe(
                                                priceData => {
                                                  console.log(priceData);
                                                  dFees[item][this.transactionTable[item + 'LabTest'][item2].TestName] = priceData.price;
                                                  dFees[item]['total'] = dFees[item]['total'] + parseInt(priceData['price']) * (this.carePathWayDetails.duration / this.mulTable[this.transactionTable[item + 'LabTest'][item2].TestFreq]);
                                                  dFees['services']['total'] = dFees['services']['total'] + dFees[item]['total'];
                                                  dFees['grand']['total'] = dFees['grand']['total'] + dFees['services']['total'];
                                                }
                                                )
                                            }




                                            console.log(dFees);
                                            //dFees[doctor.id] = fees;
                                            //this.feeTable[item] = dFees;

                                          }
                                        }

                                      }
                                      console.log(this.feeTable);
                                      this.feeTable[ctr] = dFees;
                                      this.changePayFreq(1, ctr, this.carePathWayDetails.duration);
                                      ctr++;

                                    }
                                    console.log(this.feeTable);
                                    this.plansReady = true;

                                  }
                                  )
                              })
                          }
                          )



                      })
                  }
                  else {
                    alert("PathwaysId is not found:")
                  }
                })
            }
            else {
              alert("pageId Or UserID not found:");
            }


          })


      }
      else {
        alert("else page name not found:");
      }
    }
    catch (exp) {
      alert("pageName Not found" + exp);

    }




  }

changePayFreq(value, k, duration) {
  if (value == 0) {
    value = duration;
  }
this.feeTable[k]['bill'] = [];
this.feeTable[k]['bill']['fee'] = this.feeTable[k]['grand']['total'] / (duration/value);
}

  postCall(price,k, t){
    this.payReady = false;
  var b = this.carePathWayDetails.duration;
  if (t==0) {
    t = 1;
    b = 1;
  }
   const domainURL = "https://subscriptions.zoho.com/api/v1/plans";
    const domData = {
    "plan_code":Math.floor((Math.random() * 100000) + 1),
    "name": this.carePathWayDetails.name + ": " + this.paymentPlans[k].title,
    "recurring_price": price,
    "interval": t,
    "interval_unit": "months",
    "billing_cycles": b,
    "product_id": "657889000000059054"
    };

    let headers = { 'Content-Type': 'application/json;charset=UTF-8' ,'X-com-zoho-subscriptions-organizationid': `647692649`, 'Authorization':`Zoho-authtoken cb33ea29420a0744337144465fa53283`};
    
    this._authService._saveSubscriptionRequest(this.userId, headers, domData, domainURL, 'post')
    .then(
      data => {
        this._authService._getSubscriptionResponse(this.userId)
        .subscribe(
          res => {
            console.log(res.plan.url);
            if (res.code == 0) {
              this.payURL = this.sanitizer.bypassSecurityTrustResourceUrl(res.plan.url);
              this.payReady = true;
              
               $('#payModal').modal('show');

   
    $('#profileContent').css({ position: 'fixed' });
            }
          }
        )
      }
    )
}
closePayModal() {
  $('#payModal').modal('hide');

   
    $('#profileContent').css({ position: '' });

}
}
