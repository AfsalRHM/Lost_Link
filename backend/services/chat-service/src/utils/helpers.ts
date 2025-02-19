import jwtFunctions from "./jwt";

interface tokenType {
  token: string;
}

export function getUserIdFromToken({ token }: tokenType) {
  try {
    if (!token) {
      throw new Error("Token is undefined or null.");
    }
    const decoded = jwtFunctions.verifyAccessToken(token);
    if (decoded) {
      return decoded.id;
    }
    return decoded;
  } catch (error) {
    console.log("Unable to Get Details From the Token");
    throw new Error();
  }
}

export function getAdminIdFromToken({ token }: tokenType) {
  try {
    if (!token) {
      throw new Error("Token is undefined or null.");
    }
    const decoded = jwtFunctions.verifyAdminAccessToken(token);
    if (decoded) {
      return decoded.id;
    }
    return decoded;
  } catch (error) {
    console.log("Unable to Get Details From the Token");
    throw new Error();
  }
}
