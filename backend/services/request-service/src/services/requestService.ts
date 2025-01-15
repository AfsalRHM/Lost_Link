import IrequestService from "../interface/IrequestService";
import requestRepository from "../repositories/requestRepository";

export default class requestService implements IrequestService {
  private _requestRepository: requestRepository;

  constructor() {
    this._requestRepository = new requestRepository();
  }

  async checkMail(recieverEmail: string): Promise<any> {
    // const userData = await this._userRepository.findUser(recieverEmail);
    // if (userData) {
    //   return {
    //     status: true,
    //     data: userData,
    //     message: "Registration successfull",
    //     email: recieverEmail,
    //   };
    // } else {
    //   return {
    //     status: false,
    //     data: null,
    //     message: "Registeration Failed",
    //     email: recieverEmail,
    //   };
    // }
  }
}
