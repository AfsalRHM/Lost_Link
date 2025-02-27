import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import IcommentModel from "../interface/IcommentModel";
import commentModel from "../models/commentModel";

export default class commentRepository
  extends BaseRepository<IcommentModel>
  implements IbaseRepository<IcommentModel>
{
  constructor() {
    super(commentModel);
  }

  async findComments({
    request_id1,
    commentCount,
  }: {
    request_id1: string;
    commentCount: number;
  }): Promise<IcommentModel[] | null> {
    return this.findCommentsLimit({ request_id: request_id1, commentCount });
  }
}
