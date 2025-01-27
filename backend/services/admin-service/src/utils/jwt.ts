import jwt from "jsonwebtoken";

import { jwtPayload } from "../interface/IjwtTypes";

let adminAccessTokenSecret = "";
let adminRefreshTokenSecret = "";

if (process.env.ADMIN_JWT_ACCESS_SECRETKEY) {
  adminAccessTokenSecret = process.env.ADMIN_JWT_ACCESS_SECRETKEY;
} else {
  console.log("No process.env.ADMIN_JWT_ACCESS_SECRETKEY Available");
}

if (process.env.ADMIN_JWT_REFRESH_SECRETKEY) {
  adminRefreshTokenSecret = process.env.ADMIN_JWT_REFRESH_SECRETKEY;
} else {
  console.log("No process.env.ADMIN_JWT_REFRESH_SECRETKEY Available");
}

const accessExpiration = "5s";
const refreshExpiration = "1d";

export default class jwtFunctions {
  /******* Functions For Admin JWT Verifications ********************************************************************************/
  static generateAdminAccessToken(admin: jwtPayload): string {
    return jwt.sign(admin, adminAccessTokenSecret, {
      expiresIn: accessExpiration,
    });
  }

  static generateAdminRefreshToken(admin: jwtPayload): string {
    return jwt.sign(admin, adminRefreshTokenSecret, {
      expiresIn: refreshExpiration,
    });
  }

  static verifyAdminAccessToken(token: string): jwtPayload | null {
    try {
      if (!token) {
        throw new Error("Token is undefined or null.");
      }
      const decoded = jwt.verify(token, adminAccessTokenSecret);
      return decoded as any;
    } catch (error) {
      return null;
    }
  }

  static verifyAdminRefreshToken(token: string): jwtPayload | null {
    try {
      const decoded = jwt.verify(token, adminRefreshTokenSecret);
      return decoded as any;
    } catch (error) {
      return null;
    }
  }
}
