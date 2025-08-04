import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

interface IAccessTokenJwtReturn {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface IRefreshTokenJwtReturn {
  id: string;
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "❌ Access Secret and Refresh Secret is not defined in environment variables."
  );
}

export const verifyAccessToken = ({
  token,
}: {
  token: string;
}): IAccessTokenJwtReturn | null => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as IAccessTokenJwtReturn;
    }

    return null;
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = ({
  token,
}: {
  token: string;
}): IRefreshTokenJwtReturn | null => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    if (typeof decoded === "object" && decoded !== null) {
      return decoded as IRefreshTokenJwtReturn;
    }

    return null;
  } catch (err) {
    return null;
  }
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
};
