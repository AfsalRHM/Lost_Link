export default interface IchatModel {
  _id: string;
  user_name: string;
  request_name: string;
  user_id: string;
  request_id: string;
  request_status: string;
  is_group_chat: boolean;
  latest_message: ImessageModel;
  group_admin: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImessageModel {
  _id: string;
  sender: string;
  content: string;
  chat: string;
  createdAt: Date;
  updatedAt: Date;
}
