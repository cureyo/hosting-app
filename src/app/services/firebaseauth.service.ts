import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
//import { AngularFire, FirebaseAuth, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { AngularFireModule } from 'angularfire2';
import {AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {  AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import { AppConfig } from "../config/app.config";
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  users: FirebaseListObservable<any[]>;
  doctorsList: FirebaseListObservable<any[]>;
  jobsList: FirebaseListObservable<any[]>;
  pathologicalList: FirebaseListObservable<any[]>;
  medicineList: FirebaseListObservable<any[]>;
  userData: any;

  private db = AppConfig.database;

  constructor(public afa: AngularFireAuth,public afd: AngularFireDatabase, private router: Router) {
    this.users = afd.list(this.db.users);
    this.doctorsList = afd.list(this.db.doctors);
    this.jobsList = afd.list(this.db.scheduledJobs);
    this.pathologicalList = afd.list(this.db.pathologicalTestDetails + "/TestNames");
    this.medicineList = afd.list(this.db.pathologicalTestDetails + "/MedNames");
  }//constructor

  _findDoctor(doctorId) {

    return this.doctorsList.subscribe(
      items => {
        return items.filter(item => item.$key === doctorId)[0];
      }
    );

  }//_findDoctor

  isAuthenticated() {
    return this.afa.authState.subscribe(
      user => { return !!user }
    );
  }

  // login(provider) {
  //   console.log(provider)
  //   this.afa.login({
  //     //provider: provider
  //   });

  // }//login

  createMailUser(details) {
    console.log(details)
    return this.afa.auth.createUserWithEmailAndPassword(details.email, details.password)

  }
  loginMailUser(details) {
    console.log(details)
    return this.afa.auth.signInWithEmailAndPassword(details.email, details.password);
    //return this.afa.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    // return this.afa.login(details,
    //       {
    //         provider: AuthProviders.Password,
    //         method: AuthMethods.Password,
    //       });
  }//login
  // doclogin() {

  //   this.afa.login({
  //     provider: AuthProviders.Facebook,
  //     method: AuthMethods.Popup,
  //     scope: ["manage_pages", "publish_pages"]
  //   });
  // }
  // fbApplogin() {

  //   this.afa.login({
  //     provider: AuthProviders.Facebook,
  //     method: AuthMethods.Redirect,
  //     scope: ["user_friends", "user_relationships", "user_relationship_details"]
  //   });

  // }//fb App login
  clinicFblogin() {
  console.log("clinic login firebasee called:");
  //this.afa.
  return this.afa.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider().addScope("user_education_history").addScope("user_birthday").addScope("user_work_history").addScope("user_hometown").addScope("user_location"));
  //  return (
  //   this.afd.login({
  //     provider: AuthProviders.Facebook,
  //     method: AuthMethods.Popup,
  //     scope: [
  //           "user_birthday",
  //           "user_work_history", 
  //           "user_hometown",
  //           "user_education_history",
  //           "user_location"
  //      ]
  //   })
  //  )

  }//clinic fb-login

  logout() {

    window.location.href = window.location.origin + '/home.html';
    return this.afa.auth.signOut();
  }//logout

  public _saveUser(formData) {
    console.log("formdata");
    console.log(formData);
    const db = this.afd.object(this.db.users + formData.authUID);
    db.set(formData)
    //this.router.navigate(['dashboard']);
  }//_saveUser
  
  //save new Check-in
    public _saveCheckInData(doctorId,patientId, data) {
      // console.log("insights path:",this.db.PatientsInsights  + doctorId +  patientId);
      console.log("data of patient saved",this.db.PatientsInsights + doctorId + '/'+  patientId, data);
      console.log(data);
    const db = this.afd.object(this.db.PatientsInsights  + doctorId + '/'+  patientId);
    return db.set(data)
    
  }//_saveCheckIn
  // save new Check-in
    public _saveCheckIn(clinicId, date, id, count) {
    const db = this.afd.object(this.db.checkIns + clinicId + '/' + date + '/' + count);
    db.set(id);
    console.log("set for ", this.db.checkIns + '/' + clinicId + '/' + date + '/' + count)
    
  }//_saveCheckIn
    
    //save Question Data
       public _saveQuestionData(data,doctorID,userID){
         const db=this.afd.object(this.db.Diagnosis +doctorID +'/' +userID +'/'+'Question')
         db.set(data);
       }
    //end of Question Data
    //save Result Data
       public _saveResultedData(data,doctorID,userID){
         const db=this.afd.object(this.db.Diagnosis +doctorID +'/' +userID +'/'+'Result')
         db.set(data);
       }
    //end of Question Data
     public _getCheckIn(clinicId, date) {
       console.log(this.db.currentQ + clinicId + '/' + date);
    return this.afd.object(this.db.currentQ  + clinicId + '/' + date );
  }//_getCheckIn

  public _getPageId(pageName){
     return this.afd.object(this.db.doctorPages +'/'+pageName)
  }
 public _getPathWayId(pageId,userID){
    return this.afd.object(this.db.CareSchedule +pageId+'/'+userID);
 }
 public _getcarePathWays(pathwaysId){
    return this.afd.object(this.db.CarePathways+'/'+pathwaysId);
 }
  public _getPartner(userId) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.afd.object(this.db.Partners + userId)

  }
  public _getTransactionTable(objectId){
     return this.afd.object(this.db.TransactionTable + objectId);
  }
 
   //get user work history and all from insights
   public _getUserDataFromCaredOnePatientInsights(userID,doctorID){
      //console.log("insight get function called ",this.db.PatientsInsights +'/'+doctorID+'/'+ userID);
     return  this.afd.object(this.db.PatientsInsights  + doctorID + '/'+  userID)
   }
    //end of insights part

    //get caredones gender from caredones-->doctor-->user(caredone)
     public _getcaredOnesDetails(doctorID,userID){
      // console.log("get caredone gender function call ",this.db.caredOnes +'/'+doctorID+'/'+ userID)
         return  this.afd.object(this.db.caredOnes + doctorID + '/'+  userID).first();
     }
    //end of get caredones gender

   //By Chatty - save new Check-in
    public _getNoOfCheckIns(clinicId, date) {
    return this.afd.object(this.db.checkIns + clinicId + '/' + date) 
    
  }//_saveCheckIn

  public _getSymptoms() {
    return this.afd.object(this.db.symptoms)
  }
  public _updateReminders(data, key) {

    console.log("testing the data and key", data, key)
    const db = this.afd.object(this.db.scheduledJobs + '/' + key);
    db.set(data).then(
      (item) => {
        console.log(item);
      }
    );
    return

  }//_updateReminders

  public _deleteReminders(key) {

    const db = this.afd.object(this.db.scheduledJobs + '/' + key);
    db.remove().then(
      (item) => {
        console.log(item);
      }
    );
    return

  }//_updateReminders
  
  public _getDoctorPage(pageId) {
    console.log(this.db.doctorPages + pageId);
    return this.afd.object(this.db.doctorPages + pageId);
  }//_findCaredoneByKey
  //get the doctor id from doctorPages
  public _getDoctorId(clinicId){
       console.log("path for doctor-id",this.db.doctorPages + clinicId + '/doctorId');
       return this.afd.object(this.db.doctorPages + clinicId + '/doctorId');
  }
    public _getfbPageId(clinicId){
       console.log("path for doctor-id",this.db.doctorPages + clinicId + '/fbPageId');
       return this.afd.object(this.db.doctorPages + clinicId + '/fbPageId');
  }
  public _DoctorConsultationSlot(clinicId, consultDate, consultTime, consultData) {
    var update = this.afd.object(this.db.clinicConsultSlots + clinicId + '/' + consultDate + '/' + consultTime);
    update.set(consultData);
  }
    public _saveHumanAPIData(data, userId) {
      console.log(this.db.humanAPI + userId);
    var update = this.afd.object(this.db.humanAPI + userId);
    return update.set(data);
  }
  public _DoctorConsultationDetails(transId, data) {
    var update = this.afd.object(this.db.clinicConsultDets + transId);
    update.set(data);
  }


  public _ConsultationPayment(transId, status, paymentId) {
    var update = this.afd.object(this.db.clinicConsultDets + transId + '/payment');
    update.set({
      status: status,
      paymentId: paymentId
    });
  }
  public _RequestOTP(number, code) {
    var update = this.afd.object(this.db.OTPRequests + number );
    update.set({code: code, status: 'requested'});
  }
    public _UpdateOTP(number) {
    var update = this.afd.object(this.db.OTPRequests + number + '/status');
    update.set('confirmed');
  }
   public _SendMessage(transId, messageData, index) {
    var update = this.afd.object(this.db.clinicConsults + transId + '/Message/' + index );
    update.set(messageData);
  }
     public _GetMessages(transId) {
   return this.afd.object(this.db.clinicConsults + transId + '/Message/')
  }
       public _GetDoctorEmail(pageId) {
   this.afd.object(this.db.doctorPages + pageId + '/docDetails')
   .subscribe(
     data => {
       return data.drEmail;
     }
   )
  }
  public _GetDoctorDetails(pageId) {
   return this.afd.object(this.db.doctorPages + pageId + '/docDetails')
   
  }
  public _GetDoctorPhone(pageId) {
    console.log(this.db.doctorPages + pageId + '/docDetails');
   this.afd.object(this.db.doctorPages + pageId + '/docDetails')
   .subscribe(
     data => {
       return data.drPhone;
     }
   )
  }
    public _GetDoctorPwd(pageId) {
   this.afd.object(this.db.doctorPages + pageId + '/docDetails')
   .subscribe(
     data => {
       return data.drPwd;
     }
   )
  }
       public _GetConsultIds(consultId) {
   return this.afd.object(this.db.clinicConsultDets + consultId)
  }
    public _UpdatePeerVideo(transId, status, peerId, role) {
    var update = this.afd.object(this.db.clinicConsults + transId + '/' + role);
    update.set({
      status: status,
      peerId: peerId
    });
  }
  public _GetPeerVideo(transId, peer) {
    return this.afd.object(this.db.clinicConsults + transId + '/' + peer);
  }
    public _GetSharedReports(clinicId, transId) {
    return this.afd.object(this.db.patientFiles + clinicId + '/' + transId);
  }

  public _getAvailableSlots(clinicId, consultDate) {
    return this.afd.object(this.db.clinicConsultSlots + clinicId + '/' + consultDate);

  }


  public _saveReminders(data) {
    return this.afd.list(this.db.scheduledJobs)
      .push(data);
  }//_saveReminders
 public _savePatientHx(data, patientId, doctorId) {
    return this.afd.object(this.db.PatientHx + doctorId + '/' + patientId)
      .set(data);
  }//_saveReminders
   public _savePatientFeedback(data, patientId, doctorId) {
    return this.afd.object(this.db.feedback + doctorId + '/' + patientId)
      .set(data);
  }//_saveReminders
  public _saveOnboardingReview(data, caredoneId, route) {
    const onboardingdata = this.afd.object(this.db.onboardingReview + '/' + caredoneId + '/' + route)
    return onboardingdata.set(data);


  }//save onboardingReviewreview data

  public _getPathologicalTests() {
    return this.pathologicalList;
  }

  public _getMedicineNames() {
    return this.medicineList;
  }

  public _saveUserCoverPhoto(uid, cover) {
    return this.afd.object(this.db.users + uid)
      .update({ cover: cover });
  }//_saveUserCoverPhoto
  public _getHxFormNames() {
    return this.afd.object(this.db.HxFormNames);
      
  }//_saveReminders
    public _getHxForms() {
    return this.afd.object(this.db.HxForms);
      
  }//_saveReminders
      public _getHxForm(form) {
    return this.afd.object(this.db.HxForms + form);
      
  }//_saveReminders
  public _getCoverPhoto(uid) {

    return this.afd.object(this.db.users + uid);


  }//_saveUserCoverPhoto
  public _getUserId(uid) {
    console.log(this.db.userIds + uid);

    return this.afd.object(this.db.userIds + uid);


  }//_saveUserCoverPhoto


  public _saveCaredOne(data, observerId) {
    const caredones = this.afd.object(this.db.caredOnes + observerId + '/' + data['uid']);
    return caredones.set(data);
  }//_saveCaredOne

  public _saveDoctor(formData) {
    console.log("formdata");
    console.log(formData);
    const db = this.afd.object(this.db.docUsers + formData.authUID);
    db.set(formData)
    //this.router.navigate(['dashboard']);
  }//_saveDoctor


  //get the msg for caredone mobile view form
  public _getmsgFromSendMessage(currentUserId, UserID) {
    console.log("the id's i have passed here :", currentUserId, UserID);
    return this.afd.list(this.db.sendMessages + UserID + '/' + currentUserId);
  }
  public _getObserversList(caredOneId) {
    console.log("i am in firebase and its caredone id:", caredOneId);
    return this.afd.list(this.db.observers + caredOneId);
  }//_getObserversList
  public _updateCaredOne(observerId, uid, data) {
    return this.afd.object(this.db.caredOnes + observerId + '/' + uid)
      .update(data)
      ;
  }//_updateCaredOne

  public _updateCaredoneProfile(data, currentUserId, caredOneId) {
    return this.afd.object(this.db.caredOnes + currentUserId + '/' + caredOneId)
      .update(data);

  }

  public _findOnboardingReview(caredId) {
    return this.afd.object(this.db.onboardingReview + caredId);
  }//_findCaredoneByKey
  public _findOnboardingReviewItem(caredId, item) {
    console.log(this.db.onboardingReview + caredId + '/' + item)
    return this.afd.list(this.db.onboardingReview + caredId + '/' + item, {
      query: {

        orderByKey: true,
        limitToLast: 1

      }
    });
  }//_findCaredoneByKey
  public _findOnboardingReviewItemNext(caredId, item, next) {
    console.log(this.db.onboardingReview + caredId + '/' + item)
    console.log(next - 1);
    var count = parseInt(next) - 1;
    var limitAt = count.toString();
    return this.afd.list(this.db.onboardingReview + caredId + '/' + item, {
      query: {

        orderByKey: true,
        endAt: limitAt,
        limitToLast: 1



      }
    });
  }//_findCaredoneByKey
  public _findOnboardingReviewItemPrev(caredId, item, next) {
    console.log(this.db.onboardingReview + caredId + '/' + item)
    console.log(next - 1);
    var count = parseInt(next) - 1;
    var limitAt = count.toString();
    return this.afd.list(this.db.onboardingReview + caredId + '/' + item, {
      query: {

        orderByKey: true,
        startAt: limitAt,
        limitToLast: 1



      }
    });
  }//_findCaredoneByKey
  public _findTestPrice(testName) {
    return this.afd.object(this.db.testPricing + testName);
  }//obtain price of test

  public _LabDetails(labList) {
    return this.afd.object(this.db.labDetails + labList);
  }

  public _orderDetails(caredoneId, data) {
    return this.afd.list(this.db.orderDetails + caredoneId)
      .push(data);
  }

  public _findCaredOne(observerId, uid) {
    console.log(this.db.caredOnes + observerId + '/' + uid);
    return this.afd.object(this.db.caredOnes + observerId + '/' + uid);
  }//_findCaredOne

  public _findCaredonesDoctor(doctorId) {
    return this.afd.object(this.db.doctors + doctorId);
  }//_findCaredOne

  public _findCaredOnes(uid) {
    return this.afd.list(this.db.caredOnes + uid);
  }//_findCaredOne

  public _saveMessage(userID, coID, msg) {
    this.afd.object(this.db.sendMessages + coID + '/' + userID)
      .set({ message: msg });
  }
  public _saveAppointment(userID, data) {
    this.afd.object(this.db.appointments + userID)
      .set(data);
  }

  public _fetchUser(uid) {
    console.log(this.db.users + uid);
    return this.afd.object(this.db.users + uid).map(
      res => {
        console.log("from fetchUser");
        console.log(res);
        if (!res.firstName) {
          console.log("firstName not found")
          return false;
        } else {
          this._setUserData(res);
          return this.userData;
        }
      }//res
    );
  }//_fetchUser

  public _fetchDocUser(uid) {
    console.log(this.db.docUsers + uid);
    return this.afd.object(this.db.docUsers + uid).map(
      res => {
        console.log(res);
        if (!res.firstName) {
          console.log("Doctor firstName not found")
          return false;
        } else {
          this._setUserData(res);
          return this.userData;
        }
      }//res
    );
  }//_fetchUser

  public _getUser() {
     console.log("getuser called");
    return this.afa.authState.map(
      
      response => this._changeState(response)
    );
  }//_getUser

  public _getdoctors() {
    return this.doctorsList;
  }//_getdoctors

  public _getCurrentUser() {
    console.log(this.userData);
    if (typeof this.userData != "undefined") {
      console.log(this.userData);
      return this.userData;
    } else {
      console.log("current user id called");
      return false;
    }


  }//_getCurrentUser

  public _setUserData(userData) {
    this.userData = userData;
  }//_setUserData

  private _changeState(user: any = null) {
    console.log("change state called");
    if (user) {
      return {
        isAuth: true,
        user: this._getUserInfo(user)
      }
    }
    else {
      return {
        isAuth: false,
        user: {}
      }
    }

  }//_changeState()

  public _getcaredOnesList(observerId) {
    console.log("getting cared ones for ", observerId)
    console.log(observerId)
    console.log(this.afd.list(this.db.caredOnes + observerId));
    return this.afd.list(this.db.caredOnes + observerId);
  }//_getcaredOnesList

  public _getcaredByList(caredoneId) {
    console.log(caredoneId)
    return this.afd.list(this.db.caredOnes);
  }//_getcaredbyList


  private _getUserInfo(user: any): any {
    console.log("getuserinfo called");

    if (!user) {
      return {};
    }

    let data = user.auth.providerData[0];
    return {
      firstName: data.displayName.split(' ')[0],
      lastName: data.displayName.split(' ')[1],
      avatar: "https://graph.facebook.com/" + data.uid + "/picture?type=large",
      email: data.email,
      provider: data.providerId,
      uid: data.uid
    };
  }//_getUserInfo

  public _getMedicationReminders(uid) {
    return this.afd.list(this.db.medicineReminders + uid);
  }//_getMedicationReminders

  public _getExerciseData(uid) {
    return this.afd.object(this.db.exerciseTracker + uid + '/Tracker');
  }//_getExerciseData

  public _BloodSugarData(uid) {
    console.log(this.db.deviceReadings + uid + '/Blood_Sugar');
    return this.afd.object(this.db.deviceReadings + uid + '/Blood_Sugar/Tracker');
  }//_getBloodSugarData

  public _BloodPressureData(uid) {
    return this.afd.object(this.db.deviceReadings + uid + '/Blood_Pressure/Tracker');
  }//_getBloodPressureData

  public _getCaredOneInsight(uid) {
    return this.afd.object(this.db.insights + uid);
  }//_getExerciseData

  public _getConsultations(uid) {
    return this.afd.list(this.db.consultations + uid);
  }//_getMedicationReminders

  public _getLabTests(uid) {
    return this.afd.list(this.db.labTests + uid);
  }//_getMedicationReminders

  public _saveObservers(data, coid, caredoneId) {
    return this.afd.object(this.db.observers + caredoneId + '/' + coid)
      .set(data);
  }
  public _saveCheckUpFormHosting(data,caredoneID,doctorID){
    console.log("data is ",data);
    console.log("caredoneId is ",caredoneID);
    console.log("doctorID is ",doctorID);
     return this.afd.object(this.db.caredOnes +'/'+ doctorID+'/'+ caredoneID )
     .set(data);
  }
  public _markCaredOneAdded(userId, caredoneId) {
    return this.afd.object(this.db.cared1Onboarded + userId + '/' + caredoneId)
      .set({ completed: true });
  }

  public _markAddedJob(caredoneId, itemAdded) {
    return this.afd.object(this.db.onboardingReview + caredoneId + '/' + itemAdded)
      .set('added');
  }
  public _addJobwithCheck(userId, caredoneId, addCheck) {
    return this.afd.object(this.db.caredOnes + userId + '/' + caredoneId + '/checkToAdd')
      .set(addCheck);
  }
  public _addVirtualCaredOne(caredoneId, data) {
    return this.afd.object(this.db.virtualCaredOne + caredoneId)
      .set(data);
  }


  public _addVirtualObserver(observerId, data) {
    return this.afd.object(this.db.virtualObserver + observerId)
      .set(data);
  }

  public _addVirtualCareTaker(caretakerId, data) {
    return this.afd.object(this.db.virtualCareTaker + caretakerId)
      .set(data);
  }
  public _addCaretaker(data, caredoneId, caretakerFbId, avatar) {

    console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);
    data.avatar = avatar;
    console.log(data);
    return this.afd.object(this.db.caretakers + caredoneId + '/' + caretakerFbId)
      .set(data);
  }
  public _getCaredOneJobs(caredoneId) {
    return this.afd.list(this.db.scheduledJobs, {
      query: {
        orderByChild: 'Job_For',
        equalTo: caredoneId
      }
    });
  }
  public _getHealthReports(uid) {
    console.log("uid data:", uid);
    console.log("url", this.db.healthReports + uid);
    return this.afd.object(this.db.healthReports + uid);
  }//_getHealthReports

  public _saveHealthReports(data, caredoneId, index) {
    if (index == null || index == undefined)
      index = 0;
    return this.afd.object(this.db.patientFiles + caredoneId + '/' + index)
      .set(data);
  }

  public _savePatientHealthReports(data, caredoneId, index) {
    console.log(data,  caredoneId, index)
    if (index == null || index == undefined)
      index = 0;
    return this.afd.object(this.db.healthReports + caredoneId + '/' + index)
      .set(data);
  }

}//AuthService

