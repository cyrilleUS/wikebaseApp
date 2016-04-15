import {RestErrors} from './restErrors';

export class RestMessage {
  errors: RestErrors;
  multipleResults: Array<any>;
  singleResult: any;
  status: string;

  constructor( errors: RestErrors, multipleResults: Array<any>, singleResult: any, status: string ) {
    this.errors = errors;
    this.multipleResults = multipleResults;
    this.singleResult = singleResult;
    this.status = status;
  }
}
