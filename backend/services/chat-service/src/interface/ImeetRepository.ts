import { FilterQuery } from "mongoose";
import ImeetModel from "./ImeetModel";

export interface ImeetRepository {
  findAllMeets(): Promise<ImeetModel[] | []>;
  findMeet(filter: FilterQuery<ImeetModel>): Promise<ImeetModel | null>;
  findManyMeet(filter: FilterQuery<ImeetModel>): Promise<ImeetModel[] | []>;
  insertMeet(meetData: Partial<ImeetModel>): Promise<ImeetModel | null>;
}
