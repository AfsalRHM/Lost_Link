import ImeetService from "../interface/ImeetService";
import meetRepository from "../repositories/meetRepository";

export default class meetService implements ImeetService {
  private _meetRepository: meetRepository;

  constructor() {
    this._meetRepository = new meetRepository();
  }

  // To Create/Schedule Meet
  async createMeet({
    date,
    time,
    userId,
    requestId,
    userName,
  }: {
    date: string;
    time: string;
    userId: string;
    requestId: string;
    userName: string;
  }): Promise<any> {
    try {
      const meetDate = new Date(`${date}T${time}`);

      const meetData = await this._meetRepository.insertMeet({
        meet_date: meetDate,
        meet_time: time,
        user_id: userId,
        request_id: requestId,
        user_name: userName,
      });

      if (meetData) {
        return {
          status: true,
          data: meetData,
          message: "New Meet Created",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "New Meet didn't Created",
        };
      }
    } catch (error) {
      console.log(error, "error on the createMeet/meetService");
      return false;
    }
  }

  // To get all the meets for the admin
  async getAllMeets(): Promise<any> {
    try {
      const meetData = await this._meetRepository.findAll();

      if (meetData) {
        return {
          status: true,
          data: meetData,
          message: "New Meet Created",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "No Meet has Scheduled",
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllMeets/meetService");
      return false;
    }
  }

  // To get a single meet data
  async getMeetDataAdmin({ meetId }: { meetId: string }): Promise<any> {
    try {
      const meetData = await this._meetRepository.findOne({ _id: meetId });

      if (meetData) {
        return {
          status: true,
          data: meetData,
          message: "Meet Data Fetched",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Unable to find meet data",
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllMeets/meetService");
      return false;
    }
  }
}
