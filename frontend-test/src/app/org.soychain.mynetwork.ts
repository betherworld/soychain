import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.soychain.mynetwork{
   export enum MovementStatus {
      HARVESTED,
      IN_FARMERWAREHOUSE,
      IN_TRANSITTRADER,
      IN_TRADERWAREHOUSE,
      IN_TRANSITBUYER,
   }
   export class Soybean extends Asset {
      soyId: string;
      fieldId: string;
      quantity: number;
      movementStatus: MovementStatus;
      owner: TradingPartner;
   }
   export class Field extends Asset {
      fieldId: string;
      limit: number;
      owner: Farmer;
   }
   export abstract class TradingPartner extends Participant {
      tradeID: string;
      soybeans: Soybean[];
   }
   export class Trader extends TradingPartner {
   }
   export class Buyer extends TradingPartner {
   }
   export class Farmer extends TradingPartner {
      hasWarehouse: boolean;
      hasTransportation: boolean;
      capacity: number;
      useSubcontractor: boolean;
   }
   export class Trade extends Transaction {
      soybean: Soybean;
      newOwner: TradingPartner;
   }
   export class Harvest extends Transaction {
      name: string;
      field: Field;
      owner: Farmer;
      quantity: number;
   }
   export class Merge extends Transaction {
      bean1: Soybean;
      bean2: Soybean;
   }
   export class Split extends Transaction {
      bean1: Soybean;
      bean2: string;
      quantity: number;
   }
// }
