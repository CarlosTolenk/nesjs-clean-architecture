import { FirstName } from './FirstName';
import { Cellphone } from './Cellphone';
import { CustomerId } from './CustomerId';

export class Customer {
  cellphone: Cellphone;
  customerId: CustomerId;

  constructor(cellphone: string, customerId: string) {
    this.cellphone = new Cellphone(cellphone);
    this.customerId = new CustomerId(customerId);
  }
}

export class CustomerWithName extends Customer {
  firstName: FirstName;

  constructor(firstName: string, cellphone: string, customerId: string) {
    super(cellphone, customerId);
    this.firstName = new FirstName(firstName);
  }
}
