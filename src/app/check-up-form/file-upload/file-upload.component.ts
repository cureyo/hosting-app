import { Component, OnInit, Inject, Input } from '@angular/core';
import { FileUploader, FileUploadModule, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FirebaseApp } from 'angularfire2';
import {AngularFireDatabase} from 'angularfire2/database';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
//mport {FeedbackComponent} from "../feedback.component"
declare var $: any;
const URL = 'gs://cureyo-your-personal-hospital.appspot.com/files/';
@Component({
  selector: 'app-file-upload-checkUp',
  templateUrl: './file-upload.component.html',
  // styleUrls: ['./file-upload.component.css']
})
export class CheckUpFileUploadComponent implements OnInit {
  @Input() userId: any;
  //@Input() transId: any;


  public filename: any;
  public storedflag: boolean = false;
  public temp_data: any;
  private pathwayId: any;
  private itemId: any;
  private pathRptCount: number = 0;
  private textval: any = [];
  private pathImageList: any = [];
  private qLength: number = 0;
  private rptCount: number = 0;
  private i: any;
  storage: any;
  uploader: FileUploader = new FileUploader({ url: '' });
  uid: string;
  //ref: any;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  constructor( @Inject(FirebaseApp) firebaseApp: any, @Inject(AngularFireDatabase) fb,
    private _authService: AuthService,
    private _fb: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute
    ) {
    this.storage = firebaseApp.storage();
    //this.ref = firebaseApp.database().ref();
    this.uid = localStorage.getItem('uid');
  }

  ngOnInit() {
    console.log(this.userId)
    this._authService._getHealthReports(this.userId)
    .subscribe(
      data => {
        console.log(data);
        console.log(data.length);
        this.rptCount = data.length;
        this.activatedRouter.queryParams
          .subscribe(
          params => {
            if (params['pathwayId'] && params['itemId']) {
              this._authService._getPathwayImages(this.userId, params['pathwayId'], params['itemId'])
                .subscribe(
                pathImages => {
                  if (pathImages['images'])
                      this.pathRptCount = pathImages['images'].length;
                      else 
                      this.pathRptCount = 0;
                  this.pathwayId = params['pathwayId'];
                  this.itemId = params['itemId'];
                }
                )
            } else {
              var mode = 'Physical', clinicId;
              if (params['clinicId'])
                clinicId = params['clinicId'];
              else {
                console.log(window.location);
                var str = window.location.hostname;
                console.log(str);
                var n = str.indexOf(".");
                if (n == -1) {
                  n = str.length;
                }
                console.log(n);
                var res = str.substring(0, n);
                console.log("location", res);
                clinicId = res;
              }

              if (params['number'])
                mode = 'Online';

              this._authService._getActivePathways(this.userId, clinicId, mode)
                .subscribe(
                activePaths => {
                  var toDate = new Date();
                  var toTime = toDate.getTime();

                  this.pathwayId = (activePaths.pathway) ? activePaths.pathway : 'unplanned';



                  this.itemId = (activePaths.itemId) ? activePaths.itemId : toTime;
                  if (!activePaths.pathway)
                    this._authService._saveActivePathways(this.userId, clinicId, mode, this.pathwayId, this.itemId);

                  this._authService._getPathwayImages(this.userId, this.pathwayId, this.itemId)
                    .subscribe(
                    pathImages => {
                      if (pathImages['images'])
                      this.pathRptCount = pathImages['images'].length;
                      else 
                      this.pathRptCount = 0;

                      this.pathImageList = pathImages;

                    }
                    )
                }
                )
            }
          }
          )
      }
    )

    this.uploader.onAfterAddingFile = (fileItem) => {
      console.log(this.uploader.queue);
      this.qLength = this.uploader.queue.length;

    }

  }

  public fileOverBase(e: any): void {
    console.log("fileOverBase :", e);
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    console.log("FileOverAnother", e);
    this.hasAnotherDropZoneOver = e;
  }


  // }
  onUpload(item) {
    console.log("item val:", item);
    // const fileName: string = this.filename + new Date().getTime() + '.png';
    console.log("this.textval");
    console.log(this.textval[item.file.name])
    const timestamp: number = new Date().getTime();
    this.filename = item.file.name;
    console.log("file name", this.filename);
    const fileRef: any = this.storage.ref(`images/${this.filename}`);
    const uploadTask: any = fileRef.put(this.uploader.queue[this.uploader.queue.length - 1]['_file']);

    uploadTask.on('state_changed',
      (snapshot) => console.log(snapshot),
      (error) => console.log(error),
      () => {
        const data = {
          type: this.textval[item.file.name],
          src: uploadTask.snapshot.downloadURL,
          raw: this.filename,
          //transId: this.transId,
          updatedAt: timestamp,
          //clinicId: this.clinicId
        };
        let updates = {};
        this.storedflag = true;
        updates = data;
        this.saveFileUploadData(updates);
      }
    );
  }
  saveFileUploadData = (model) => {

    console.log("the index in save file:", this.i);
    console.log("the value on given index ", this.textval[this.i]);
    let reminder = {},
      job = model['value'];

    reminder['addedBy'] = this.userId;
    reminder['Description'] = model.type;
    //reminder['clinicId'] = this.clinicId;
    reminder['fileName'] = model.raw;
    reminder['fileUrl'] = model.src;
    reminder['updatedAt'] = model.updatedAt;
    //reminder['transId'] = this.transId
    console.log("the reminder value for saveFileUploadData:", reminder);

    // to save the file on the db:
    this._authService._savePatientHealthReports(reminder, this.userId, this.rptCount).then(
      data => {
        console.log("the data:", data);
        this._authService._savePathwayImages(this.userId, this.pathwayId, this.itemId, reminder, this.pathRptCount)
          .then(
          data2 => {
       // this.rptCount = this.rptCount + 1;
        $.notify({
          icon: "notifications",
          message: reminder['fileName'] + " added"

        }, {
            type: 'cureyo',
            timer: 4000,
            allow_dismiss: true,
            placement: {
              from: 'top',
              align: 'right'
            }
          });
        setTimeout(function () {
          $.notifyClose('top-right');
        }, 3000);
          });
       // this.feedback.fileUploaded();
      }
    ).catch( err=> console.log(err));
  }
  descExists(fileName) {
    if (this.textval[fileName]) {
      return false;
    }
    else {
      return true;
    }
  }

}