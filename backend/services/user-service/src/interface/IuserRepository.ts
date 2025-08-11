import { FilterQuery } from "mongoose";
import IuserModel from "./IuserModel";

export interface IuserRepository {
  insertUser(userData: Partial<IuserModel>): Promise<IuserModel | null>;
  findUser(filter: FilterQuery<IuserModel>): Promise<IuserModel | null>;
  findUsers(filter: FilterQuery<IuserModel>): Promise<IuserModel[] | null>;
  findUserAndUpdate(
    Id: string,
    update: Partial<IuserModel>
  ): Promise<IuserModel | null>;
  findAllUsers(): Promise<IuserModel[] | null>;
  updateUserByEmail(
    filter: FilterQuery<IuserModel>,
    update: Partial<IuserModel>
  ): Promise<IuserModel | null>;
  changeStatus(userId: string): Promise<IuserModel | null>;
  findByIdAndAddRequestId(
    userId: string,
    requestId: string
  ): Promise<IuserModel | null>;
  findByIdAndAddCompletedRequestIdAndPoints(
    userId: string,
    requestId: string,
    points: number,
    rewardAmount: number
  ): Promise<IuserModel | null>;
}
