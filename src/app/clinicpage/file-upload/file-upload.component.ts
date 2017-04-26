import { Component, OnInit, Inject, Input } from '@angular/core';
import { FileUploader, FileUploadModule, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FirebaseApp, FirebaseRef } from 'angularfire2';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;
const URL = 'gs://cureyo-your-personal-hospital.appspot.com/files/';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  // styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() clinicId: any;
  @Input() transId: any;


  public filename: any;
  public storedflag: boolean = false;
  public temp_data: any;

  private textval: any = [];
  private qLength: number = 0;
  private rptCount: number = 0;
  private i: any;
  storage: any;
  uploader: FileUploader = new FileUploader({ url: '' });
  uid: string;
  ref: any;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  constructor( @Inject(FirebaseApp) firebaseApp: any, @Inject(FirebaseRef) fb,
    private _authService: AuthService,
    private _fb: FormBuilder,
    private router: Router) {
    this.storage = firebaseApp.storage();
    this.ref = fb.database().ref();
    this.uid = localStorage.getItem('uid');
  }

  ngOnInit() {


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
          transId: this.transId,
          updatedAt: timestamp,
          clinicId: this.clinicId
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

    reminder['type'] = model.type;
    reminder['clinicId'] = this.clinicId;
    reminder['fileName'] = model.raw;
    reminder['fileUrl'] = model.src;
    reminder['updatedAt'] = model.updatedAt;
    reminder['transId'] = this.transId
    console.log("the reminder value for saveFileUploadData:", reminder);

    // to save the file on the db:
    this._authService._saveHealthReports(reminder, this.clinicId, this.transId + '/' + this.rptCount).then(
      data => {
        console.log("the data:", data);
        this.rptCount = this.rptCount + 1;
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


      }
    );
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