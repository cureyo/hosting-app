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
  private timeline: any = [];
  private dynamicDiscount: any = [];
  private timelineReady: boolean = false;
  private timeLineCount: number = 0;
  private userId: any;
  private reminderFee: any;
  private payReady: boolean = false;
  private pathWaysId: any;
  private partnerData: any;
  private checkPointsCounts: any;
  private plansReady: boolean = false;
  private doctorName: any;
  private doctorIcon: any;
  private payURL: any;
  private checktypes: any[];
  private feeTable: any = [];
  private testReminder: any;
  private medReminder: any;
  private careSchedule: any;
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
  private monthTable: any = [];
  private totalTestCost = 0;
  private months: any;
  constructor(private _fb: FormBuilder,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: Http,
    private sanitizer: DomSanitizer, ) { }

  ngOnInit() {
    this.mulTable = {
      "2months": 2, "weekly": 0.25, "monthly": 1, "2weeks": 0.5, "3months": 3, "3weeks": 0.75
    }
    this.monthTable = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var self = this;
    (function () {
      var str = window.location.hostname;
      var n = str.indexOf(".");
      self.pageName = str.substring(0, n);
      self.route.params.subscribe(
        params => {
          let param = params['id'];
          self.userId = param;
          self.pathWaysId = params['pathway']
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
                  //this.pathWaysId = t[0];
                  this.careSchedule = pathWaysID.Paths[this.pathWaysId];
                  console.log("pathways Id:", this.pathWaysId);
                  
                  if (!this.careSchedule.plan || this.careSchedule.plan == 'No') {
                    if (this.pathWaysId) {

                    this._authService._getcarePathWays(this.pathWaysId)
                      .subscribe(carepathWaysObj => {

                        console.log(carepathWaysObj);
                        this.objTransactionTableId = carepathWaysObj.objectId;
                        this.carePathWayDetails = carepathWaysObj;
                        var today = new Date();

                        this.timeline[0] = { caption: 'Today', date: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), selected: true, title: 'Treatment Start', content: "Your treatment for " + this.carePathWayDetails.name + " starts today.", img: ["https://care.cureyo.com/img/messengerImages/local_hospital.png"], timeInMills: today.getTime() };


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
                                this.populateTimeline(this.transactionTable, this.carePathWayDetails, this.partnerData);
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
                                      dFees['grand'] = [];
                                      dFees['grand']['total'] = 75 * this.carePathWayDetails.duration;
                                      // dFees['Radiological'] =[];
                                      dFees['consultation']['total'] = 0;
                                      dFees['services']['total'] = 0;
                                      // dFees['Radiological']['Total']  =0;
                                      for (let doctor of plans.consultations) {
                                        dFees[doctor.id] = [];
                                        if (this.transactionTable[doctor.id]) {
                                          console.log(doctor);
                                          if (doctor.online == 'payment' && this.partnerData.consult[doctor.id] && this.partnerData.consult[doctor.id].fee) {
                                            dFees[doctor.id]['online'] = Math.round(this.partnerData.consult[doctor.id].fee * (parseInt(this.carePathWayDetails.duration) / this.mulTable[this.transactionTable[doctor.id].Online['Job_Frequency']]));
                                            onlineFee = dFees[doctor.id]['online'];
                                          }
                                          if (doctor.physical == 'payment'  && this.partnerData.consult[doctor.id] && this.partnerData.consult[doctor.id].fee) {
                                            dFees[doctor.id]['physical'] = Math.round(this.partnerData.consult[doctor.id].fee * (parseInt(this.carePathWayDetails.duration) / this.mulTable[this.transactionTable[doctor.id].Online['Job_Frequency']]));
                                            phyFee = dFees[doctor.id]['physical'];
                                          } else if (doctor.physical == 'reminder') {
                                            dFees[doctor.id]['physical'] = 0;
                                            phyFee = 0;
                                          }
                                          dFees[doctor.id]['consultTotal'] = Math.round(onlineFee + phyFee);
                                          console.log(dFees[doctor.id]);
                                          dFees['consultation']['total'] = Math.round(dFees['consultation']['total'] + dFees[doctor.id]['consultTotal']);

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
                                              this._authService._getTestPrice(item, plans.services[item].partner, this.transactionTable[item + 'LabTest'][item2].TestName)
                                                .subscribe(
                                                priceData => {
                                                  console.log(priceData);
                                                  dFees[item][this.transactionTable[item + 'LabTest'][item2].TestName] = Math.round(priceData.price);
                                                  dFees[item]['total'] = Math.round(dFees[item]['total'] + parseInt(priceData['price']) * (this.carePathWayDetails.duration / this.mulTable[this.transactionTable[item + 'LabTest'][item2].TestFreq]));
                                                  dFees['services']['total'] = Math.round(dFees['services']['total'] + dFees[item]['total']);
                                                  dFees['grand']['total'] = Math.round(dFees['grand']['total'] + dFees['services']['total']);
                                                  for (let i = 0; i < ctr; i++) {
                                                    this.changePayFreq(1, i, this.carePathWayDetails.duration);
                                                  }
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

                                      ctr++;

                                    }
                                    console.log(this.feeTable);
                                    for (let item of this.transactionTable['RadiologicalLabTest']) {
                                      console.log(item.TestName)
                                      console.log(this.feeTable[0]['Radiological'][item.TestName])
                                    }
                                    for (let i = 0; i < ctr; i++) {
                                      this.changePayFreq(1, i, this.carePathWayDetails.duration);
                                    }
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
                  } else {
                    window.location.href = 'https://' + this.pageName + '.cureyo.com'
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
    console.log(value, k, duration);
    console.log(this.feeTable[k]['grand']['total']);
    this.feeTable[k]['bill'] = [];
    this.feeTable[k]['bill']['fee'] = this.feeTable[k]['grand']['total'] / (duration / value);
  }

  postCall(price, k, t) {
    this.payReady = false;
    var b = this.carePathWayDetails.duration;
    if (t == 0) {
      t = 1;
      b = 1;
    }
    const domainURL = "https://subscriptions.zoho.com/api/v1/plans";
    const domData = {
      "plan_code": Math.floor((Math.random() * 100000) + 1),
      "name": this.carePathWayDetails.name + ": " + this.paymentPlans[k].title,
      "recurring_price": price,
      "interval": t,
      "interval_unit": "months",
      "billing_cycles": b,
      "product_id": "657889000000059054"
    };

    let headers = { 'Content-Type': 'application/json;charset=UTF-8', 'X-com-zoho-subscriptions-organizationid': `647692649`, 'Authorization': `Zoho-authtoken cb33ea29420a0744337144465fa53283` };

    this._authService._saveSubscriptionRequest(this.userId, headers, domData, domainURL, 'post')
      .then(
      data => {
        this._authService._getSubscriptionResponse(this.userId)
          .subscribe(
          res => {
            console.log(res);
            // console.log(res.plan.url);
            if (res.code == 0) {
              this.payURL = this.sanitizer.bypassSecurityTrustResourceUrl(res.plan.url);
              this.payReady = true;

              var myIframe = document.getElementById("payFrame");
              console.log(myIframe);
              setTimeout(
                function () {
                  var d = document.getElementById("payFrame");
                  d.scrollIntoView();

                }, 2000
              )

              // $('#payModal').modal('show');


              // $('#profileContent').css({ position: 'fixed' });
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
  populateTimeline(transactionTable, carePathWayDetails, partnerData) {
    var startingPoint = this.careSchedule.activatedOn;
    console.log(partnerData)
    var date = new Date(startingPoint);
    console.log(date);
    var startMonth = date.getMonth();
    var startDate = date.getDate();
    var startYear = date.getFullYear();
    var startTime = date.getTime();
    // var startDate = 
    // var startYear =  
    console.log(transactionTable);
    for (let careItem of carePathWayDetails.checkPoints) {
      console.log(careItem);

      if (careItem.time != "Repeat") {
        var targetTime = startTime + parseInt(careItem.day) * 24 * 60 * 60 * 1000;
        var targetDate = new Date(targetTime);
        var targetDay = targetDate.getDate();
        var targetMonth = targetDate.getMonth();
        var targetYear = targetDate.getFullYear();
        this.timeLineCount++;
        this.timeline[this.timeLineCount] = { caption: targetDay + ' ' + this.monthTable[targetMonth], date: new Date(targetYear, targetMonth + 1, targetDay), title: 'Check Point', content: "Check for: " + careItem.messageText, img: ["https://care.cureyo.com/img/messengerImages/local_hospital.png"], timeInMills: targetTime };

      } else {
        console.log(careItem.checkType);
        if (careItem.checkType === "online-review" || careItem.checkType === "consult-reminder") {
          var consultType;
          if (careItem.checkType == "online-review")
            consultType = "Online";
          else
            consultType = "Physical";

          var iterations = carePathWayDetails.duration / this.mulTable[transactionTable[careItem.consultant][consultType].Job_Frequency];
          console.log(iterations);
          for (let i = 0; i < iterations; i++) {
            var targetTime2 = startTime + parseInt(careItem.day) * 24 * 60 * 60 * 1000 + i * this.mulTable[transactionTable[careItem.consultant][consultType].Job_Frequency] * 30 * 24 * 60 * 60 * 1000;
            var targetDate2 = new Date(targetTime2);
            var targetDay2 = targetDate2.getDate();
            var targetMonth2 = targetDate2.getMonth();
            var targetYear2 = targetDate2.getFullYear();
            let img2 = "https://care.cureyo.com/img/messengerImages/local_hospital.png";
            console.log(partnerData);
            if (partnerData.consult[careItem.consultant] && partnerData.consult[careItem.consultant].img != "")
              img2 = partnerData.consult[careItem.consultant].img;
            this.timeLineCount++;
            if (this.timeline[targetTime2]) {
              var tempTitle = this.timeline[targetTime2].title, tempImage = this.timeline[targetTime2].img, tempContent = this.timeline[targetTime2].content;
              var n = tempTitle.search(consultType + ' Review')
              if (n == -1)
                tempTitle = tempTitle + ' & ' + consultType + ' Review';

              tempImage = tempImage.concat(img2);
              tempContent = tempContent + ' | ' + consultType + " Review with " + partnerData.consult[careItem.consultant].name;
              this.timeline[targetTime2] = { caption: this.timeline[targetTime2].caption, date: this.timeline[targetTime2].date, title: tempTitle, content: tempContent, img: tempImage, timeInMills: this.timeline[targetTime2].timeInMills };
            }

            else {
              this.timeline[targetTime2] = { caption: targetDay2 + ' ' + this.monthTable[targetMonth2], date: new Date(targetYear2, targetMonth2 + 1, targetDay2), title: consultType + ' Review', content: consultType + " Review with " , img: [img2], timeInMills: targetTime2 };
              console.log("new Entry:", targetDay2)
            }


          }


        }
        console.log("%%%%%%%%%%%%%%%");
        console.log(careItem.checkType);

        if (careItem.checkType === "test-reminder" || careItem.checkType === "scan-reminder") {

          var consultType;
          if (careItem.checkType == "test-reminder")
            consultType = "Pathological";
          else
            consultType = "Radiological";

          for (let count in transactionTable[consultType + 'LabTest']) {
            var iterations = carePathWayDetails.duration / this.mulTable[transactionTable[consultType + 'LabTest'][count].TestFreq];
            console.log(consultType, iterations);
            for (let i = 0; i < iterations; i++) {
              var targetTime2 = startTime + parseInt(careItem.day) * 24 * 60 * 60 * 1000 + i * this.mulTable[transactionTable[consultType + 'LabTest'][count].TestFreq] * 30 * 24 * 60 * 60 * 1000;
              var targetDate2 = new Date(targetTime2);
              var targetDay2 = targetDate2.getDate();
              var targetMonth2 = targetDate2.getMonth();
              var targetYear2 = targetDate2.getFullYear();
              let img2 = "https://care.cureyo.com/img/messengerImages/invert_colors.png";
              if (careItem.checkType == "scan-reminder")
                img2 = "https://care.cureyo.com/img/messengerImages/settings_overscan.png";
              this.timeLineCount++;
              if (this.timeline[targetTime2]) {
                var tempTitle = this.timeline[targetTime2].title, tempImage = this.timeline[targetTime2].img, tempContent = this.timeline[targetTime2].content;
                var n = tempTitle.search(consultType + ' Tests')
                if (n == -1)
                  tempTitle = tempTitle + ' & ' + consultType + ' Tests';

                tempImage = tempImage.concat(img2);
                tempContent = tempContent + ' | ' + 'Conduct test: ' + transactionTable[consultType + 'LabTest'][count].TestName;
                this.timeline[targetTime2] = { caption: this.timeline[targetTime2].caption, date: this.timeline[targetTime2].date, title: tempTitle, content: tempContent, img: tempImage, timeInMills: this.timeline[targetTime2].timeInMills };
              }

              else {
                this.timeline[targetTime2] = { caption: targetDay2 + ' ' + this.monthTable[targetMonth2], date: new Date(targetYear2, targetMonth2 + 1, targetDay2), title: consultType + ' Tests', content: 'Conduct test: ' + transactionTable[consultType + 'LabTest'][count].TestName, img: [img2], timeInMills: targetTime2 };
                console.log("new Entry:", targetDay2)
              }


            }
          }

        }
      }
    }


    let ctr = 0, tempTmline = [];
    for (let each in this.timeline) {
      console.log(this.timeline[each])
      tempTmline[ctr] = this.timeline[each];
      ctr++;
    }
    this.timeline = tempTmline;
    console.log(this.timeline);
    this.timeline.sort(function (a, b) { return (a.timeInMills > b.timeInMills) ? 1 : ((b.timeInMills > a.timeInMills) ? -1 : 0); });
    console.log(this.timeline);


    console.log(this.timeline);
    this.timelineReady = true;
  }
}
