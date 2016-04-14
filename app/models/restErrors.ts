import {FieldError} from './fieldError';
import {GlobalError} from './globalError';

export class RestErrors {
  fieldErrors: FieldError[];
  globalErrors: GlobalError[];
  empty: string;

  constructor(fieldErrors: FieldError[], globalErrors: GlobalError[], empty: string) {
    this.fieldErrors = fieldErrors;
    this.globalErrors = globalErrors;
    this.empty = empty;
  }
}
