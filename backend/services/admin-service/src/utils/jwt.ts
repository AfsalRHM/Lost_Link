import jwt from "jsonwebtoken";

import { jwtPayload } from "../interface/IjwtTypes";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "❌ Access Secret and Refresh Secret is not defined in environment variables."
  );
}

const accessExpiration = "1d";
const refreshExpiration = "1w";

export default class jwtFunctions {
  /******* Functions For Admin JWT Verifications ********************************************************************************/
  static generateAdminAccessToken(admin: jwtPayload): string {
    return jwt.sign(admin, JWT_ACCESS_SECRET!, {
      expiresIn: accessExpiration,
    });
  }

  static generateAdminRefreshToken(admin: jwtPayload): string {
    return jwt.sign(admin, JWT_REFRESH_SECRET!, {
      expiresIn: refreshExpiration,
    });
  }

  static verifyAdminAccessToken(token: string): jwtPayload | null {
    try {
      if (!token) {
        throw new Error("Token is undefined or null.");
      }
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET!);
      return decoded as any;
    } catch (error) {
      return null;
    }
  }

  static verifyAdminRefreshToken(token: string): jwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET!);
      return decoded as any;
    } catch (error) {
      return null;
    }
  }
}
