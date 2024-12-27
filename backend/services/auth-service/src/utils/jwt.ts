import jwt from "jsonwebtoken";

import jwtPayload from "../interface/IjwtPayload";

const accessTokenSecret =
  process.env.JWT_ACCESS_SECRETKEY || "REFRESH_SECRET_KEY";
const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRETKEY || "ACCESS_SECRET_KEY";

const accessExpiration = "5s";
const refreshExpiration = "1m";

export default class jwtFunctions {
  static generateAccessToken(user: jwtPayload): string {
    return jwt.sign(user, accessTokenSecret, { expiresIn: accessExpiration });
  }

  static generateRefreshToken(user: jwtPayload): string {
    return jwt.sign(user, refreshTokenSecret, { expiresIn: refreshExpiration });
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
