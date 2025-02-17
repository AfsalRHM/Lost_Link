import jwtFunctions from "./jwt";

interface getUserIdFromTokenType {
  token: string;
}

export function getUserIdFromToken({ token }: getUserIdFromTokenType) {
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
