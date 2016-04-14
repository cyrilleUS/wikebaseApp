export class FieldError {
  userErrorMessage: string;
  technicalErrorMessage: string;
  fieldName: string;

  constructor(userErrorMessage: string, technicalErrorMessage: string, fieldName: string) {
    this.userErrorMessage = userErrorMessage;
    this.technicalErrorMessage = technicalErrorMessage;
    this.fieldName = fieldName;
  }
}
