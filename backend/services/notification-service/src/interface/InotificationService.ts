export default interface InotificationService {
  createNotification(notfication: any): Promise<any>;
  getNotifications({ userId }: { userId: string }): Promise<any>;
  changeUserNotificationSeen({ userId }: { userId: string }): Promise<any>;
  changeAdminNotificationSeen(): Promise<any>;
  getAdminNotifications(): Promise<any>;
}
