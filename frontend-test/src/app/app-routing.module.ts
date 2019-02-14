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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { SoybeanComponent } from './Soybean/Soybean.component';
import { FieldComponent } from './Field/Field.component';

import { TraderComponent } from './Trader/Trader.component';
import { BuyerComponent } from './Buyer/Buyer.component';
import { FarmerComponent } from './Farmer/Farmer.component';

import { TradeComponent } from './Trade/Trade.component';
import { HarvestComponent } from './Harvest/Harvest.component';
import { MergeComponent } from './Merge/Merge.component';
import { SplitComponent } from './Split/Split.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Soybean', component: SoybeanComponent },
  { path: 'Field', component: FieldComponent },
  { path: 'Trader', component: TraderComponent },
  { path: 'Buyer', component: BuyerComponent },
  { path: 'Farmer', component: FarmerComponent },
  { path: 'Trade', component: TradeComponent },
  { path: 'Harvest', component: HarvestComponent },
  { path: 'Merge', component: MergeComponent },
  { path: 'Split', component: SplitComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
