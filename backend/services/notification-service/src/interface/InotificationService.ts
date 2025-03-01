export default interface InotificationService {
  createNotification(notfication: any): Promise<any>;
  getNotifications({ userId }: { userId: string }): Promise<any>;
  changeUserNotificationSeen({ userId }: { userId: string }): Promise<any>;
  changeAdminNotificationSeen(): Promise<any>;
  changeAdminOneNotificationSeen({
    notificationId,
  }: {
    notificationId: string;
  }): Promise<any>;
  getAdminNotifications(): Promise<any>;
}
