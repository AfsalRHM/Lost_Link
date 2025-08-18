export const API_ROUTES = {
  AUTH: {
    SEND_MAIL: "/auth/send-mail",
    INSERT_USER: "/auth/insert-user",
    LOGIN: "/auth/login-verify",
    GOOGLE_LOGIN: "/auth/google-login",
    REFRESH: "/auth/refreshToken",
    CHANGE_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD_OTP: "/auth/send-reset-password-otp",
    LOGOUT: "/auth/logout",
  },
  USER: {
    GET_MY_REPORTS: "/request/get-my-reports",
    GET_ALL_REQUESTS: (
      location: string,
      minReward: number,
      maxReward: number
    ) => {
      let url = `/request?min=${minReward}&max=${maxReward}`;
      if (location && location.trim())
        url += `&l=${encodeURIComponent(location)}`;
      return url;
    },
    GET_MY_REQUEST_DETAILS: (requestId: string) =>
      `/request/${requestId}/request/my`,
    GET_REQUEST_DETAILS: "/request/get-request-details",
    UPDATE_LIKE: (requestId: string) => `/request/${requestId}/like`,
    CREATE_REDEEM_REQUEST: "/request/create-redeem-request",
    CREATE_REQUEST: "/request/create-request",
    CREATE_PAYMENT_SESSION: "/request/create-checkout-session",
    REPORT_REQUEST: "/request/report-request",
    SEND_MESSAGE: "/chat/send-message",
    GET_CHAT: (requestId: string) => `/chat/${requestId}`,
    GET_MESSAGES: (chatId: string) => `/chat/${chatId}/messages`,
    GET_PROFILE: "/user/get-profile",
    GET_MEETINGS: (userId: string) => `/chat/${userId}/meetings`,
    CREATE_MEETING: "/chat",
    CANCEL_REQUEST: (requestId: string) => `/request/${requestId}`,
    GET_MY_REQUESTS: (userId: string) => `/request/${userId}/requests`,
    GET_REQUEST_REDEEM_DETAILS: (requestRedeemId: string) =>
      `/request/redeem-request/${requestRedeemId}`,
    GET_MY_REQUEST_REDEEMS: `/request/redeem-request/my`,
    GET_USER_REPORTS: (userId: string) => `/request/${userId}/reports`,
    UPDATE_USER: "/user",
    GET_NOTIFICATIONS: (userId: string) => `/notif/${userId}/my`,
    CREATE_COMMENT: "/request/comments",
    GET_COMMENTS: (requestId: string, count: number) =>
      `/request/${requestId}/comments?count=${count}`,
    UPDATE_NOTIFICATIONS: (userId: string) => `/notif/${userId}`,
  },
  ADMIN: {
    CREATE_ADMIN: "/admin",
    LOGIN: "/admin/login-verify",
    GET_ADMINS: (page: number, limit: number, search?: string) => {
      let url = `/admin?p=${page}&l=${limit}`;
      if (search && search.trim()) url += `&s=${encodeURIComponent(search)}`;
      return url;
    },
    GET_USERS: (page: number, limit: number, search?: string) => {
      let url = `/user/admin?p=${page}&l=${limit}`;
      if (search && search.trim()) url += `&s=${encodeURIComponent(search)}`;
      return url;
    },
    GET_REQUESTS: (page: number, limit: number, search?: string) => {
      let url = `/request/admin?p=${page}&l=${limit}`;
      if (search && search.trim()) url += `&s=${encodeURIComponent(search)}`;
      return url;
    },
    GET_REDEEM_REQUESTS: (page: number, limit: number, search?: string) => {
      let url = `/request/admin/redeem-request?p=${page}&l=${limit}`;
      if (search && search.trim()) url += `&s=${encodeURIComponent(search)}`;
      return url;
    },
    GET_MEETS: (
      page: number,
      limit: number,
      activeTab: string,
      search?: string
    ) => {
      let url = `/chat/admin/meet/all?p=${page}&l=${limit}&f=${activeTab}`;
      if (search && search.trim()) url += `&s=${encodeURIComponent(search)}`;
      return url;
    },
    GET_ALL_USERS: "/user/admin/analytics/all",
    GET_ALL_REQUESTS: "/request/admin/analytics/all",
    GET_ALL_REDEEM_REQUESTS: "/request/admin/redeem-request/analytics/all",
    UPDATE_ADMIN: (adminId: string) => `/admin/${adminId}`,
    GET_USER_CHATS: (userId: string) => `/chat/admin/${userId}`,
    GET_MESSAGES: (chatId: string) => `/chat/admin/${chatId}/messages`,
    SEND_MESSAGE: "chat/send-admin-message",
    GET_COMMENTS: (requestId: string, count: number) =>
      `/request/admin/${requestId}/comments?count=${count}`,
    GET_MEET: (meetId: string) => `/chat/admin/meet/${meetId}`,
    GET_REDEEM_REQUEST_DETAILS: (redeemRequestId: string) =>
      `/request/admin/redeem-request/${redeemRequestId}`,
    UPDATE_REDEEM_REQUEST: "/request/admin/update-redeem-request",
    GET_REQUEST_DETAILS: (requestId: string) => `/request/admin/${requestId}`,
    UPDATE_REQUEST: (requestId: string) => `/request/admin/${requestId}`,
    CANCEL_REQUEST: (requestId: string) => `/request/admin/${requestId}/cancel`,
    GET_NOTIFICATIONS: "/notif/admin",
    UPDATE_NOTIFICATION: (notificationId: string) =>
      `/notif/admin/${notificationId}`,
    UPDATE_NOTIFICATIONS: "/notif/admin/all",
    LOGOUT: "/admin/logout",
    GET_USER_DETAILS: (userId: string) => `/user/admin/${userId}`,
    UPDATE_USER: (userId: string) => `/admin/user/${userId}`,
  },
};
