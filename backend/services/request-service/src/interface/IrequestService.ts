export default interface IrequestService {
    checkMail(recieverEmail: string): Promise<any>;
  }
  