export class WkUser {
  idUser: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  sessionToken: string;

  constructor( idUser: string, firstName: string, lastName: string, email: string, password: string, sessionToken: string ) {
    this.idUser = idUser;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.sessionToken = sessionToken;
  }
}
