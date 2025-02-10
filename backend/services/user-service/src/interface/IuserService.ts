export default interface IuserService {
  checkMail(recieverEmail: string): Promise<any>;
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    hashedPassword: string
  ): Promise<any>;
  checkMail(recieverEmail: string): Promise<boolean>;
  loginUser(userMail: string): Promise<any>;
  updatePassword(userMail: string, newPassword: string): Promise<any>;
  getAllUsers(): Promise<any>;
  changeUserStatus(props: { userId: string }): Promise<any>;
  getUserDataById({ userId }: { userId: string }): Promise<any>;
  getProfile({ userId }: { userId: string | undefined }): Promise<any>;
  updateUser({
    updateFormData,
    userId,
  }: {
    updateFormData: updateFormDataType;
    userId: string;
  }): Promise<any>;
}

export interface updateFormDataType {
  profilePic: string | undefined;
  fullName: string | undefined;
  userName: string | undefined;
  email: string | undefined;
  phone: number | null | undefined;
}
