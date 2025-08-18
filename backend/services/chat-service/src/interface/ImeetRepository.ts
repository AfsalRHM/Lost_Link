import { FilterQuery } from "mongoose";
import ImeetModel from "./ImeetModel";

export interface ImeetRepository {
  findMeets(filter: object, skip: number, limit: number): Promise<any>;
  findMeet(filter: FilterQuery<ImeetModel>): Promise<ImeetModel | null>;
  findManyMeet(filter: FilterQuery<ImeetModel>): Promise<ImeetModel[] | []>;
  insertMeet(meetData: Partial<ImeetModel>): Promise<ImeetModel | null>;
}
