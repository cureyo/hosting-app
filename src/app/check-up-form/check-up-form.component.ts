import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
 declare var jQuery:any; 
@Component({
  selector: 'app-check-up-form',
  templateUrl: './check-up-form.component.html',
  styleUrls: ['./check-up-form.component.css']
})
export class CheckUpFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
   MyFunction(){
     jQuery(function MyFunction() {
              jQuery('input[name="birthdate"]').daterangepicker({
                  singleDatePicker: true,
                  showDropdowns: true
              }, 
              function(start, end, label) {
                  var years = moment().diff(start, 'years');
                  //alert("You are " + years + " years old.");
              });
          });
       
   }       
  
    
          

}
