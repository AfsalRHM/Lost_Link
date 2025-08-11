import { FilterQuery } from "mongoose";
import ImessageModel from "./ImessageModel";

export interface ImessageRepository {
  insertMessage(
    messageData: Partial<ImessageModel>
  ): Promise<ImessageModel | null>;
  findMessagesOfUser(userId: string): Promise<ImessageModel | null>;
  findMessages(
    filter: FilterQuery<ImessageModel>
  ): Promise<ImessageModel[] | []>;
}
