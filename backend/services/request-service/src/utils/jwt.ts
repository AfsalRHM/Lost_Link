import jwt from "jsonwebtoken";

import jwtPayload from "../interface/IjwtPayload";

let accessTokenSecret = "";
let refreshTokenSecret = "";
let adminAccessTokenSecret = "";
let adminRefreshTokenSecret = "";

if (process.env.ADMIN_JWT_ACCESS_SECRETKEY) {
  adminAccessTokenSecret = process.env.ADMIN_JWT_ACCESS_SECRETKEY;
} else {
  console.log("No process.env.JWT_ACCESS_SECRETKEY Available");
}

if (process.env.ADMIN_JWT_REFRESH_SECRETKEY) {
  adminRefreshTokenSecret = process.env.ADMIN_JWT_REFRESH_SECRETKEY;
} else {
  console.log("No process.env.JWT_ACCESS_SECRETKEY Available");
}

if (process.env.JWT_ACCESS_SECRETKEY) {
  accessTokenSecret = process.env.JWT_ACCESS_SECRETKEY;
} else {
  console.log("No process.env.JWT_ACCESS_SECRETKEY Available");
}

if (process.env.JWT_REFRESH_SECRETKEY) {
  refreshTokenSecret = process.env.JWT_REFRESH_SECRETKEY;
} else {
  console.log("No process.env.JWT_REFRESH_SECRETKEY Available");
}

const accessExpiration = "1d";
const refreshExpiration = "2w";

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
      throw new Error();
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

  static verifyAdminAccessToken(token: string): jwtPayload | null {
    try {
      const decoded = jwt.verify(token, adminAccessTokenSecret);
      return decoded as any;
    } catch (error) {
      throw new Error();
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
