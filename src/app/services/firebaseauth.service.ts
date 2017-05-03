import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { AngularFire, FirebaseAuth, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from "@angular/router";
import { AppConfig } from "../config/app.config";

@Injectable()
export class AuthService {
  users: FirebaseListObservable<any[]>;
  doctorsList: FirebaseListObservable<any[]>;
  jobsList: FirebaseListObservable<any[]>;
  pathologicalList: FirebaseListObservable<any[]>;
  medicineList: FirebaseListObservable<any[]>;
  userData: any;

  private db = AppConfig.database;

  constructor(public af: AngularFire, public firebase: FirebaseAuth, private router: Router) {
    this.users = af.database.list(this.db.users);
    this.doctorsList = af.database.list(this.db.doctors);
    this.jobsList = af.database.list(this.db.scheduledJobs);
    this.pathologicalList = af.database.list(this.db.pathologicalTestDetails + "/TestNames");
    this.medicineList = af.database.list(this.db.pathologicalTestDetails + "/MedNames");
  }//constructor

  _findDoctor(doctorId) {

    return this.doctorsList.subscribe(
      items => {
        return items.filter(item => item.$key === doctorId)[0];
      }
    );

  }//_findDoctor

  isAuthenticated() {
    return this.af.auth.subscribe(
      user => { return !!user }
    );
  }

  login(provider) {
    console.log(provider)
    this.af.auth.login({
      //provider: provider
    });

  }//login

  createMailUser(details) {
    console.log(details)
    this.af.auth.createUser(details).catch( error => { console.log("user exists")})
  }
  loginMailUser(details) {
    console.log(details)
    return this.af.auth.login(details,
          {
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
          });
  }//login
  doclogin() {

    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
      scope: ["manage_pages", "publish_pages"]
    });
  }
  fbApplogin() {

    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Redirect,
      scope: ["user_friends", "user_relationships", "user_relationship_details"]
    });

  }//fb App login
  clinicFblogin() {
  console.log("clinic login firebasee called:");
   return (
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
      scope: [
            "user_birthday",
            "user_work_history", 
            "user_hometown",
            "user_education_history",
            "user_location"
       ]
    })
   )

  }//clinic fb-login

  logout() {

    window.location.href = window.location.origin + '/home.html';
    return this.af.auth.logout();
  }//logout

  public _saveUser(formData) {
    console.log("formdata");
    console.log(formData);
    const db = this.af.database.object(this.db.users + formData.authUID);
    db.set(formData)
    //this.router.navigate(['dashboard']);
  }//_saveUser
  
  //By Chatty - save new Check-in
    public _saveCheckInData(doctorId,patientId, data) {
       console.log("insights path:",this.db.PatientsInsights  + doctorId +  patientId);
    const db = this.af.database.object(this.db.PatientsInsights +'/'  + doctorId + '/'+  patientId);
    db.set(data);
    
  }//_saveCheckIn
  //By Chatty - save new Check-in
    public _saveCheckIn(clinicId, date, id, count) {
    const db = this.af.database.object(this.db.checkIns + '/' + clinicId + '/' + date + '/' + count);
    db.set(id)
    
  }//_saveCheckIn
  //  //save user work history and all in insights
  //  public _saveFbDataInsights(data,userID,doctorID){
  //     console.log("insight save function called ");
  //    const db=  this.af.database.object(this.db. insights +'/'+ userID +'/'+doctorID)
  //    db.set(data);
  //  }
  //  //end of insights part

   //By Chatty - save new Check-in
    public _getNoOfCheckIns(clinicId, date) {
    return this.af.database.object(this.db.checkIns + '/' + clinicId + '/' + date) 
    
  }//_saveCheckIn


  public _updateReminders(data, key) {

    console.log("testing the data and key", data, key)
    const db = this.af.database.object(this.db.scheduledJobs + '/' + key);
    db.set(data).then(
      (item) => {
        console.log(item);
      }
    );
    return

  }//_updateReminders

  public _deleteReminders(key) {

    const db = this.af.database.object(this.db.scheduledJobs + '/' + key);
    db.remove().then(
      (item) => {
        console.log(item);
      }
    );
    return

  }//_updateReminders
  public _getDoctorPage(pageId) {
    console.log(this.db.doctorPages + pageId);
    return this.af.database.object(this.db.doctorPages + pageId);
  }//_findCaredoneByKey
  //get the doctor id from doctorPages
  public _getDoctorId(){
       console.log("path for doctor-id",this.db.doctorPages +'/localhost/doctorId');
       return this.af.database.object(this.db.doctorPages +'/localhost/doctorId');
  }
  public _DoctorConsultationSlot(clinicId, consultDate, consultTime, consultData) {
    var update = this.af.database.object(this.db.clinicConsultSlots + clinicId + '/' + consultDate + '/' + consultTime);
    update.set(consultData);
  }
  public _DoctorConsultationDetails(transId, data) {
    var update = this.af.database.object(this.db.clinicConsultDets + transId);
    update.set(data);
  }


  public _ConsultationPayment(transId, status, paymentId) {
    var update = this.af.database.object(this.db.clinicConsultDets + transId + '/payment');
    update.set({
      status: status,
      paymentId: paymentId
    });
  }
  public _RequestOTP(number, code) {
    var update = this.af.database.object(this.db.OTPRequests + number );
    update.set({code: code, status: 'requested'});
  }
    public _UpdateOTP(number) {
    var update = this.af.database.object(this.db.OTPRequests + number + '/status');
    update.set('confirmed');
  }
   public _SendMessage(transId, messageData, index) {
    var update = this.af.database.object(this.db.clinicConsults + transId + '/Message/' + index );
    update.set(messageData);
  }
     public _GetMessages(transId) {
   return this.af.database.object(this.db.clinicConsults + transId + '/Message/')
  }
       public _GetDoctorEmail(pageId) {
   this.af.database.object(this.db.doctorPages + pageId + '/docDetails')
   .subscribe(
     data => {
       return data.drEmail;
     }
   )
  }
  public _GetDoctorDetails(pageId) {
   return this.af.database.object(this.db.doctorPages + pageId + '/docDetails')
   
  }
  public _GetDoctorPhone(pageId) {
    console.log(this.db.doctorPages + pageId + '/docDetails');
   this.af.database.object(this.db.doctorPages + pageId + '/docDetails')
   .subscribe(
     data => {
       return data.drPhone;
     }
   )
  }
    public _GetDoctorPwd(pageId) {
   this.af.database.object(this.db.doctorPages + pageId + '/docDetails')
   .subscribe(
     data => {
       return data.drPwd;
     }
   )
  }
       public _GetConsultIds(consultId) {
   return this.af.database.object(this.db.clinicConsultDets + consultId)
  }
    public _UpdatePeerVideo(transId, status, peerId, role) {
    var update = this.af.database.object(this.db.clinicConsults + transId + '/' + role);
    update.set({
      status: status,
      peerId: peerId
    });
  }
  public _GetPeerVideo(transId, peer) {
    return this.af.database.object(this.db.clinicConsults + transId + '/' + peer);
  }
    public _GetSharedReports(clinicId, transId) {
    return this.af.database.object(this.db.patientFiles + clinicId + '/' + transId);
  }

  public _getAvailableSlots(clinicId, consultDate) {
    return this.af.database.object(this.db.clinicConsultSlots + clinicId + '/' + consultDate);

  }


  public _saveReminders(data) {
    return this.af.database.list(this.db.scheduledJobs)
      .push(data);
  }//_saveReminders

  public _saveOnboardingReview(data, caredoneId, route) {
    const onboardingdata = this.af.database.object(this.db.onboardingReview + '/' + caredoneId + '/' + route)
    return onboardingdata.set(data);


  }//save onboardingReviewreview data

  public _getPathologicalTests() {
    return this.pathologicalList;
  }

  public _getMedicineNames() {
    return this.medicineList;
  }

  public _saveUserCoverPhoto(uid, cover) {
    return this.af.database.object(this.db.users + uid)
      .update({ cover: cover });
  }//_saveUserCoverPhoto

  public _getCoverPhoto(uid) {

    return this.af.database.object(this.db.users + uid);


  }//_saveUserCoverPhoto
  public _getUserId(uid) {
    console.log(this.db.userIds + uid);

    return this.af.database.object(this.db.userIds + uid);


  }//_saveUserCoverPhoto


  public _saveCaredOne(data, observerId) {
    const caredones = this.af.database.object(this.db.caredOnes + observerId + '/' + data['uid']);
    return caredones.set(data);
  }//_saveCaredOne

  public _saveDoctor(formData) {
    console.log("formdata");
    console.log(formData);
    const db = this.af.database.object(this.db.docUsers + formData.authUID);
    db.set(formData)
    //this.router.navigate(['dashboard']);
  }//_saveDoctor


  //get the msg for caredone mobile view form
  public _getmsgFromSendMessage(currentUserId, UserID) {
    console.log("the id's i have passed here :", currentUserId, UserID);
    return this.af.database.list(this.db.sendMessages + UserID + '/' + currentUserId);
  }
  public _getObserversList(caredOneId) {
    console.log("i am in firebase and its caredone id:", caredOneId);
    return this.af.database.list(this.db.observers + caredOneId);
  }//_getObserversList
  public _updateCaredOne(observerId, uid, data) {
    return this.af.database.object(this.db.caredOnes + observerId + '/' + uid)
      .update(data)
      ;
  }//_updateCaredOne

  public _updateCaredoneProfile(data, currentUserId, caredOneId) {
    return this.af.database.object(this.db.caredOnes + currentUserId + '/' + caredOneId)
      .update(data);

  }

  public _findOnboardingReview(caredId) {
    return this.af.database.object(this.db.onboardingReview + caredId);
  }//_findCaredoneByKey
  public _findOnboardingReviewItem(caredId, item) {
    console.log(this.db.onboardingReview + caredId + '/' + item)
    return this.af.database.list(this.db.onboardingReview + caredId + '/' + item, {
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
    return this.af.database.list(this.db.onboardingReview + caredId + '/' + item, {
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
    return this.af.database.list(this.db.onboardingReview + caredId + '/' + item, {
      query: {

        orderByKey: true,
        startAt: limitAt,
        limitToLast: 1



      }
    });
  }//_findCaredoneByKey
  public _findTestPrice(testName) {
    return this.af.database.object(this.db.testPricing + testName);
  }//obtain price of test

  public _LabDetails(labList) {
    return this.af.database.object(this.db.labDetails + labList);
  }

  public _orderDetails(caredoneId, data) {
    return this.af.database.list(this.db.orderDetails + caredoneId)
      .push(data);
  }

  public _findCaredOne(observerId, uid) {
    console.log(this.db.caredOnes + observerId + '/' + uid);
    return this.af.database.object(this.db.caredOnes + observerId + '/' + uid);
  }//_findCaredOne

  public _findCaredonesDoctor(doctorId) {
    return this.af.database.object(this.db.doctors + doctorId);
  }//_findCaredOne

  public _findCaredOnes(uid) {
    return this.af.database.list(this.db.caredOnes + uid);
  }//_findCaredOne

  public _saveMessage(userID, coID, msg) {
    this.af.database.object(this.db.sendMessages + coID + '/' + userID)
      .set({ message: msg });
  }
  public _saveAppointment(userID, data) {
    this.af.database.object(this.db.appointments + userID)
      .set(data);
  }

  public _fetchUser(uid) {
    console.log(this.db.users + uid);
    return this.af.database.object(this.db.users + uid).map(
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
    return this.af.database.object(this.db.docUsers + uid).map(
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
    return this.af.auth.map(
      
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
    console.log(this.af.database.list(this.db.caredOnes + observerId));
    return this.af.database.list(this.db.caredOnes + observerId);
  }//_getcaredOnesList

  public _getcaredByList(caredoneId) {
    console.log(caredoneId)
    return this.af.database.list(this.db.caredOnes);
  }//_getcaredbyList


  private _getUserInfo(user: any): any {
    console.log("getuserinfo called");

    if (!user) {
      return {};
    }

    let data = user.auth.providerData[0];
    return {
      // firstName: data.displayName.split(' ')[0],
      // lastName: data.displayName.split(' ')[1],
      // avatar: "https://graph.facebook.com/" + data.uid + "/picture?type=large",
      email: data.email,
      provider: data.providerId,
      uid: data.uid
    };
  }//_getUserInfo

  public _getMedicationReminders(uid) {
    return this.af.database.list(this.db.medicineReminders + uid);
  }//_getMedicationReminders

  public _getExerciseData(uid) {
    return this.af.database.object(this.db.exerciseTracker + uid + '/Tracker');
  }//_getExerciseData

  public _BloodSugarData(uid) {
    console.log(this.db.deviceReadings + uid + '/Blood_Sugar');
    return this.af.database.object(this.db.deviceReadings + uid + '/Blood_Sugar/Tracker');
  }//_getBloodSugarData

  public _BloodPressureData(uid) {
    return this.af.database.object(this.db.deviceReadings + uid + '/Blood_Pressure/Tracker');
  }//_getBloodPressureData

  public _getCaredOneInsight(uid) {
    return this.af.database.object(this.db.insights + uid);
  }//_getExerciseData

  public _getConsultations(uid) {
    return this.af.database.list(this.db.consultations + uid);
  }//_getMedicationReminders

  public _getLabTests(uid) {
    return this.af.database.list(this.db.labTests + uid);
  }//_getMedicationReminders

  public _saveObservers(data, coid, caredoneId) {
    return this.af.database.object(this.db.observers + caredoneId + '/' + coid)
      .set(data);
  }
  public _saveCheckUpFormHosting(data,caredoneID,doctorID){
    console.log("data is ",data);
    console.log("caredoneId is ",caredoneID);
    console.log("doctorID is ",doctorID);
     return this.af.database.object(this.db.caredOnes +'/'+ caredoneID +'/'+ doctorID)
     .set(data);
  }
  public _markCaredOneAdded(userId, caredoneId) {
    return this.af.database.object(this.db.cared1Onboarded + userId + '/' + caredoneId)
      .set({ completed: true });
  }

  public _markAddedJob(caredoneId, itemAdded) {
    return this.af.database.object(this.db.onboardingReview + caredoneId + '/' + itemAdded)
      .set('added');
  }
  public _addJobwithCheck(userId, caredoneId, addCheck) {
    return this.af.database.object(this.db.caredOnes + userId + '/' + caredoneId + '/checkToAdd')
      .set(addCheck);
  }
  public _addVirtualCaredOne(caredoneId, data) {
    return this.af.database.object(this.db.virtualCaredOne + caredoneId)
      .set(data);
  }


  public _addVirtualObserver(observerId, data) {
    return this.af.database.object(this.db.virtualObserver + observerId)
      .set(data);
  }

  public _addVirtualCareTaker(caretakerId, data) {
    return this.af.database.object(this.db.virtualCareTaker + caretakerId)
      .set(data);
  }
  public _addCaretaker(data, caredoneId, caretakerFbId, avatar) {

    console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);
    data.avatar = avatar;
    console.log(data);
    return this.af.database.object(this.db.caretakers + caredoneId + '/' + caretakerFbId)
      .set(data);
  }
  public _getCaredOneJobs(caredoneId) {
    return this.af.database.list(this.db.scheduledJobs, {
      query: {
        orderByChild: 'Job_For',
        equalTo: caredoneId
      }
    });
  }
  public _getHealthReports(uid) {
    console.log("uid data:", uid);
    console.log("url", this.db.healthReports + uid);
    return this.af.database.object(this.db.healthReports + uid);
  }//_getHealthReports

  public _saveHealthReports(data, caredoneId, index) {
    if (index == null || index == undefined)
      index = 0;
    return this.af.database.object(this.db.patientFiles + caredoneId + '/' + index)
      .set(data);
  }


}//AuthService

