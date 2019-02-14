/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FarmerService } from './Farmer.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-farmer',
  templateUrl: './Farmer.component.html',
  styleUrls: ['./Farmer.component.css'],
  providers: [FarmerService]
})
export class FarmerComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  hasWarehouse = new FormControl('', Validators.required);
  hasTransportation = new FormControl('', Validators.required);
  capacity = new FormControl('', Validators.required);
  useSubcontractor = new FormControl('', Validators.required);
  tradeID = new FormControl('', Validators.required);
  soybeans = new FormControl('', Validators.required);


  constructor(public serviceFarmer: FarmerService, fb: FormBuilder) {
    this.myForm = fb.group({
      hasWarehouse: this.hasWarehouse,
      hasTransportation: this.hasTransportation,
      capacity: this.capacity,
      useSubcontractor: this.useSubcontractor,
      tradeID: this.tradeID,
      soybeans: this.soybeans
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceFarmer.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.soychain.mynetwork.Farmer',
      'hasWarehouse': this.hasWarehouse.value,
      'hasTransportation': this.hasTransportation.value,
      'capacity': this.capacity.value,
      'useSubcontractor': this.useSubcontractor.value,
      'tradeID': this.tradeID.value,
      'soybeans': this.soybeans.value
    };

    this.myForm.setValue({
      'hasWarehouse': null,
      'hasTransportation': null,
      'capacity': null,
      'useSubcontractor': null,
      'tradeID': null,
      'soybeans': null
    });

    return this.serviceFarmer.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'hasWarehouse': null,
        'hasTransportation': null,
        'capacity': null,
        'useSubcontractor': null,
        'tradeID': null,
        'soybeans': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.soychain.mynetwork.Farmer',
      'hasWarehouse': this.hasWarehouse.value,
      'hasTransportation': this.hasTransportation.value,
      'capacity': this.capacity.value,
      'useSubcontractor': this.useSubcontractor.value,
      'soybeans': this.soybeans.value
    };

    return this.serviceFarmer.updateParticipant(form.get('tradeID').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceFarmer.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceFarmer.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'hasWarehouse': null,
        'hasTransportation': null,
        'capacity': null,
        'useSubcontractor': null,
        'tradeID': null,
        'soybeans': null
      };

      if (result.hasWarehouse) {
        formObject.hasWarehouse = result.hasWarehouse;
      } else {
        formObject.hasWarehouse = null;
      }

      if (result.hasTransportation) {
        formObject.hasTransportation = result.hasTransportation;
      } else {
        formObject.hasTransportation = null;
      }

      if (result.capacity) {
        formObject.capacity = result.capacity;
      } else {
        formObject.capacity = null;
      }

      if (result.useSubcontractor) {
        formObject.useSubcontractor = result.useSubcontractor;
      } else {
        formObject.useSubcontractor = null;
      }

      if (result.tradeID) {
        formObject.tradeID = result.tradeID;
      } else {
        formObject.tradeID = null;
      }

      if (result.soybeans) {
        formObject.soybeans = result.soybeans;
      } else {
        formObject.soybeans = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'hasWarehouse': null,
      'hasTransportation': null,
      'capacity': null,
      'useSubcontractor': null,
      'tradeID': null,
      'soybeans': null
    });
  }
}
