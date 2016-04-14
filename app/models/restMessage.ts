import {RestErrors} from './restErrors';

export class RestMessage {
  errors: RestErrors;
  multipleResults: any[];
  singleResult: any;
  status: string;
}
