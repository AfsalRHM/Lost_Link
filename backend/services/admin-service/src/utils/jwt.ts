import jwt from "jsonwebtoken";

import jwtPayload from "../interface/IjwtPayload";

const accessTokenSecret =
  process.env.JWT_ACCESS_SECRETKEY || "REFRESH_SECRET_KEY";
const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRETKEY || "ACCESS_SECRET_KEY";

const accessExpiration = "1d";
const refreshExpiration = "1w";

export default class jwtFunctions {
  static generateAccessToken(admin: jwtPayload): string {
    return jwt.sign(admin, accessTokenSecret, { expiresIn: accessExpiration });
  }

  static generateRefreshToken(admin: jwtPayload): string {
    return jwt.sign(admin, refreshTokenSecret, { expiresIn: refreshExpiration });
  }

  static verifyAccessToken(token: string): jwtPayload | null {
    try {
      const decoded = jwt.verify(token, accessTokenSecret);
      return decoded as any;
    } catch (error) {
      throw new Error()
    }
  }

  static verifyRefreshToken(token: string): jwtPayload | null {
    try {
      const decoded = jwt.verify(token, refreshTokenSecret);
      return decoded as any;
    } catch (error) {
      return null;
    }
  }
}
