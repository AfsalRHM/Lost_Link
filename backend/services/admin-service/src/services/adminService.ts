import { Types } from "mongoose";

import { getChannel, getConnection } from "../config/communicationConfig";

import {
  clearCorrelationId,
  createCorrelationId,
} from "../utils/correlationId";

import adminRepository from "../repositories/adminRepository";
import IadminService from "../interface/IadminService";

import eventEmitter from "../utils/eventEmitter";

export default class adminService implements IadminService {
  private _adminRepository: adminRepository;

  constructor() {
    this._adminRepository = new adminRepository();
  }

  async adminLogin(loginDetails: {
    email: string;
    password: string;
  }): Promise<any> {
    try {
      const adminData = await this._adminRepository.findAdmin(
        loginDetails.email
      );

      if (!adminData || adminData.password !== loginDetails.password) {
        return { status: false, message: "Invalid Credentials" };
      }

      console.log(adminData, "this is teh admin data");

      return {
        status: true,
        message: "Admin Verificaiton Successfull",
        data: adminData,
      };

    } catch (error) {
      return { status: false, message: "Error in adminLogin/adminService" };
    }
  }
}
