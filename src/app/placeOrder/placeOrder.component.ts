import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-placeOrder',
  templateUrl: './placeOrder.component.html',
  //styleUrls: ['./fblogin.component.css']
})
export class PlaceOrderComponent implements OnInit {
  private itemList: any = [];
  private addTestForm: FormGroup;
  private partnerId: any;
  private orderType: any;
  private userId: any;
  private formReady: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fs: FacebookService,
    private http: Http,

  ) { }

  ngOnInit() {


    this.activatedRoute.params.subscribe(
      params => {
        this.orderType = params['orderType'];
        this.userId = params['userId'];
        this.partnerId = params['partnerId'];
        this._authService._getTestList(params['orderType'])
          .subscribe(
          testsData => {
            console.log("testsData", testsData);
            this.itemList = testsData;
            this._authService._getCurrentOrder(this.userId, this.partnerId, this.orderType)
              .subscribe(
              currentOrder => {
                console.log("currentOrder", currentOrder);
                this.addTestForm = this._fb.group({
                  item: this._fb.array([
                    this.addTestItem2(currentOrder[0].name)
                  ])
                });

                for (let i = 1; i < currentOrder.length; i++) {
                  if (currentOrder[i] && currentOrder[i].name) {
                    let control = <FormArray>this.addTestForm.controls['item'];
                  control.push(this.addTestItem2(currentOrder[i].name));
                  }
                  
                }
                this.formReady = true;
              }
              )

          }
          )
      }
    )


  }
  addTestItem() {
    return this._fb.group({
      name: []
    })
  }
  addTestItem2(item) {
    return this._fb.group({
      name: item
    })
  }
  addMoreItems() {
    let control = <FormArray>this.addTestForm.controls['item'];
    control.push(this.addTestItem());

  }
  saveTests(form) {
    console.log(form.value);
    var items = form.value.item, finalArray = [], ctr = 0;
    for (let each of items) {
      console.log(each);
      if (each['name'] && each['name'].hasOwnProperty(toString)) {
        each['name'].toString = null;
      }
      finalArray[ctr] = { name: each['name'].name, id: each['name'].id, value: each['name'].value, price: (each['name'][this.partnerId].price) ? each['name'][this.partnerId].price : 'NA' };
      ctr++;
    }
    this._authService._saveCurrentOrder(this.userId, this.partnerId, this.orderType, finalArray)
    .then(
      data => alert("These items have been added. You can now close this window and review/ confirm your request.")
    )
  }
}
