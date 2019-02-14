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
import { SoybeanService } from './Soybean.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-soybean',
  templateUrl: './Soybean.component.html',
  styleUrls: ['./Soybean.component.css'],
  providers: [SoybeanService]
})
export class SoybeanComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  soyId = new FormControl('', Validators.required);
  fieldId = new FormControl('', Validators.required);
  quantity = new FormControl('', Validators.required);
  movementStatus = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceSoybean: SoybeanService, fb: FormBuilder) {
    this.myForm = fb.group({
      soyId: this.soyId,
      fieldId: this.fieldId,
      quantity: this.quantity,
      movementStatus: this.movementStatus,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceSoybean.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.soychain.mynetwork.Soybean',
      'soyId': this.soyId.value,
      'fieldId': this.fieldId.value,
      'quantity': this.quantity.value,
      'movementStatus': this.movementStatus.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'soyId': null,
      'fieldId': null,
      'quantity': null,
      'movementStatus': null,
      'owner': null
    });

    return this.serviceSoybean.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'soyId': null,
        'fieldId': null,
        'quantity': null,
        'movementStatus': null,
        'owner': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.soychain.mynetwork.Soybean',
      'fieldId': this.fieldId.value,
      'quantity': this.quantity.value,
      'movementStatus': this.movementStatus.value,
      'owner': this.owner.value
    };

    return this.serviceSoybean.updateAsset(form.get('soyId').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceSoybean.deleteAsset(this.currentId)
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

    return this.serviceSoybean.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'soyId': null,
        'fieldId': null,
        'quantity': null,
        'movementStatus': null,
        'owner': null
      };

      if (result.soyId) {
        formObject.soyId = result.soyId;
      } else {
        formObject.soyId = null;
      }

      if (result.fieldId) {
        formObject.fieldId = result.fieldId;
      } else {
        formObject.fieldId = null;
      }

      if (result.quantity) {
        formObject.quantity = result.quantity;
      } else {
        formObject.quantity = null;
      }

      if (result.movementStatus) {
        formObject.movementStatus = result.movementStatus;
      } else {
        formObject.movementStatus = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
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
      'soyId': null,
      'fieldId': null,
      'quantity': null,
      'movementStatus': null,
      'owner': null
      });
  }

}
