export class WkContact {
  idContact: string;
  firstName: string;
  lastName: string;
  email: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressCode: string;
  addressCountry: string;
  mobileNumber: string;
  phoneNumber: string;
  constructor(idContact: string, firstName: string, lastName: string, email: string, addressStreet: string, addressCity: string, addressState: string, addressCode: string, addressCountry: string, mobileNumber: string, phoneNumber: string ) {
    this.idContact = idContact;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.addressStreet = addressStreet;
    this.addressCity = addressCity;
    this.addressState = addressState;
    this.addressCode = addressCode;
    this.addressCountry = addressCountry;
    this.mobileNumber = mobileNumber;
    this.phoneNumber = phoneNumber;
  }
}
