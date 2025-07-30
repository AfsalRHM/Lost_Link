import { adminHttpClient } from "./http/adminHttpClient";

// Types & Interfaces
import { adminProps } from "../interface/IapiProps";
import { API_ROUTES } from "../constants/apiRoutes";

// API's
export const adminService = {
  insertAdmin: (payload: adminProps) => {
    return adminHttpClient.post(API_ROUTES.ADMIN.CREATE_ADMIN, payload);
  },

  getAdmins: () => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_ADMINS);
  },

  updateAdmin: (props: { adminId: string }) => {
    return adminHttpClient.patch(API_ROUTES.ADMIN.UPDATE_ADMIN(props.adminId));
  },

  getUserChats: (props: { userId: string }) => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_USER_CHATS(props.userId));
  },

  getMessages: (props: { chatId: string }) => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_MESSAGES(props.chatId));
  },

  sendMessage: (payload: {
    content: string;
    chatId: string;
    image: string;
  }) => {
    return adminHttpClient.post(API_ROUTES.ADMIN.SEND_MESSAGE, payload);
  },

  getUsers: () => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_USERS);
  },

  getRequests: () => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_REQUESTS);
  },

  getRedeemRequests: () => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_REDEEM_REQUESTS);
  },

  loginVerify: (payload: { email: string; password: string }) => {
    return adminHttpClient.post(API_ROUTES.ADMIN.LOGIN, payload);
  },

  getMeet: (props: { meetId: string }) => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_MEET(props.meetId));
  },

  getAllMeets: () => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_MEETS);
  },

  getRedeemRequestDetails: (props: { redeemRequestId: string }) => {
    return adminHttpClient.get(
      API_ROUTES.ADMIN.GET_REDEEM_REQUEST_DETAILS(props.redeemRequestId)
    );
  },

  updateRedeemRequestStatus: (payload: {
    redeemRequestId: string;
    changeTo: string;
  }) => {
    return adminHttpClient.post(
      API_ROUTES.ADMIN.UPDATE_REDEEM_REQUEST,
      payload
    );
  },

  getRequestDetails: (props: { requestId: string }) => {
    return adminHttpClient.get(
      API_ROUTES.ADMIN.GET_REQUEST_DETAILS(props.requestId)
    );
  },

  updateRequest: (props: { requestId: string }) => {
    return adminHttpClient.patch(
      API_ROUTES.ADMIN.UPDATE_REQUEST(props.requestId)
    );
  },

  cancelRequest: (props: { requestId: string; from: string }) => {
    return adminHttpClient.patch(
      API_ROUTES.ADMIN.CANCEL_REQUEST(props.requestId),
      { from: props.from }
    );
  },

  getNotifications: () => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_NOTIFICATIONS);
  },

  updateNotification: (props: { notificationId: string }) => {
    return adminHttpClient.patch(
      API_ROUTES.ADMIN.UPDATE_NOTIFICATION(props.notificationId)
    );
  },

  updateNotifications: () => {
    return adminHttpClient.patch(API_ROUTES.ADMIN.UPDATE_NOTIFICATIONS);
  },

  getUser: (props: { userId: string }) => {
    return adminHttpClient.get(API_ROUTES.ADMIN.GET_USER_DETAILS(props.userId));
  },

  updateUser: (props: { userId: string }) => {
    return adminHttpClient.patch(API_ROUTES.ADMIN.UPDATE_USER(props.userId));
  },

  logout: () => {
    return adminHttpClient.post(API_ROUTES.ADMIN.LOGOUT);
  },
};
