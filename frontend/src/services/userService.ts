import { userHttpClient } from "./http/userHttpClient";
import { API_ROUTES } from "../constants/apiRoutes";

// Types & Interfaces
import { RequestRedeemProps } from "../interface/IrequestProps";
import { formDataType } from "../interface/IuserModel";

// API's
export const userService = {
  login: (credentials: { userEmail: string; userPassword: string }) => {
    return userHttpClient.post(API_ROUTES.AUTH.LOGIN, credentials);
  },

  googleLogin: (payload: { userMail: string }) => {
    return userHttpClient.post(API_ROUTES.AUTH.GOOGLE_LOGIN, payload);
  },

  getAllRequests: (props: {
    location: string;
    minReward: number;
    maxReward: number;
  }) => {
    return userHttpClient.get(
      API_ROUTES.USER.GET_ALL_REQUESTS(
        props.location,
        props.minReward,
        props.maxReward
      )
    );
  },

  getMyRequestDetails: (props: { requestId: string }) => {
    return userHttpClient.get(
      API_ROUTES.USER.GET_MY_REQUEST_DETAILS(props.requestId)
    );
  },

  getRequestDetails: (payload: { requestId: string; from: string }) => {
    return userHttpClient.post(API_ROUTES.USER.GET_REQUEST_DETAILS, payload);
  },

  updateLikeStatus: (requestId: string) => {
    return userHttpClient.patch(API_ROUTES.USER.UPDATE_LIKE(requestId));
  },

  createRedeemRequest: (payload: {
    formData: RequestRedeemProps;
    requestId: string;
  }) => {
    return userHttpClient.post(API_ROUTES.USER.CREATE_REDEEM_REQUEST, payload);
  },

  createRequest: (payload: { formData: any }) => {
    return userHttpClient.post(API_ROUTES.USER.CREATE_REQUEST, payload);
  },

  reportRequest: (payload: {
    requestId: string | null;
    reportReason: string;
    userId: string;
  }) => {
    return userHttpClient.post(API_ROUTES.USER.REPORT_REQUEST, payload);
  },

  getMyReports: (payload: { userId: string }) => {
    return userHttpClient.post(API_ROUTES.USER.GET_MY_REPORTS, payload);
  },

  createPaymentSession: (payload: { formData: any }) => {
    return userHttpClient.post(API_ROUTES.USER.CREATE_PAYMENT_SESSION, payload);
  },

  changePassword: (payload: { userEmail: string; newPassword: string }) => {
    return userHttpClient.post(API_ROUTES.AUTH.CHANGE_PASSWORD, payload);
  },

  verifyOTP: (payload: { userEmail: string; userEnteredOTP: string }) => {
    return userHttpClient.post(API_ROUTES.AUTH.VERIFY_OTP, payload);
  },

  resetOtpPassword: (payload: {
    recieverEmail: string;
    recieverName: string;
  }) => {
    return userHttpClient.post(API_ROUTES.AUTH.RESET_PASSWORD_OTP, payload);
  },

  sendMessage: (payload: {
    content: string;
    chatId: string;
    image: string;
  }) => {
    return userHttpClient.post(API_ROUTES.USER.SEND_MESSAGE, payload);
  },

  getChat: (props: { requestId: string }) => {
    return userHttpClient.get(API_ROUTES.USER.GET_CHAT(props.requestId));
  },

  getMessages: (props: { chatId: string }) => {
    return userHttpClient.get(API_ROUTES.USER.GET_MESSAGES(props.chatId));
  },

  getProfile: () => {
    return userHttpClient.get(API_ROUTES.USER.GET_PROFILE);
  },

  getMeetings: (props: { userId: string }) => {
    return userHttpClient.get(API_ROUTES.USER.GET_MEETINGS(props.userId));
  },

  createMeeting: (payload: {
    date: string;
    time: string;
    userId: string;
    requestId: string;
    userName: string;
  }) => {
    return userHttpClient.post(API_ROUTES.USER.CREATE_MEETING, payload);
  },

  cancelRequest: (props: { requestId: string }) => {
    return userHttpClient.patch(
      API_ROUTES.USER.CANCEL_REQUEST(props.requestId)
    );
  },

  getMyRequests: (props: { userId: string }) => {
    return userHttpClient.get(API_ROUTES.USER.GET_MY_REQUESTS(props.userId));
  },

  getRequestRedeemDetails: (props: { requestRedeemId: string }) => {
    return userHttpClient.get(
      API_ROUTES.USER.GET_REQUEST_REDEEM_DETAILS(props.requestRedeemId)
    );
  },

  getMyRedeemRequest: () => {
    return userHttpClient.get(API_ROUTES.USER.GET_MY_REQUEST_REDEEMS);
  },

  getUserReports: (props: { userId: string }) => {
    return userHttpClient.get(API_ROUTES.USER.GET_USER_REPORTS(props.userId));
  },

  updateUser: (payload: { formData: formDataType }) => {
    return userHttpClient.patch(API_ROUTES.USER.UPDATE_USER, payload);
  },

  getNofications: (props: { userId: string }) => {
    return userHttpClient.get(API_ROUTES.USER.GET_NOTIFICATIONS(props.userId));
  },

  sendMail: (payload: { recieverName: string; recieverEmail: string }) => {
    return userHttpClient.post(API_ROUTES.AUTH.SEND_MAIL, payload);
  },

  insertUser: (payload: {
    userFullName: string;
    userName: string;
    userLocation: string;
    userEmail: string;
    userPassword: string;
  }) => {
    return userHttpClient.post(API_ROUTES.AUTH.INSERT_USER, payload);
  },

  createComment: (payload: {
    requestId: string;
    commentText: string;
    userId: string;
  }) => {
    return userHttpClient.post(API_ROUTES.USER.CREATE_COMMENT, payload);
  },

  getComments: (props: { requestId: string; count: number }) => {
    return userHttpClient.get(
      API_ROUTES.USER.GET_COMMENTS(props.requestId, props.count)
    );
  },

  updateNotificaitonStatus: (props: { userId: string }) => {
    return userHttpClient.patch(
      API_ROUTES.USER.UPDATE_NOTIFICATIONS(props.userId)
    );
  },

  logout: () => {
    return userHttpClient.post(API_ROUTES.AUTH.LOGOUT);
  },
};
