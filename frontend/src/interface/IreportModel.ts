export default interface IreportModel {
  _id: string;
  request_id: string;
  user_id: string;
  user_name: string;
  reason: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
