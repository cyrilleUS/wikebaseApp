export class GlobalError {

  userErrorMessage: string;
	technicalErrorMessage: string;
	technicalErrorDetails: string;

  constructor(userErrorMessage: string, technicalErrorMessage: string, technicalErrorDetails: string) {
    this.userErrorMessage = userErrorMessage;
    this.technicalErrorMessage = technicalErrorMessage;
    this.technicalErrorDetails = technicalErrorDetails;
  }
}
