import InotificationService from "../interface/InotificationService";
import notificationRepository from "../repositories/notificationRepository";

export default class notificationService implements InotificationService {
  private _notificationRepository: notificationRepository;

  constructor() {
    this._notificationRepository = new notificationRepository();
  }
}

// to access the userDetails from the queue after comment creation
// export function getUserDataByUserId(correlationId: string, params: any) {
//   eventEmitter.emit(correlationId, params);
// }
