import { FilterQuery } from "mongoose";

import IchatModel from "./IchatModel";

export interface IchatRepository {
  insertChat(chatData: Partial<IchatModel>): Promise<IchatModel | null>;
  findAllChats(): Promise<IchatModel[] | null>;
  findManyChats(filter: FilterQuery<IchatModel>): Promise<IchatModel[] | []>;
  findChat(filter: FilterQuery<IchatModel>): Promise<IchatModel | null>;
  findMessageAndUpdate(
    filter: FilterQuery<IchatModel>,
    update: Partial<IchatModel>
  ): Promise<IchatModel | null>;
}
